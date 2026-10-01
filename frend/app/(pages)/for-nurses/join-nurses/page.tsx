'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

// تعريف خطوات التسجيل والتحقق
type OnboardingStep = 'FORM' | 'LICENSE' | 'BACKGROUND' | 'ACTIVATED';

export default function NurseOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('FORM');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // FormData State - تم إضافة tags هنا
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    experience: '',
    location: '',
    price:'',
    // tags: '', 
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (res.data?.user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // دالة تقديم الطلب
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (!isLoggedIn) {
        alert('You must be logged in to submit an application.');
        return;
      }

      if (!licenseFile || !cvFile) {
        alert('Please upload both your nursing license and CV.');
        return;
      }

      if (
        !formData.specialization ||
        !formData.experience ||
        !formData.location
      ) {
        alert('Please complete all professional information fields.');
        return;
      }

      setLoading(true);

      const data = new FormData();
      data.append('specialization', formData.specialization);
      data.append('experience', formData.experience);
      data.append('location', formData.location);
      // data.append('tags', formData.tags); 
      data.append('licenseFile', licenseFile);
      data.append('cvFile', cvFile);
      data.append('price', formData.price);

      const res = await axios.post(
        'http://localhost:5000/api/nurses/apply',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', res.data);

      // الانتقال للخطوة التالية عند النجاح
      setCurrentStep('LICENSE');
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Something went wrong during submission. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f8] text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      {/* ==========================================
          STEP 1: Registration Form (joinnurses)
         ========================================== */}
      {currentStep === 'FORM' && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Text */}
          <div className="lg:col-span-4 space-y-4 pt-4">
            <span className="text-[10px] font-bold tracking-wider text-[#0d7c7b] uppercase">
              ACCOUNT CREATION
            </span>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              Join our network of trusted healthcare professionals.
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please provide your personal information, professional credentials, and documentation for verification. Our team reviews all applications within 24-48 hours.
            </p>
            <div className="pt-8 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SECURE REGISTRATION PORTAL
            </div>
          </div>

          {/* Right Column Form Card */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
            {/* Section 01 */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2 border-slate-100">
                01 / Personal Information
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                  />
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 mt-1">Session price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="50$"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                  />
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2 border-slate-100">
                02 / Professional Profile
              </h2>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Primary Specialization</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0d7c7b]"
                    >
                      <option value="">Select specialization...</option>
                      <option value="rn">Registered Nurse (RN)</option>
                      <option value="lpn">Licensed Practical Nurse (LPN)</option>
                      <option value="icu">ICU Specialist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Years of Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0d7c7b]"
                    >
                      <option value="">Select years...</option>
                      <option value="1-3">1-3 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Current Location / Region</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                  />
                </div>

                {/* حقل Tags الجديد */}
                {/* <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Skills / Tags <span className="text-slate-400 font-normal lowercase">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g. Elderly Care, Night Shifts, CPR Certified, Emergency"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0d7c7b]"
                  />
                </div> */}
              </div>
            </div>

            {/* Section 03 */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1">03 / Credential Upload</h2>
              <p className="text-[11px] text-slate-400 mb-4">Accepted formats: PDF, JPG, PNG (Max 5MB per file)</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Nursing License */}
                <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0d7c7b] rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="license-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setLicenseFile)}
                  />

                  {!licenseFile ? (
                    <label htmlFor="license-upload" className="cursor-pointer block">
                      <div className="w-9 h-9 rounded-full bg-teal-50 text-[#0d7c7b] flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                        📷
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700">Click to upload license</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">NURSING LICENSE / CERTIFICATE</p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between text-left bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm">📄</span>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{licenseFile.name}</p>
                          <p className="text-[9px] text-slate-400">{(licenseFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLicenseFile(null)}
                        className="text-slate-400 hover:text-rose-500 text-xs font-bold p-1 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload CV */}
                <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0d7c7b] rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setCvFile)}
                  />

                  {!cvFile ? (
                    <label htmlFor="cv-upload" className="cursor-pointer block">
                      <div className="w-9 h-9 rounded-full bg-teal-50 text-[#0d7c7b] flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                        📄
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700">Click to upload CV</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">CURRICULUM VITAE (CV)</p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between text-left bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm">📄</span>
                        <div className="truncate">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{cvFile.name}</p>
                          <p className="text-[9px] text-slate-400">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-slate-400 hover:text-rose-500 text-xs font-bold p-1 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 bg-[#e6f4f4] border border-[#bce3e3] rounded-lg p-3 text-[11px] text-[#0d7c7b] flex items-center gap-2">
                <span>🛡️</span> Your documents will be securely reviewed to verify your professional qualifications. This process is mandatory for network activation.
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-[#0d7c7b] hover:bg-[#095f5e] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>SUBMITTING...</span>
              ) : (
                <span>SUBMIT REGISTRATION →</span>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Already have an account? <span className="text-[#0d7c7b] font-bold cursor-pointer">LOG IN</span>
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 2: License Verification (check)
         ========================================== */}
      {currentStep === 'LICENSE' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0d7c7b] flex items-center justify-center text-[10px]">✓</span>
              REGISTRATION SUBMITTED
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              REF ID: #NC-88492-V
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-4">PROCESS FLOW</p>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Onboarding Status</h2>

            <div className="grid grid-cols-4 gap-2 text-center relative">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#0d7c7b] text-white font-bold flex items-center justify-center text-xs mb-2">✓</div>
                <p className="text-xs font-bold text-slate-800">ACCOUNT CREATED</p>
                <p className="text-[10px] text-slate-400">Completed</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#0d7c7b] text-[#0d7c7b] font-bold flex items-center justify-center text-xs mb-2 bg-teal-50">●</div>
                <p className="text-xs font-bold text-slate-800">LICENSE VERIFICATION</p>
                <p className="text-[10px] text-amber-600 font-medium">Under Review</p>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs mb-2">…</div>
                <p className="text-xs font-bold text-slate-800">BACKGROUND CHECK</p>
                <p className="text-[10px] text-slate-400">Pending</p>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs mb-2">🔒</div>
                <p className="text-xs font-bold text-slate-800">ACTIVATION</p>
                <p className="text-[10px] text-slate-400">Locked</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border-2 border-[#0d7c7b] rounded-2xl p-6 shadow-sm relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#0d7c7b] uppercase tracking-wider">● ACTIVE PROCESS</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">License Verification</h3>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                  ⏱ 24-48 HRS
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Our NurseConnect team is currently reviewing your uploaded credentials. Rigorous primary source verification is a mandatory step in our compliance protocol to ensure patient safety and maintain clinical excellence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">SUBMITTED DOCS</p>
                  <p className="text-xs font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                    📄 RN_License_StateBoard.pdf
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">NOTIFICATION</p>
                  <p className="text-xs font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                    ✉️ Email dispatch upon completion
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">REQUIRED ACTIONS</p>
                <h4 className="text-xs font-bold text-slate-800">Complete Profile</h4>
                <p className="text-[11px] text-slate-500">Add your photo and detailed clinical experience to expedite matching.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-rose-500 uppercase">CREDENTIALING SUPPORT</p>
                <h4 className="text-xs font-bold text-slate-800">CONTACT SUPPORT</h4>
                <p className="text-[11px] text-slate-500">Encountered an issue with your upload? Contact our NurseConnect team directly.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep('FORM')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep('BACKGROUND')}
              className="px-5 py-2 bg-[#0d7c7b] hover:bg-[#095f5e] text-white text-xs font-bold rounded-lg transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 3: Background Check (background)
         ========================================== */}
      {currentStep === 'BACKGROUND' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <button
            onClick={() => setCurrentStep('LICENSE')}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            ← Back to Onboarding Status
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Background Check</h1>
            <p className="text-xs text-slate-500">Step 3 of your clinical onboarding process.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0d7c7b] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-slate-700">Profile</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 mx-4" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0d7c7b] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-slate-700">Credentials</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 mx-4" />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0d7c7b] text-white text-xs font-bold flex items-center justify-center border-2 border-teal-600">3</span>
                <span className="text-xs font-bold text-[#0d7c7b]">Background</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 mx-4" />
              <div className="flex items-center gap-2 opacity-50">
                <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">4</span>
                <span className="text-xs font-bold text-slate-400">Activation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0d7c7b] flex items-center justify-center font-bold text-sm">
                    🔄
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">CURRENT STATUS</span>
                    <h3 className="text-base font-bold text-slate-800">In Progress</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We have initiated your background check with our secure third-party partner. This process ensures patient safety and verifies your professional history. No further action is required from you unless requested below.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Required Actions</h3>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-600 text-xs">⚠️</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Address History Verification</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Please provide your previous address for the years 2026-2027 to complete the county criminal records search.
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#0d7c7b] text-white text-xs font-bold rounded-lg hover:bg-[#095f5e] transition-colors">
                    Provide Information
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Verification Scope</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">🛡️ Criminal Records Search</li>
                  <li className="flex items-center gap-2">🆔 SSN Trace & Identity</li>
                  <li className="flex items-center gap-2">💼 Employment Verification</li>
                  <li className="flex items-center gap-2">🎓 Education Verification</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800">Timeline</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-[#0d7c7b] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <div>
                      <p className="font-bold text-slate-800">Consent Received</p>
                      <p className="text-[10px] text-slate-400">Oct 24, 09:41 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-[#0d7c7b] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <div>
                      <p className="font-bold text-slate-800">Report Requested</p>
                      <p className="text-[10px] text-slate-400">Oct 24, 10:05 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">●</span>
                    <div>
                      <p className="font-bold text-slate-800">Awaiting Results</p>
                      <p className="text-[10px] text-slate-400">Pending vendor processing</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('ACTIVATED')}
                  className="w-full py-2 bg-[#0d7c7b] hover:bg-[#095f5e] text-white text-xs font-bold rounded-lg transition-colors mt-2"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 4: Activated & Ready (Activated)
         ========================================== */}
      {currentStep === 'ACTIVATED' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d7c7b] text-white text-xs flex items-center justify-center">✓</span>
              <span className="text-[11px] font-bold text-slate-600">PROFILE</span>
            </div>
            <div className="h-0.5 w-8 bg-[#0d7c7b]" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d7c7b] text-white text-xs flex items-center justify-center">✓</span>
              <span className="text-[11px] font-bold text-slate-600">CREDENTIALS</span>
            </div>
            <div className="h-0.5 w-8 bg-[#0d7c7b]" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d7c7b] text-white text-xs flex items-center justify-center">✓</span>
              <span className="text-[11px] font-bold text-slate-600">BACKGROUND</span>
            </div>
            <div className="h-0.5 w-8 bg-[#0d7c7b]" />
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d7c7b] text-white text-xs flex items-center justify-center">✓</span>
              <span className="text-[11px] font-bold text-[#0d7c7b]">ACTIVATION</span>
            </div>
          </div>

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-[#0d7c7b] flex items-center justify-center mx-auto text-2xl border-4 border-teal-50">
              🛡️
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Account Activated & Ready for Work!
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Welcome to the team. Your clinical credentials have been verified, and your profile is now live on the NurseConnect network. You are ready to start accepting care requests and managing your schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}