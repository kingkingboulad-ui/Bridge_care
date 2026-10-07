'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FolderPlus, 
  Tag, 
  FileText, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export default function AddCategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // توليد الـ slug تلقائياً عند كتابة الاسم
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  // جلب التصنيفات الحالية
  const fetchCategories = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get( `${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        withCredentials: true,
      });
      const data = res.data?.categories || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // إضافة تصنيف جديد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        { name, slug, description },
        { withCredentials: true }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg('Category created successfully!');
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories(); // إعادة تحديث القائمة
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create category. Make sure it is unique.');
    } finally {
      setSubmitting(false);
    }
  };

  // حذف تصنيف
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setDeletingId(id);
    
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`,
        {
          withCredentials: true,
        }
      );
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-500 hover:text-[#00535B] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Specialties & Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add care services, nurse specialties, and patient care areas.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ================= FORM (LEFT) ================= */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00535B] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Category</h2>
              <p className="text-[11px] text-slate-400">Define a medical field or service</p>
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Elderly Care, Pediatric"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#00535B] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Slug (URL friendly)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="elderly-care"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:bg-white focus:border-[#00535B] focus:outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Description
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief explanation of the care services under this specialty..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#00535B] focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#00535B] hover:bg-[#00737D] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Create Category</span>
              )}
            </button>
          </form>
        </div>

        {/* ================= EXISTING CATEGORIES TABLE (RIGHT) ================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00535B]" />
              <h2 className="text-sm font-bold text-slate-900">Existing Categories</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
              {categories.length} Total
            </span>
          </div>

          {loadingList ? (
            <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#00535B]" />
              <p className="text-xs">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No categories created yet. Add your first care category on the left.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Slug</th>
                    <th className="px-5 py-3.5">Description</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00535B]"></span>
                        {cat.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {cat.slug}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete Category"
                        >
                          {deletingId === cat.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}