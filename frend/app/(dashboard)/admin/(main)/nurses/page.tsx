'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  Plus,
  Star,
  CheckCircle,
  Clock,
  UserX,
  Mail,
  Award,
  Loader2,
  AlertCircle,
  X,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ExternalLink,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NurseItem {
  id: number;
  user_id: number;
  name?: string;
  fullName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  specialization: string;
  role?: string;
  experience: string | number;
  location?: string;
  price: string | number;
  rating: string | number;
  reviews: number;
  image?: string | null;
  cv_file?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  categories?: string[];
  created_at?: string;
}

// دالة مساعدة لتوليد رابط الصورة بأمان
const getFullImageUrl = (imagePath?: string | null, fallbackName: string = 'Nurse') => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0d6e6e&color=fff`;
  }
  const clean = imagePath.trim();
  if (clean.startsWith('http')) return clean;
  if (clean.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL}${clean}`;
  return clean.startsWith('/') ? clean : `/${clean}`;
};

export default function NursesManagementPage() {
  const [nurses, setNurses] = useState<NurseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // حالة التحكم بالـ Pop-up والممرض المحدد
  const [selectedNurse, setSelectedNurse] = useState<NurseItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // جلب كل الممرضين
  const fetchNurses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/nurses`, {
        withCredentials: true,
      });

      const data = response.data?.nurses || response.data;
      if (Array.isArray(data)) {
        setNurses(data);
      } else {
        setNurses([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch nurses:', err);
      try {
        const fallbackRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/nurses/getall`, {
          withCredentials: true,
        });
        const fallbackData = fallbackRes.data?.nurses || fallbackRes.data || [];
        setNurses(Array.isArray(fallbackData) ? fallbackData : []);
      } catch (fallbackErr: any) {
        setError(err.response?.data?.message || 'Failed to load nurses directory');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNurses();
  }, [fetchNurses]);

  // دالة تحديث الحالة
  const handleStatusChange = async (nurseId: number, newStatus: string) => {
    const previousNurses = [...nurses];

    setNurses((prev) =>
      prev.map((nurse) =>
        nurse.id === nurseId ? { ...nurse, status: newStatus } : nurse
      )
    );

    if (selectedNurse && selectedNurse.id === nurseId) {
      setSelectedNurse((prev) => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      setUpdatingId(nurseId);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/${nurseId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update nurse status');
      setNurses(previousNurses);
      if (selectedNurse && selectedNurse.id === nurseId) {
        setSelectedNurse(previousNurses.find(n => n.id === nurseId) || null);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // دالة حذف الممرض
  const handleDeleteNurse = async (nurseId: number, nurseName: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${nurseName}"? This action cannot be undone.`);
    if (!isConfirmed) return;

    try {
      setDeletingId(nurseId);

      await axios.delete(`/api/auth/admin/nurses/${nurseId}`, {
        withCredentials: true,
      });

      // إزالة الممرض من الـ State محلياً
      setNurses((prev) => prev.filter((nurse) => nurse.id !== nurseId));

      // إذا كان المودال مفتوحاً لنفس الممرض، نغلقه
      if (selectedNurse && selectedNurse.id === nurseId) {
        setSelectedNurse(null);
      }
    } catch (err: any) {
      console.error('Failed to delete nurse:', err);
      alert(err.response?.data?.message || 'Failed to delete nurse');
    } finally {
      setDeletingId(null);
    }
  };

  // الإحصائيات
  const totalCount = nurses.length;
  const approvedCount = nurses.filter((n) => n.status === 'approved').length;
  const pendingCount = nurses.filter((n) => n.status === 'pending').length;

  const availableSpecialties = useMemo(() => {
    return Array.from(
      new Set(nurses.map((n) => n.specialization || n.role).filter(Boolean))
    );
  }, [nurses]);

  // التصفية والبحث
  const filteredNurses = useMemo(() => {
    return nurses.filter((nurse) => {
      const displayName =
        nurse.fullName ||
        nurse.name ||
        `${nurse.first_name || ''} ${nurse.last_name || ''}`.trim();
      const specialty = nurse.specialization || nurse.role || '';
      const email = nurse.email || '';

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        displayName.toLowerCase().includes(query) ||
        specialty.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query);

      const matchesSpecialty =
        selectedSpecialty === 'All' || specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [nurses, searchQuery, selectedSpecialty]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nurses Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, verify, and view all registered healthcare professionals.
          </p>
        </div>

        <Link
          href="/admin/nurses/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Nurse</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d6e6e] flex items-center justify-center font-bold text-xl">
            {totalCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Registered</p>
            <p className="text-sm font-semibold text-slate-900">All Nurses</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            {approvedCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved</p>
            <p className="text-sm font-semibold text-slate-900">Active & Verified</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            {pendingCount}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Review</p>
            <p className="text-sm font-semibold text-slate-900">Needs Verification</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, specialty, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#0d6e6e]"
          >
            <option value="All">All Specialties</option>
            {availableSpecialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm gap-3">
          <Loader2 className="w-8 h-8 text-[#0d6e6e] animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Fetching nurses data...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nurse Info</th>
                  <th className="px-6 py-4">Specialty & Exp.</th>
                  <th className="px-6 py-4">Hourly Rate</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredNurses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No nurses found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredNurses.map((nurse) => {
                    const displayName =
                      nurse.fullName ||
                      nurse.name ||
                      `${nurse.first_name || ''} ${nurse.last_name || ''}`.trim() ||
                      'Unknown Nurse';

                    const avatarUrl = getFullImageUrl(nurse.image, displayName);
                    const isRowUpdating = updatingId === nurse.id;
                    const isRowDeleting = deletingId === nurse.id;

                    return (
                      <tr key={nurse.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Nurse Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              width={40}
                              height={40}
                              src={avatarUrl}
                              alt={displayName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {displayName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {nurse.email || 'No email'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Specialty & Exp */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">
                            {nurse.specialization || nurse.role || 'General'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Award className="w-3 h-3 text-slate-400" />{' '}
                            {nurse.experience ? `${nurse.experience} yrs exp.` : 'N/A'}
                          </p>
                        </td>

                        {/* Rate */}
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ${nurse.price || 0}/hr
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-900 text-sm">
                              {Number(nurse.rating || 0).toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({nurse.reviews || 0})
                            </span>
                          </div>
                        </td>

                        {/* Status Select */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {nurse.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle className="w-3.5 h-3.5" /> Approved
                              </span>
                            )}
                            {nurse.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                            {nurse.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                <UserX className="w-3.5 h-3.5" /> Rejected
                              </span>
                            )}

                            <select
                              disabled={isRowUpdating || isRowDeleting}
                              value={nurse.status}
                              onChange={(e) => handleStatusChange(nurse.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:border-[#0d6e6e] disabled:opacity-50 cursor-pointer"
                            >
                              <option value="pending">Set Pending</option>
                              <option value="approved">Set Approved</option>
                              <option value="rejected">Set Rejected</option>
                            </select>

                            {isRowUpdating && (
                              <Loader2 className="w-3.5 h-3.5 text-[#0d6e6e] animate-spin" />
                            )}
                          </div>
                        </td>

                        {/* Actions -> View Profile + Delete Button */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedNurse(nurse)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#0d6e6e] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              View Profile
                            </button>

                            <button
                              type="button"
                              disabled={isRowDeleting}
                              onClick={() => handleDeleteNurse(nurse.id, displayName)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                              title="Delete Nurse"
                            >
                              {isRowDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          NURSE PROFILE MODAL (POP-UP)
      ========================================================= */}
      {selectedNurse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedNurse(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#0d6e6e] to-[#125460] p-6 text-white">
              <button
                onClick={() => setSelectedNurse(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <Image
                  width={64}
                  height={64}
                  src={getFullImageUrl(
                    selectedNurse.image,
                    selectedNurse.fullName || selectedNurse.name || 'Nurse'
                  )}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-md"
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {selectedNurse.fullName || selectedNurse.name || `${selectedNurse.first_name || ''} ${selectedNurse.last_name || ''}`}
                  </h2>
                  <p className="text-teal-100 text-sm font-medium mt-0.5">
                    {selectedNurse.specialization || selectedNurse.role || 'Registered Nurse'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Quick Details Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block uppercase">Experience</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-[#0d6e6e]" /> {selectedNurse.experience || '0'} yrs
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block uppercase">Hourly Rate</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-0.5 mt-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0d6e6e]" /> ${selectedNurse.price || 0}/hr
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block uppercase">Rating</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {Number(selectedNurse.rating || 0).toFixed(1)} ({selectedNurse.reviews || 0})
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block uppercase">Status</span>
                  <span className="text-xs font-bold uppercase mt-1 block">
                    {selectedNurse.status === 'approved' && <span className="text-emerald-600">Approved</span>}
                    {selectedNurse.status === 'pending' && <span className="text-amber-600">Pending</span>}
                    {selectedNurse.status === 'rejected' && <span className="text-rose-600">Rejected</span>}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    <Mail className="w-4 h-4 text-[#0d6e6e] flex-shrink-0" />
                    <span className="truncate">{selectedNurse.email || 'No email provided'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    <Phone className="w-4 h-4 text-[#0d6e6e] flex-shrink-0" />
                    <span>{selectedNurse.phone || 'No phone provided'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-[#0d6e6e] flex-shrink-0" />
                    <span>{selectedNurse.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {selectedNurse.categories && selectedNurse.categories.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialty Care Areas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNurse.categories.map((cat, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-[#0d6e6e] font-medium border border-teal-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents & Files */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attached Verification Documents</h3>
                <div>
                  {selectedNurse.cv_file ? (
                    <a
                      href={
                        selectedNurse.cv_file.startsWith('http')
                          ? selectedNurse.cv_file
                          : `${process.env.NEXT_PUBLIC_API_URL}${selectedNurse.cv_file.startsWith('/') ? selectedNurse.cv_file : `/${selectedNurse.cv_file}`}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#0d6e6e] hover:bg-slate-50 transition-all text-sm text-slate-700 group"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <FileText className="w-4 h-4 text-[#0d6e6e]" /> Curriculum Vitae (CV)
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#0d6e6e] font-semibold group-hover:underline">
                        Open file <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> No CV Uploaded
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Change Application Status:</span>
                <select
                  disabled={updatingId === selectedNurse.id}
                  value={selectedNurse.status}
                  onChange={(e) => handleStatusChange(selectedNurse.id, e.target.value)}
                  className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#0d6e6e] cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                {updatingId === selectedNurse.id && (
                  <Loader2 className="w-3.5 h-3.5 text-[#0d6e6e] animate-spin" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={deletingId === selectedNurse.id}
                  onClick={() =>
                    handleDeleteNurse(
                      selectedNurse.id,
                      selectedNurse.fullName || selectedNurse.name || 'Nurse'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deletingId === selectedNurse.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNurse(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}