"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  KeyRound,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AdminProfileData } from "./page";

interface Props {
  initialProfile: AdminProfileData;
}

export default function AdminProfileClient({ initialProfile }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfileData>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // تحديث البيانات الشخصية
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-profile`,
        {
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
        },
        { withCredentials: true }
      );

      setSaveSuccess("Profile updated successfully!");
      router.refresh(); // مزامنة البيانات عبر الـ Server Components (الهيدر وغيره)
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );

      setSaveSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Admin User";
  const displayAvatar = profile.avatarUrl
  ? profile.avatarUrl.startsWith("http")
    ? profile.avatarUrl
    : `${process.env.NEXT_PUBLIC_API_URL}/${profile.avatarUrl.replace(/^\/+/, "")}`
  : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0d6e6e&color=fff&size=128`;

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Image
              width={96}
              height={96}
              src={displayAvatar}
              alt="Admin Avatar"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-inner bg-slate-50"
            />
            <button
              type="button"
              className="absolute -bottom-2 -right-2 p-2 bg-[#0d6e6e] text-white rounded-xl shadow-md hover:bg-[#095252] transition-colors"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 capitalize">{fullName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-[#0d6e6e] border border-teal-200 w-fit mx-auto sm:mx-0 capitalize">
                <ShieldCheck className="w-3.5 h-3.5" /> {profile.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email || "No email provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#0d6e6e]" /> Personal Information
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Office / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <KeyRound className="w-4 h-4 text-[#0d6e6e]" /> Security
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-60"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          <p className="text-[11px] text-slate-400 mt-6 text-center">
            Make sure your password is at least 6 characters with mixed symbols and numbers.
          </p>
        </div>
      </div>
    </div>
  );
}