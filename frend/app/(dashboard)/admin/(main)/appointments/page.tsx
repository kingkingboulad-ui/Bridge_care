'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  X, 
  UserCheck, 
  FileText, 
  Loader2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

// البنية المطابقة تماماً لنتائج استعلام SQL في الباك-إند
interface CareRequest {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_phone: string;
  nurse_id: number | null;
  nurse_name: string | null;
  nurse_role: string | null;
  care_for: string;
  care_type: string;
  start_date: string;
  duration: string;
  address: string;
  notes: string | null;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalPatients: number;
  activeNurses: number;
  pendingRequests: number;
  todaysAppointments: number;
  pendingCareRequests: number;
}

export default function CareRequestsManagementPage() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<CareRequest | null>(null);

  // جلب البيانات من الـ Backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // استبدل المسار بالـ Endpoint الخاص بك إن كان مختلفاً
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`);
      const data = await res.json();

      if (data.success) {
        setRequests(data.recentAppointments || []);
        setStats(data.stats || null);
      } else {
        throw new Error(data.message || 'فشل في تحميل البيانات');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // فلترة الطلبات حسب البحث وحالة الطلب
  const filteredRequests = requests.filter((req) => {
    const patient = (req.patient_name || '').toLowerCase();
    const nurse = (req.nurse_name || '').toLowerCase();
    const type = (req.care_type || '').toLowerCase();
    const careFor = (req.care_for || '').toLowerCase();
    const id = req.id.toString();
    const query = searchQuery.toLowerCase();

    const matchesSearch = 
      patient.includes(query) ||
      nurse.includes(query) ||
      type.includes(query) ||
      careFor.includes(query) ||
      id.includes(query);

    const matchesStatus = statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'approved':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-[#0d6e6e]" /> Care Requests & Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time home care requests directly linked to database records.
          </p>
        </div>

        <button 
          onClick={fetchDashboardData} 
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards from Backend */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d6e6e] flex items-center justify-center font-bold text-xl">
              {stats.todaysAppointments}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Today's Visits</p>
              <p className="text-sm font-semibold text-slate-900">Scheduled for today</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              {stats.pendingCareRequests}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
              <p className="text-sm font-semibold text-slate-900">Awaiting dispatch</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              {stats.activeNurses}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Approved Nurses</p>
              <p className="text-sm font-semibold text-slate-900">Ready for service</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xl">
              {stats.totalPatients}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Registered Patients</p>
              <p className="text-sm font-semibold text-slate-900">Total in system</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, patient, nurse, or care type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#0d6e6e]"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0d6e6e]" />
            <p className="text-sm">Fetching records from server...</p>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-rose-500 gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No care requests match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Request ID & Care Type</th>
                  <th className="px-6 py-4">Patient & Recipient</th>
                  <th className="px-6 py-4">Assigned Nurse</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Care Type */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-slate-400">#CR-{req.id}</span>
                      <p className="font-semibold text-slate-900 mt-0.5">{req.care_type}</p>
                    </td>

                    {/* Patient & Care For */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {req.patient_name.trim() || `User #${req.patient_id}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        For: <span className="text-slate-600 font-medium">{req.care_for}</span>
                      </p>
                    </td>

                    {/* Assigned Nurse */}
                    <td className="px-6 py-4">
                      {req.nurse_name?.trim() ? (
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-[#0d6e6e]" />
                            {req.nurse_name}
                          </p>
                          {req.nurse_role && (
                            <span className="text-xs text-slate-400">{req.nurse_role}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {req.start_date ? new Date(req.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {req.duration || 'Flexible'}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0d6e6e] bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200/50"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pop-up Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">Care Request Details</h3>
                  <span className="text-xs font-mono font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                    #CR-{selectedRequest.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRequest.care_type}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Status Row */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Request Status</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              {/* Patient Information */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0d6e6e]" /> Patient Details
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booked By:</span>
                    <span className="font-medium text-slate-900">{selectedRequest.patient_name.trim() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Care For:</span>
                    <span className="font-semibold text-[#0d6e6e]">{selectedRequest.care_for}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Phone:</span>
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> 
                      {selectedRequest.patient_phone || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nurse Information */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#0d6e6e]" /> Assigned Staff
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nurse:</span>
                    <span className="font-medium text-slate-800">
                      {selectedRequest.nurse_name?.trim() || 'No nurse assigned yet'}
                    </span>
                  </div>
                  {selectedRequest.nurse_role && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="font-medium text-slate-700">{selectedRequest.nurse_role}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule & Address */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0d6e6e]" /> Location & Schedule
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Home Address</p>
                    <p className="text-slate-800 font-medium mt-0.5">{selectedRequest.address || 'Address not listed'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedRequest.start_date ? new Date(selectedRequest.start_date).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {selectedRequest.duration || 'Standard visit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs">
                  <span className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <FileText className="w-3.5 h-3.5" /> Medical / Special Instructions
                  </span>
                  <p className="text-slate-700 leading-relaxed">{selectedRequest.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
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