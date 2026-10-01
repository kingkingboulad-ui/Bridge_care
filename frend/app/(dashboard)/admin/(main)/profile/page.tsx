import { cookies } from "next/headers";
import AdminProfileClient from "./AdminProfileClient";

export interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
  location: string;
}

async function getAdminProfile(): Promise<AdminProfileData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`, {
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
          role: user?.role || "Admin",
          location: user?.location || "Lebanon",
          avatarUrl: user?.image || "",
        };
      }
    } catch (err) {
      console.error("Error fetching admin profile on server:", err);
    }
  }

  // في حال وجود الكوكي كنص مخزن
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      return {
        firstName: parsed?.first_name || parsed?.firstName || "",
        lastName: parsed?.last_name || parsed?.lastName || "",
        email: parsed?.email || "",
        phone: parsed?.phone || "",
        role: parsed?.role || "Admin",
        location: parsed?.location || "Lebanon",
        avatarUrl: parsed?.image || "",
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
    role: "Admin",
    location: "Lebanon",
    avatarUrl: "",
  };
}

export default async function AdminProfilePage() {
  const initialData = await getAdminProfile();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrator Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information, contact credentials, and security preferences.
        </p>
      </div>

      <AdminProfileClient initialProfile={initialData} />
    </div>
  );
}