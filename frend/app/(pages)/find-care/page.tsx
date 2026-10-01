'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Search, MapPin, Star, Award, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {getImageUrl} from "@/lib/getImageUrl"

interface Nurse {
  id: number;
  full_name: string;
  specialization: string;
  experience: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image?: string;
  cv_file?: string;
  categories?: string;
  
}

const CATEGORIES_LIST = [
  "Elderly Care",
  "Post-Surgery",
  "Medication Support",
  "Daily Assistance",
  "Companionship",
  "Disability Support",
  "Palliative Care",
];

function FindCareContent() {
  const searchParams = useSearchParams();

  // مزامنة القيم مباشرة مع معايير الـ URL
  const [careType, setCareType] = useState(searchParams.get('careType') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);

  // تحديث القيم إذا تغيّر الـ URL عند الانتقال من الـ Hero
  useEffect(() => {
    setCareType(searchParams.get('careType') || 'All');
    setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/nurses/search`, {
        params: {
          careType: careType !== 'All' ? careType : undefined,
          location: location.trim() || undefined,
        },
      });

      if (res.data.success) {
        setNurses(res.data.nurses || []);
      }
    } catch (err) {
      console.error('Failed to fetch nurses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, [careType, location]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find a Registered Nurse</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified healthcare providers matching your care criteria.
          </p>
        </div>

        {/* Filters Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by city (e.g. Bbnin, Tripoli, San Jose)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={careType}
              onChange={(e) => setCareType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Care Types</option>
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nurses List Cards */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#00535B]" />
            <p className="text-sm">Loading caregivers...</p>
          </div>
        ) : nurses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No registered nurses match your selected criteria. Try adjusting your filters or leaving the location empty to view all.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nurses.map((nurse) => (
              <div
                key={nurse.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                <Image
  width={56}
  height={56}
  src={getImageUrl(nurse.image, nurse.full_name)}
  alt={nurse.full_name}
  className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
  loading="lazy"
/>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{nurse.full_name}</h3>
                    <p className="text-xs text-[#00535B] font-semibold">{nurse.specialization}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {nurse.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {nurse.rating || 5.0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl text-xs">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Award className="w-3.5 h-3.5 text-[#00535B]" /> {nurse.experience}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${nurse.price} <span className="text-[11px] text-slate-400 font-normal">/hr</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  <strong className="text-slate-700">Categories:</strong> {nurse.categories}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/book?nurseId=${nurse.id}`}
                    className="w-full py-2 bg-[#00535B] hover:bg-[#003d42] text-white text-center rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FindCarePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading page...</div>}>
      <FindCareContent />
    </Suspense>
  );
}