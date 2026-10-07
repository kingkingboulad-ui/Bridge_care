'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  HeartPulse, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  careType?: string;
  assignedNurse?: string;
  condition?: string;
  status?: string;
}

export default function PatientsManagementPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // جلب المرضى من الـ Backend بالاعتماد فقط على Cookies
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`, {
        withCredentials: true,
      });

      const data = response.data?.patients || response.data || [];
      setPatients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch patients:', err);
      setError(err.response?.data?.message || 'Failed to load patients from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // حذف مريض
  const handleDeletePatient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`,
        {
          withCredentials: true,
        }
      );

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete patient');
    }
  };

  // تصفية نتائج البحث
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const name = patient.fullName || `${patient.first_name} ${patient.last_name}`;
      const email = patient.email || '';
      const phone = patient.phone || '';

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [patients, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor patient profiles, assigned nurses, and home care status.
          </p>
        </div>
        
        <Link 
          href="/admin/patients/add" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d6e6e] text-white rounded-xl font-semibold text-sm hover:bg-[#095252] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d6e6e] flex items-center justify-center font-bold text-xl">
            {patients.length}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Patients</p>
            <p className="text-sm font-semibold text-slate-900">Registered in System</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            {patients.length}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Accounts</p>
            <p className="text-sm font-semibold text-slate-900">Verified Profiles</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            0
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Assignment</p>
            <p className="text-sm font-semibold text-slate-900">Needs Nurse Match</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search patient name, email, or phone..."
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
            <option value="Active">Active</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Patients Table */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm gap-3">
          <Loader2 className="w-8 h-8 text-[#0d6e6e] animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Loading patients...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Care Type</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No patients found in the database.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => {
                    const displayName = patient.fullName || `${patient.first_name} ${patient.last_name}`;

                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Patient Info */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{displayName}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                #{patient.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {patient.email}
                              </span>
                              {patient.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {patient.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Care Type */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800 flex items-center gap-1.5">
                            <HeartPulse className="w-4 h-4 text-[#0d6e6e]" />
                            {patient.careType || 'Home Healthcare'}
                          </p>
                        </td>

                        {/* Registered Date */}
                        <td className="px-6 py-4 text-slate-600">
                          <span className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(patient.created_at).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/admin/patients/${patient.id}`}
                              className="px-3 py-1.5 text-xs font-semibold text-[#0d6e6e] bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              View
                            </Link>
                            <button 
                              onClick={() => handleDeletePatient(patient.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Patient"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </div>
  );
}