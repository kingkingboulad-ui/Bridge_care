import { cookies } from "next/headers";
import SettingsClient from "./SettingsClient";

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AboutSettings {
  foundedYear: string;
  statFamilies: string;
  statNurses: string;
  statCities: string;
  statRating: string;
  storyParagraph1: string;
  storyParagraph2: string;
}

interface ContactSettings {
  email: string;
  phone: string;
  emergencyPhone: string;
  location: string;
  workingHours: string;
}

// 1. جلب بيانات الملف الشخصي للأدمن
async function getAdminData(): Promise<AdminProfile> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        headers: {
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const user = data?.user || data;
        return {
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        };
      }
    } catch (err) {
      console.error("Error fetching admin data on server:", err);
    }
  }

  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      return {
        firstName: parsed?.first_name || "",
        lastName: parsed?.last_name || "",
        email: parsed?.email || "",
        phone: parsed?.phone || "",
      };
    } catch {
      // fallback
    }
  }

  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
}

// 2. جلب بيانات صفحة About
async function getAboutSettings(): Promise<AboutSettings> {
  const defaults: AboutSettings = {
    foundedYear: "2026",
    statFamilies: "10,000+",
    statNurses: "2,500+",
    statCities: "40+",
    statRating: "4.9/5",
    storyParagraph1: "",
    storyParagraph2: "",
  };

  try {
    const res = await fetch("http://localhost:5000/api/settings/about_content", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return { ...defaults, ...(json.data || {}) };
    }
  } catch (err) {
    console.error("Error fetching about settings on server:", err);
  }

  return defaults;
}

// 3. جلب بيانات صفحة Contact
async function getContactSettings(): Promise<ContactSettings> {
  const defaults: ContactSettings = {
    email: "support@nurseconnect.health",
    phone: "+961 00 000 000",
    emergencyPhone: "112 / +961 00 000 000",
    location: "Beirut, Lebanon",
    workingHours: "24/7 Available",
  };

  try {
    const res = await fetch("http://localhost:5000/api/settings/contact_info", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return { ...defaults, ...(json.data || {}) };
    }
  } catch (err) {
    console.error("Error fetching contact settings on server:", err);
  }

  return defaults;
}

export default async function SettingsPage() {
  const [initialProfile, initialAbout, initialContact] = await Promise.all([
    getAdminData(),
    getAboutSettings(),
    getContactSettings(),
  ]);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal credentials, system preferences, and platform content.
        </p>
      </div>

      <SettingsClient
        initialProfile={initialProfile}
        initialAbout={initialAbout}
        initialContact={initialContact}
      />
    </div>
  );
}