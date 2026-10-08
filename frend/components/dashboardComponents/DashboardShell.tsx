'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, Calendar, Settings,
  Bell, Search, Menu, X, LogOut, ChevronDown, UserCheck, Loader2,
  MessageSquare, CheckCheck
} from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { io, Socket } from 'socket.io-client';

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

interface NotificationItem {
  id: number;
  type: 'contact' | 'appointment' | 'system';
  title: string;
  message: string;
  reference_id?: number | null;
  is_read: number | boolean;
  created_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

export default function DashboardShell({ children }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // حالات الإشعارات
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: Home },
    { name: 'Nurses', href: '/admin/nurses', icon: UserCheck },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Show Contact', href: '/admin/show-contact', icon: MessageSquare },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  ];

  // 1. جلب بيانات الأدمن المسجل
  useEffect(() => {
    const userCookie = getCookie('user') || getCookie('admin_user');

    if (userCookie) {
      try {
        const parsed = JSON.parse(userCookie);
        setAdminUser(parsed);
        return;
      } catch (err) {
        setAdminUser({ first_name: userCookie });
        return;
      }
    }

    const fetchAdminFromCookieAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            withCredentials: true,
          }
        );

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

  // 2. جلب الإشعارات المخزنة في الـ Database
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/admin`,
        {
          withCredentials: true,
        }
      );

      if (res.data?.success && Array.isArray(res.data.notifications)) {
        const list: NotificationItem[] = res.data.notifications;
        setNotifications(list);
        const unread = list.filter((n) => !n.is_read || n.is_read === 0).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
    }
  };

  // 3. ربط الـ Real-time عبر Socket.IO
  useEffect(() => {
    fetchNotifications();

    const socket: Socket = io(
      process.env.NEXT_PUBLIC_API_URL!,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    socket.on('connect', () => {
      socket.emit('join', {
        userId: adminUser?.id,
        role: 'admin',
      });
    });

    socket.on('new_notification', (newNotif: NotificationItem) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
    });

    return () => {
      socket.disconnect();
    };
  }, [adminUser?.id]);

  // إغلاق قائمة الإشعارات عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تحديد الإشعارات كمقروءة في السيرفر والواجهة
  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/admin/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setIsNotifOpen(false);
    if (item.type === 'contact') {
      router.push('/admin/show-contact');
    } else if (item.type === 'appointment') {
      router.push('/admin/appointments');
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // لمنع أي سلوك افتراضي للمتصفح
    console.log("🚀 جاري تسجيل الخروج... سيتم إرسال الطلب الآن"); // رسالة للتأكد من عمل الزر

    try {
      setLoggingOut(true);
    
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, // تأكد أن هذا هو المسار الصحيح
        {},
        { withCredentials: true }
      );
      
      console.log("✅ استجابة السيرفر:", response.data);

    } catch (error) {
      console.error('❌ خطأ أثناء تسجيل الخروج:', error);
    } finally {
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'admin_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }

      setLoggingOut(false);
      setIsSidebarOpen(false);
      
      // تأخير بسيط قبل إعادة التوجيه لتتمكن من رؤية الـ Console
      setTimeout(() => {
         window.location.href = '/admin/login';
      }, 6000); 
    }
  };

  const adminName = adminUser?.first_name
    ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim()
    : 'Admin';
    const avatarUrl = adminUser?.image
    ? (
        adminUser.image.startsWith("http")
          ? adminUser.image
          : `${process.env.NEXT_PUBLIC_API_URL}/${adminUser.image.replace(/^\/+/, "")}`
      )
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        adminName
      )}&background=0d6e6e&color=fff&size=128`;
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
          {/* NOTIFICATION BELL & DROPDOWN */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-xl border border-slate-200 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-[#0d6e6e] hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const isUnread = !item.is_read || item.is_read === 0;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-3 rounded-xl transition cursor-pointer flex gap-3 items-start my-1 ${
                            isUnread ? 'bg-[#f0f9f9] hover:bg-[#e6f4f4]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              item.type === 'contact'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-[#0d6e6e]/10 text-[#0d6e6e]'
                            }`}
                          >
                            {item.type === 'contact' ? (
                              <MessageSquare className="w-4 h-4" />
                            ) : (
                              <Calendar className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-xs text-slate-900 truncate">
                                {item.title}
                              </p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[#0d6e6e] shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(item.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-slate-200 my-auto" />

          {/* User Profile */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Image
              src={avatarUrl}
              alt={adminName || 'Admin'}
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
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* 2. FIXED SIDEBAR */}
        <aside
          className={`
          fixed top-16 left-0 bottom-0 z-40
          w-64 bg-white border-r border-slate-200 flex flex-col justify-between
          h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
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
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                System
              </p>

              <Link
                href="/admin/Settings"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname.toLowerCase().startsWith('/admin/settings')
                    ? 'bg-[#0d6e6e] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Logout */}
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