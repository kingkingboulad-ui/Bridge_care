"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface Booking {
  id: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  care_type?: string;
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  location?: string;
  notes?: string;
  booking_date?: string;
  start_date?: string;
  duration?: string | number;
  created_at?: string;
}

interface NurseProfile {
  id: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: string | number;
  location?: string;
  price?: string | number;
  rating?: string | number;
  reviews?: string | number;
  image?: string;
  cv_file?: string;
  cvFile?: string;
  status?: string;
}

export default function NurseProfilePage() {
  const { lang, dir, t } = useLanguage();
const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [showCvModal, setShowCvModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    location: "",
    price: "",
    specialization: "",
    experience: "",
    phone: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, bookingsResponse] = await Promise.all([
     fetch(`${API_URL}/api/nurses/me`, {
  credentials: "include",
}),
fetch(`${API_URL}/api/nurses/my-bookings`, {
  credentials: "include",
}),
      ]);

      if (!profileResponse.ok) {
        throw new Error("profile");
      }

      const profileData = await profileResponse.json();

      const bookingsData = bookingsResponse.ok
        ? await bookingsResponse.json()
        : [];

      const nurseProfile =
        profileData?.profile ||
        profileData?.nurse ||
        profileData?.data ||
        profileData;

      const nurseBookings =
        bookingsData?.bookings ||
        bookingsData?.data ||
        (Array.isArray(bookingsData) ? bookingsData : []);

      setProfile(nurseProfile);
      setBookings(nurseBookings || []);

      setEditFormData({
        location: nurseProfile?.location || "",
        price: nurseProfile?.price?.toString() || "",
        specialization: nurseProfile?.specialization || "",
        experience: nurseProfile?.experience?.toString() || "",
        phone: nurseProfile?.phone || "",
      });

  setImagePreview(
  nurseProfile?.image
    ? nurseProfile.image.startsWith("http")
      ? nurseProfile.image
      : `${process.env.NEXT_PUBLIC_API_URL}${nurseProfile.image}`
    : ""
);
    } catch (err) {
      console.error(err);
      setError(t("nurse.couldNotLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusLabel = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return t("nurse.pending");

      case "accepted":
        return t("nurse.accepted");

      case "rejected":
        return t("nurse.rejected");

      case "completed":
        return t("nurse.completed");

      default:
        return status;
    }
  };

  const getStatusClass = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleCvChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCvFile(file);
  };

  const handleStatusChange = async (
    bookingId: number,
    status: "accepted" | "rejected" | "completed"
  ) => {
    try {
      setActionLoading(bookingId);

  const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/bookings/${bookingId}/status`,
  {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  }
);

      if (!response.ok) {
        throw new Error("status");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status }
            : booking
        )
      );
    } catch (err) {
      console.error(err);
      alert(t("nurse.failedUpdateStatus"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      t("nurse.confirmDelete")
    );

    if (!confirmed) return;

    try {
      setActionLoading(bookingId);

      const response = await fetch(
        `http://localhost:5000/api/nurses/bookings/${bookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("delete");
      }

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );
    } catch (err) {
      console.error(err);
      alert(t("nurse.failedDelete"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("location", editFormData.location);
      formData.append("price", editFormData.price);
      formData.append(
        "specialization",
        editFormData.specialization
      );
      formData.append("experience", editFormData.experience);
      formData.append("phone", editFormData.phone);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (cvFile) {
        formData.append("cvFile", cvFile);
      }

      const response = await fetch(
   `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/me/update`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("update");
      }

      await fetchData();

      setIsEditing(false);
      setImageFile(null);
      setCvFile(null);
    } catch (err) {
      console.error(err);
      alert(t("nurse.failedUpdateProfile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        dir={dir}
        className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00535B]" />

          <p className="mt-4 text-gray-600">
            {t("nurse.loadingData")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        dir={dir}
        className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900">
            {t("nurse.profileNotAccessible")}
          </h2>

          <p className="text-gray-600 mt-2">
            {error || t("nurse.pleaseLogin")}
          </p>

          <a
            href="/Sign-in"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#00535B] text-white font-semibold hover:bg-[#00464d] transition"
          >
            {t("nurse.signIn")}
          </a>
        </div>
      </div>
    );
  }

  const fullName =
    profile.name ||
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    t("nurse.registeredNurse");

  const cvUrl =
    profile.cv_file || profile.cvFile
      ? (profile.cv_file || profile.cvFile)!.startsWith("http")
        ? profile.cv_file || profile.cvFile
        : `http://localhost:5000${
            profile.cv_file || profile.cvFile
          }`
      : "";

  const profileImage = imagePreview;

  const isApproved =
    profile.status === "approved" ||
    profile.status === "active";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="h-32 bg-gradient-to-r from-[#00535B] to-[#2B7A9F] relative">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute right-4 top-4 px-4 py-2 rounded-xl bg-white/90 text-[#00535B] font-semibold text-sm hover:bg-white transition"
            >
              {isEditing
                ? t("nurse.cancel")
                : t("nurse.editProfile")}
            </button>
          </div>

          <div className="px-6 sm:px-8 pb-8">

            {/* Profile top */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">

              {/* Image */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="w-full h-full rounded-xl object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
                      <User className="w-14 h-14 text-gray-400" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        imageInputRef.current?.click()
                      }
                      className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#00535B] text-white flex items-center justify-center shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {fullName}
                  </h1>

                  {isApproved && (
                    <ShieldCheck className="w-6 h-6 text-[#00535B]" />
                  )}
                </div>

                {/* Specialization badge */}
                {/* Specialization badge */}
<div className="mt-8">
  <p className="inline-block px-5 py-2 rounded-full bg-[#00535B]/10 text-[#00535B] text-sm font-semibold">
    {profile.specialization ||
      t("nurse.registeredNurse")}
  </p>
</div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#00535B]" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#00535B]" />
                      <span>{profile.phone}</span>
                    </div>
                  )}

                  {profile.rating !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {profile.rating || "0"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CV button */}
              {!isEditing && cvUrl && (
                <div className="pb-2">
                  <button
                    onClick={() => setShowCvModal(true)}
                    className="px-5 py-3 rounded-xl border border-[#00535B] text-[#00535B] font-semibold hover:bg-[#00535B] hover:text-white transition flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    {t("nurse.viewMyCV")}
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  {t("nurse.hourlyRate")}
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  ${profile.price || "0"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  {t("nurse.totalBookings")}
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {bookings.length}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  {t("nurse.experience")}
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {profile.experience || "0"}{" "}
                  {t("nurse.years")}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  {t("nurse.reviews")}
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {profile.reviews || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* APPLICATION STATUS */}
        {!isApproved && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />

            <div>
              <h3 className="font-bold text-yellow-800">
                {t("nurse.applicationUnderReview")}
              </h3>

              <p className="text-sm text-yellow-700 mt-1">
                {t("nurse.waitingApproval")}
              </p>
            </div>
          </div>
        )}

        {/* CV SECTION */}
        {!isEditing && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#00535B]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#00535B]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("nurse.curriculumVitae")}
                </h2>

                <p className="text-sm text-gray-500">
                  {cvUrl
                    ? t("nurse.verifiedSubmitted")
                    : t("nurse.noCV")}
                </p>
              </div>
            </div>

            {cvUrl ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCvModal(true)}
                  className="px-5 py-3 rounded-xl bg-[#00535B] text-white font-semibold hover:bg-[#00464d] transition flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {t("nurse.previewCV")}
                </button>

                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  {t("nurse.openNewTab")}
                </a>
              </div>
            ) : (
              <p className="text-gray-500">
                {t("nurse.noCV")}
              </p>
            )}
          </div>
        )}

        {/* EDIT PROFILE */}
        {isEditing && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("nurse.editProfileDetails")}
              </h2>

              <p className="text-gray-500 mt-1">
                {t("nurse.updateQualifications")}
              </p>
            </div>

            <div className="space-y-7">

              {/* Image & CV */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Profile image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.profileImage")}
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      imageInputRef.current?.click()
                    }
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#00535B] transition"
                  >
                    <ImageIcon className="w-8 h-8 mx-auto text-[#00535B]" />

                    <p className="mt-2 font-semibold text-gray-700">
                      {t("nurse.change")}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {t("nurse.uploadNewPhoto")}
                    </p>
                  </button>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* CV */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.replaceCV")}
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      cvInputRef.current?.click()
                    }
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#00535B] transition"
                  >
                    <Upload className="w-8 h-8 mx-auto text-[#00535B]" />

                    <p className="mt-2 font-semibold text-gray-700">
                      {cvFile
                        ? cvFile.name
                        : t("nurse.change")}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {t("nurse.uploadPDFImage")}
                    </p>
                  </button>

                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleCvChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.specialization")}
                  </label>

                  <input
                    type="text"
                    value={editFormData.specialization}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        specialization: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00535B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.experience")}
                  </label>

                  <input
                    type="text"
                    value={editFormData.experience}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        experience: e.target.value,
                      })
                    }
                    placeholder={t("nurse.experienceExample")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00535B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.rate")}
                  </label>

                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00535B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.locationCity")}
                  </label>

                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00535B]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("nurse.phoneNumber")}
                  </label>

                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00535B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  {t("nurse.cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#00535B] text-white font-semibold hover:bg-[#00464d] disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}

                  {t("nurse.saveAllChanges")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("nurse.allPatientBookings")}
              </h2>

              <p className="text-gray-500 mt-1">
                {t("nurse.manageBookings")}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#00535B]/10 text-[#00535B] font-semibold">
              {t("nurse.total")}: {bookings.length}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-14">
              <Calendar className="w-12 h-12 mx-auto text-gray-300" />

              <p className="text-gray-500 mt-4">
                {t("nurse.noBookings")}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-2xl p-5"
                >
                  {/* Booking header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {t("nurse.request")} #{booking.id}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      {booking.created_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          {t("nurse.bookedOn")}{" "}
                          {new Date(
                            booking.created_at
                          ).toLocaleDateString(
                            lang === "ar" ? "ar-LB" : "en-US"
                          )}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteBooking(booking.id)
                      }
                      disabled={actionLoading === booking.id}
                      className="w-10 h-10 rounded-xl border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 disabled:opacity-50"
                    >
                      {actionLoading === booking.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Booking details */}
                  <div className="grid md:grid-cols-2 gap-5 mt-6">

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00535B]/10 flex items-center justify-center shrink-0">
                        <HeartIcon />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t("nurse.careType")}
                        </p>

                        <p className="font-semibold text-gray-900">
                          {booking.care_type ||
                            t("nurse.notProvided")}
                        </p>

                        {booking.patient_name && (
                          <p className="text-sm text-gray-500 mt-1">
                            {t("nurse.for")}:{" "}
                            {booking.patient_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00535B]/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[#00535B]" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t("nurse.dateDuration")}
                        </p>

                        <p className="font-semibold text-gray-900">
                          {booking.booking_date ||
                            booking.start_date ||
                            t("nurse.notProvided")}
                        </p>

                        {booking.duration && (
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.duration}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00535B]/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-[#00535B]" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t("nurse.patientContact")}
                        </p>

                        <p className="font-semibold text-gray-900">
                          {booking.patient_phone ||
                            t("nurse.noPhone")}
                        </p>

                        {booking.patient_email && (
                          <p className="text-sm text-gray-500 mt-1 break-all">
                            {booking.patient_email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00535B]/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#00535B]" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          {t("nurse.location")}
                        </p>

                        <p className="font-semibold text-gray-900">
                          {booking.location ||
                            t("nurse.notProvided")}
                        </p>

                        {booking.location && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              booking.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#00535B] mt-1 inline-block hover:underline"
                          >
                            {t("nurse.viewMap")}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("nurse.notes")}
                      </p>

                      <p className="text-sm text-gray-700">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-6">

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              booking.id,
                              "rejected"
                            )
                          }
                          disabled={
                            actionLoading === booking.id
                          }
                          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
                        >
                          {t("nurse.decline")}
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              booking.id,
                              "accepted"
                            )
                          }
                          disabled={
                            actionLoading === booking.id
                          }
                          className="px-4 py-2.5 rounded-xl bg-[#00535B] text-white font-semibold hover:bg-[#00464d] disabled:opacity-50"
                        >
                          {t("nurse.acceptBooking")}
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleStatusChange(
                            booking.id,
                            "completed"
                          )
                        }
                        disabled={
                          actionLoading === booking.id
                        }
                        className="px-4 py-2.5 rounded-xl bg-[#00535B] text-white font-semibold hover:bg-[#00464d] disabled:opacity-50"
                      >
                        {t("nurse.markCompleted")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CV MODAL */}
      {showCvModal && cvUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">

            {/* Modal header */}
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">
                {t("nurse.cvPreview")}
              </h2>

              <div className="flex items-center gap-2">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#00535B] text-white text-sm font-semibold"
                >
                  {t("nurse.open")}
                </a>

                <button
                  onClick={() => setShowCvModal(false)}
                  className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CV */}
            <div className="flex-1 bg-gray-100 p-3 overflow-auto">
              {cvUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={cvUrl}
                  title={t("nurse.cvPreview")}
                  className="w-full h-full rounded-xl bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={cvUrl}
                    alt={t("nurse.cvPreview")}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Small icon component */
function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00535B]"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
