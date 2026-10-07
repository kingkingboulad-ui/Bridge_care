'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

interface Nurse {
  id: number;
  name: string;
  credential?: string;
  specialty?: string;
  specialization?: string;
  experience?: string | number;
  location?: string;
  price?: number | string;
  rating?: number | string;
  reviews?: number;
  photo?: string;
  image?: string | null;
  available?: string;
  tags?: string[];
}

export default function MeetNurses() {
  const { t } = useLanguage();
  const [nursesList, setNursesList] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);

  // قراءة الرابط من متغيرات البيئة تلقائياً
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchLatestNurses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/nurses/latest`, {
          withCredentials: true,
        });
        const data = res.data.nurses || res.data || [];
        setNursesList(data.slice(0, 10));
      } catch (error) {
        console.error("Failed to load latest nurses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNurses();
  }, [API_URL]);

  return (
    <section className="bg-[#F2F8FC] py-20">
      <div className="container-content">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow-light">{t("ourTeam")}</span>
            <h2 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
              {t("meetOurNurses")}
            </h2>
          </div>
          <Link
            href="/find-a-nurses"
            className="hidden text-sm font-semibold text-teal-700 hover:underline sm:block"
          >
            {t("viewAllNurses")}
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-black/5 bg-white shadow-sm"
              />
            ))}
          </div>
        ) : nursesList.length === 0 ? (
          <div className="mt-10 py-12 text-center text-sm text-navy-900/40">
            {t("noNursesAvailable")}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {nursesList.map((nurse) => {
              const rawImage = nurse.photo || nurse.image;
              const imageSource = rawImage
                ? rawImage.startsWith("http")
                  ? rawImage
                  : `${API_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(nurse.name || 'Nurse')}&background=00535B&color=fff&size=300`;

              const tags = nurse.tags && nurse.tags.length > 0 
                ? nurse.tags 
                : [nurse.location || "Lebanon", `${nurse.experience || 1} yrs exp.`];

              return (
                <div
                  key={nurse.id}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={imageSource}
                      alt={nurse.name || "Nurse"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-700 shadow-sm">
                      {nurse.available || (nurse.price ? `$${nurse.price}/hr` : t("available"))}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy-900">{nurse.name}</h3>
                        <p className="text-xs text-navy-900/50">
                          {nurse.credential || t("registeredNurse")}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-teal-700">
                      {nurse.specialty || nurse.specialization || t("generalHomeCare")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{Number(nurse.rating || 5.0).toFixed(1)}</span>
                        <span className="text-navy-900/40">({nurse.reviews || 0})</span>
                      </div>
                      <Button
                        href={`/book?nurseId=${nurse.id}`}
                        variant="solid"
                        className="px-4 py-2 text-xs"
                      >
                        {t("bookNow")}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
