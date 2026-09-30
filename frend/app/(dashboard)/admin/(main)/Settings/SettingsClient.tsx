"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  UserPlus,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Info,
  MapPin,
  AlertTriangle,
} from "lucide-react";

interface SettingsClientProps {
  initialProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  initialAbout: {
    foundedYear: string;
    statFamilies: string;
    statNurses: string;
    statCities: string;
    statRating: string;
    storyParagraph1: string;
    storyParagraph2: string;
  };
  initialContact: {
    email: string;
    phone: string;
    emergencyPhone: string;
    location: string;
    workingHours: string;
  };
}

export default function SettingsClient({
  initialProfile,
  initialAbout,
  initialContact,
}: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "aboutContent" | "contactInfo" | "security" | "addAdmin" | "notifications"
  >("profile");

  const [profile, setProfile] = useState(initialProfile);
  const [aboutData, setAboutData] = useState(initialAbout);
  const [contactData, setContactData] = useState(initialContact);

  // تغيير كلمة المرور
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // إضافة أدمن جديد
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // تفضيلات الإشعارات
  const [notifications, setNotifications] = useState({
    emailOnNewNurse: true,
    emailOnNewPatient: true,
    emailOnAppointment: false,
    systemAlerts: true,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetAlerts = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // 1. تحديث الملف الشخصي
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      await axios.put(
        "http://localhost:5000/api/admin/update-profile",
        {
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
        },
        { withCredentials: true }
      );

      setSuccessMessage("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // 2. تحديث محتوى About Us
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      await axios.put(
        "http://localhost:5000/api/settings/about_content",
        aboutData,
        { withCredentials: true }
      );

      setSuccessMessage("About Us page content updated successfully!");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update About content");
    } finally {
      setLoading(false);
    }
  };

  // 3. تحديث محتوى Contact Us
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      await axios.put(
        "http://localhost:5000/api/settings/contact_info",
        contactData,
        { withCredentials: true }
      );

      setSuccessMessage("Contact details updated successfully!");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update Contact details");
    } finally {
      setLoading(false);
    }
  };

  // 4. تغيير كلمة المرور
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAlerts();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/admin/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true }
      );

      setSuccessMessage("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // 5. إضافة مسؤول جديد
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAlerts();

    if (newAdmin.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/admin/create",
        {
          first_name: newAdmin.firstName,
          last_name: newAdmin.lastName,
          email: newAdmin.email,
          password: newAdmin.password,
          role: "admin",
        },
        { withCredentials: true }
      );

      setSuccessMessage("New administrator created successfully!");
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to create administrator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* شريط التبويبات الجانبي */}
        <nav className="flex md:flex-col gap-1 w-full md:w-64 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Info</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("aboutContent");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "aboutContent"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Us Page</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("contactInfo");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "contactInfo"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("security");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "security"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Password & Security</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("addAdmin");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "addAdmin"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("notifications");
              resetAlerts();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "notifications"
                ? "bg-[#0d6e6e] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </nav>

        {/* محتوى التبويبات */}
        <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* TAB 1: Profile Info */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display name and contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Email address cannot be changed directly for security.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+961 ..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: About Us Page Settings */}
          {activeTab === "aboutContent" && (
            <form onSubmit={handleAboutSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">About Us Page Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update statistics and public milestones shown on the About Us page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Families Served (Stat 1)
                  </label>
                  <input
                    type="text"
                    value={aboutData.statFamilies}
                    onChange={(e) => setAboutData({ ...aboutData, statFamilies: e.target.value })}
                    placeholder="10,000+"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Verified Nurses (Stat 2)
                  </label>
                  <input
                    type="text"
                    value={aboutData.statNurses}
                    onChange={(e) => setAboutData({ ...aboutData, statNurses: e.target.value })}
                    placeholder="2,500+"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cities Covered (Stat 3)
                  </label>
                  <input
                    type="text"
                    value={aboutData.statCities}
                    onChange={(e) => setAboutData({ ...aboutData, statCities: e.target.value })}
                    placeholder="40+"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Average Rating (Stat 4)
                  </label>
                  <input
                    type="text"
                    value={aboutData.statRating}
                    onChange={(e) => setAboutData({ ...aboutData, statRating: e.target.value })}
                    placeholder="4.9/5"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Founded Year
                  </label>
                  <input
                    type="text"
                    value={aboutData.foundedYear}
                    onChange={(e) => setAboutData({ ...aboutData, foundedYear: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Our Story Paragraph 1 (Optional Custom Text)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutData.storyParagraph1}
                    onChange={(e) => setAboutData({ ...aboutData, storyParagraph1: e.target.value })}
                    placeholder="Describe how the company was founded..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all resize-y"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save About Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Contact Info Settings */}
          {activeTab === "contactInfo" && (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Contact Details Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update public reach-out points displayed on the Contact page.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="support@nurseconnect.health"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="+961 00 000 000"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-700 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Emergency Hotline Number
                  </label>
                  <input
                    type="text"
                    value={contactData.emergencyPhone}
                    onChange={(e) =>
                      setContactData({ ...contactData, emergencyPhone: e.target.value })
                    }
                    placeholder="112 / +961 00 000 000"
                    className="w-full px-3.5 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-sm text-rose-900 focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Office / Country Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={contactData.location}
                      onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                      placeholder="Beirut, Lebanon"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Working Hours Text
                  </label>
                  <input
                    type="text"
                    value={contactData.workingHours}
                    onChange={(e) =>
                      setContactData({ ...contactData, workingHours: e.target.value })
                    }
                    placeholder="24/7 Available"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Contact Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Password & Security */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ensure your account uses a secure, modern password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0d6e6e] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-relaxed">
                  <p className="font-semibold">Password Guidelines:</p>
                  <p className="mt-0.5 text-teal-700">
                    Must be at least 6 characters, combining uppercase letters, numbers, and special symbols.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: Add Admin */}
          {activeTab === "addAdmin" && (
            <form onSubmit={handleAddAdminSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Add Administrator</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a new administrator account with full platform management privileges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                    placeholder="e.g. Ahmad"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                    placeholder="e.g. Khoury"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@nurseconnect.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Initial Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Create Admin Account</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Email & Alert Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which administrative events trigger automated notifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">New Nurse Applications</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Receive immediate email alerts when a nurse submits a profile.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailOnNewNurse}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailOnNewNurse: e.target.checked })
                    }
                    className="w-4 h-4 text-[#0d6e6e] rounded border-slate-300 focus:ring-[#0d6e6e]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      New Patient Registrations
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Get notified whenever a patient signs up for home healthcare.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailOnNewPatient}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailOnNewPatient: e.target.checked })
                    }
                    className="w-4 h-4 text-[#0d6e6e] rounded border-slate-300 focus:ring-[#0d6e6e]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Appointment Bookings</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Daily summary of upcoming visits and completed sessions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailOnAppointment}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailOnAppointment: e.target.checked })
                    }
                    className="w-4 h-4 text-[#0d6e6e] rounded border-slate-300 focus:ring-[#0d6e6e]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSuccessMessage("Notification preferences saved successfully!")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}