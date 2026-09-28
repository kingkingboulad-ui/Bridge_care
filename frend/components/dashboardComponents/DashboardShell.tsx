'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, Calendar, Settings,
  Bell, Search, Menu, X, LogOut, ChevronDown, UserCheck, Loader2
} from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';

interface ShellProps {
  children: React.ReactNode;
}

interface AdminUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  image?: string;
}

// دالة مساعدة لقراءة أي Cookie بالاسم
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export default function DashboardShell({ children }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: Home },
    { name: 'Nurses', href: '/admin/nurses', icon: UserCheck },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Show Contact', href: '/admin/show-contact', icon: Users },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  ];

  useEffect(() => {
    // 1. محاولة قراءة بيانات المستخدم من الـ Cookies مباشرة (مثل كوكي اسمه user أو admin)
    const userCookie = getCookie('user') || getCookie('admin_user');

    if (userCookie) {
      try {
        const parsed = JSON.parse(userCookie);
        setAdminUser(parsed);
        return;
      } catch (err) {
        // إذا كان الكوكي مجرد اسم نصي بسيط
        setAdminUser({ first_name: userCookie });
        return;
      }
    }

    // 2. إذا كان الـ Token مخزن في httpOnly Cookie، نطلب البيانات من الـ Backend عبر إرسال الكوكي
    const fetchAdminFromCookieAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true, // يرسل الـ cookies تلقائياً مع الطلب
        });

        if (res.data?.user) {
          setAdminUser(res.data.user);
        } else if (res.data) {
          setAdminUser(res.data);
        }
      } catch (error) {
        console.error('Could not fetch admin from cookie auth session:', error);
      }
    };

    fetchAdminFromCookieAuth();
  }, []);

  // دالة تسجيل الخروج ومسح الكوكيز
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      // استدعاء السيرفر لحذف الكوكي
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof document !== 'undefined') {
        // تفريغ أي كوكي موجود يدوياً
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'admin_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }

      setLoggingOut(false);
      setIsSidebarOpen(false);
      window.location.href = '/admin/login';
    }
  };

  // استخراج الاسم الكامل
  const adminName = adminUser?.first_name
    ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim()
    : 'Admin';

  const avatarUrl = adminUser?.image
    ? (adminUser.image.startsWith('http') ? adminUser.image : `http://localhost:5000/${adminUser.image.replace(/^\/+/, '')}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=0d6e6e&color=fff&size=128`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">

      {/* 1. FIXED HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0d6e6e] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline-block">
              Nurse<span className="text-[#0d6e6e]">Connect</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients, nurses..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-[#0d6e6e] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 my-auto"></div>

          {/* اسم الأدمن المقروء من الـ Cookies */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Image
              src={avatarUrl}
              alt={adminName || "Admin"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none capitalize">
                {adminName}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 capitalize">
                {adminUser?.role || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </Link>
        </div>
      </header>

      {/* BODY WRAPPER */}
      <div className="flex pt-16 h-screen overflow-hidden">

        {/* Overlay for mobile view */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* 2. FIXED SIDEBAR */}
        <aside className={`
          fixed top-16 left-0 bottom-0 z-40
          w-64 bg-white border-r border-slate-200 flex flex-col justify-between
          h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? 'bg-[#0d6e6e] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">System</p>

              <Link
                href="/admin/Settings"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname.toLowerCase().startsWith('/admin/settings')
                    ? 'bg-[#0d6e6e] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              type="button"
              disabled={loggingOut}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>{loggingOut ? 'Signing out...' : 'Log Out'}</span>
            </button>
          </div>
        </aside>

        {/* 3. SCROLLABLE CONTENT AREA */}
        <main className="flex-1 lg:ml-64 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>

      </div>
    </div>
  );
}