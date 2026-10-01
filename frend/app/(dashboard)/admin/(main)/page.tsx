'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  MapPin, 
  X, 
  Phone, 
  FileText, 
  User, 
  Stethoscope 
} from 'lucide-react';
import Link from 'next/link';

interface CareRequestItem {
  id: number;
  patient_id?: number;
  patient_name: string;
  patient_phone?: string;
  nurse_id?: number;
  nurse_name: string;
  nurse_role?: string;
  care_for?: string;
  care_type?: string;
  start_date: string;
  duration?: string;
  address?: string;
  notes?: string;
  status: string;
  created_at?: string;
}

interface DashboardData {
  stats: {
    totalPatients: number;
    activeNurses: number;
    pendingRequests: number;
    todaysAppointments: number;
  };
  recentAppointments: CareRequestItem[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<CareRequestItem | null>(null);

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // يعتمد كلياً على الكوكي المرسل تلقائياً من المتصفح
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
        withCredentials: true
      });

      if (response.data?.success !== false) {
        setData(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0d6e6e] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading dashboard overview...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalPatients: 0,
    activeNurses: 0,
    pendingRequests: 0,
    todaysAppointments: 0
  };

  const requestsList = data?.recentAppointments || [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Here is what is happening with NurseConnect today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0d6e6e]' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.totalPatients}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Registered in system</p>
        </div>

        {/* Card 2: Active Nurses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Nurses</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.activeNurses}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Ready for assignments</p>
        </div>

        {/* Card 3: Today's Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appointments Today</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.todaysAppointments}</span>
            <span className="text-xs font-medium text-slate-500">Scheduled</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Appointments for current date</p>
        </div>

        {/* Card 4: Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.pendingRequests}</span>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
              Requires Action
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pending nurse profiles</p>
        </div>

      </div>

      {/* CARE REQUESTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Care Requests &amp; Assignments</h2>
            <p className="text-xs text-slate-500 mt-0.5">All booking entries from the care requests table</p>
          </div>
          <Link href="/admin/appointments" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition-colors">
            View All ({requestsList.length}) <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Patient</th>
                <th className="px-6 py-3.5">Assigned Nurse</th>
                <th className="px-6 py-3.5">Service Details</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requestsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs">
                    No care requests recorded yet.
                  </td>
                </tr>
              ) : (
                requestsList.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Patient info */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {req.patient_name?.trim() ? req.patient_name : `Patient #${req.patient_id}`}
                      </div>
                      {req.patient_phone && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {req.patient_phone}
                        </div>
                      )}
                    </td>

                    {/* Assigned nurse info */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0d6e6e]">
                        {req.nurse_name?.trim() ? req.nurse_name : `Nurse #${req.nurse_id}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {req.nurse_role || 'Healthcare Provider'}
                      </div>
                    </td>

                    {/* Care type & target */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{req.care_type || 'General Care'}</div>
                      <div className="text-xs text-slate-400">For: {req.care_for || 'Self'}</div>
                    </td>

                    {/* Date & Duration */}
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="font-medium text-slate-800">
                        {req.start_date ? new Date(req.start_date).toLocaleDateString() : '—'}
                      </div>
                      <div className="text-slate-400 mt-0.5">{req.duration || 'Standard'}</div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 max-w-[150px] truncate" title={req.address || ''}>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{req.address || 'Not specified'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        req.status === 'confirmed' || req.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'cancelled' || req.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {req.status === 'confirmed' || req.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : req.status === 'cancelled' || req.status === 'rejected' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {req.status || 'pending'}
                      </span>
                    </td>

                    {/* Pop-up trigger */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS POP-UP MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Care Request #{selectedRequest.id}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive booking details</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Patient & Nurse Pair Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Patient Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Patient
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedRequest.patient_name || `User #${selectedRequest.patient_id}`}
                  </div>
                  {selectedRequest.patient_phone && (
                    <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedRequest.patient_phone}
                    </div>
                  )}
                </div>

                {/* Nurse Card */}
                <div className="p-3.5 rounded-2xl bg-[#f0fdfa] border border-teal-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Assigned Nurse
                  </div>
                  <div className="text-sm font-bold text-[#0d6e6e]">
                    {selectedRequest.nurse_name || `Nurse #${selectedRequest.nurse_id}`}
                  </div>
                  <div className="text-xs text-teal-800">
                    {selectedRequest.nurse_role || 'Healthcare Provider'}
                  </div>
                </div>
              </div>

              {/* Service & Scheduling Details */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block">Care Type</span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                    {selectedRequest.care_type || 'General Care'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block">Care Recipient</span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                    {selectedRequest.care_for || 'Self'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block">Start Date</span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                    {selectedRequest.start_date ? new Date(selectedRequest.start_date).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block">Duration</span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                    {selectedRequest.duration || 'Standard'}
                  </span>
                </div>
              </div>

              {/* Address / Location */}
              <div className="p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Full Address
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {selectedRequest.address || 'No address provided'}
                </p>
              </div>

              {/* Patient Notes */}
              {selectedRequest.notes && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                  <span className="text-[11px] font-medium text-amber-800 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Notes from Patient
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Status & Timestamp */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Current Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                  selectedRequest.status === 'confirmed' || selectedRequest.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedRequest.status === 'cancelled' || selectedRequest.status === 'rejected'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {selectedRequest.status || 'pending'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}