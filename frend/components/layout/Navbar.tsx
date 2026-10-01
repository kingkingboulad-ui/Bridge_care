"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HeartPulse,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Stethoscope,
  Settings,
  Globe,
} from "lucide-react";

import Button from "@/components/ui/Button";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "nurse" | "user" | "patient" | string;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { lang, toggleLang, t } = useLanguage();

  // =========================
  // NAVBAR LINKS
  // =========================

  const links = [
    {
      href: "/",
      label: t("home") || "Home",
    },
    {
      href: "/find-a-nurses",
      label: t("findNurse") || "Find A Nurses",
    },
    {
      href: "/for-nurses",
      label: t("forNurses") || "For Nurses",
    },
    {
      href: "/Ai-care-assistant",
      label: t("aiAssistant") || "AI Care Assistant",
    },
  ];

  // =========================
  // CHECK AUTH
  // =========================

  const checkAuth = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const res = await axios.get(
 `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          withCredentials: true,
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const currentUser = res.data?.user || res.data;

      if (currentUser && currentUser.id) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // AUTH EFFECT
  // =========================

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => checkAuth();

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () =>
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
  }, [checkAuth, pathname]);

  // =========================
  // CLOSE DROPDOWN
  // =========================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      await axios.post(
   `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch {
      // Continue logout even if API fails
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        localStorage.clear();
        sessionStorage.clear();
      }

      setUser(null);
      setProfileDropdown(false);
      setOpen(false);

      window.location.href = "/Sign-in";
    }
  };

  // =========================
  // PROFILE LINK
  // =========================

  const getProfileLink = () => {
    if (user?.role === "admin") {
      return "/admin";
    }

    if (user?.role === "nurse") {
      return "/profile";
    }

    return "/patient-profile";
  };

  // =========================
  // ROLE TRANSLATION
  // =========================

  const getRoleLabel = () => {
    if (!user) return "";

    if (user.role === "patient") {
      return t("patient") || "مريض";
    }

    if (user.role === "user") {
      return t("patient") || "مريض";
    }

    if (user.role === "nurse") {
      return t("nurse") || "ممرضة";
    }

    if (user.role === "admin") {
      return t("admin") || "مسؤول";
    }

    return user.role;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-bold text-[#00535B] transition-colors duration-200 hover:text-[#00737D]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00535B] text-white transition-colors duration-200 hover:bg-[#00737D]">
            <HeartPulse size={18} />
          </span>

          <span>NurseConnect</span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#E6F7F8] text-[#00535B]"
                    : "text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* LANGUAGE SWITCHER */}

          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-[#00535B]"
            title={
              lang === "en"
                ? "تبديل إلى العربية"
                : "Switch to English"
            }
          >
            <Globe
              size={14}
              className="text-[#00535B]"
            />

            <span>
              {lang === "en" ? "عربي" : "EN"}
            </span>
          </button>

          {!loading && (
            <>
              {user ? (

                /* ================= LOGGED IN ================= */

                <div
                  className="relative hidden md:block"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileDropdown(
                        (prev) => !prev
                      )
                    }
                    className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00535B] text-xs font-bold uppercase text-white">
                      {user.first_name ? (
                        user.first_name[0]
                      ) : (
                        <User size={14} />
                      )}
                    </div>

                    <span className="max-w-[110px] truncate">
                      {user.first_name}
                    </span>

                    <ChevronDown
                      size={14}
                      className="text-slate-400"
                    />
                  </button>

                  {profileDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 ${
                        lang === "ar"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >

                      {/* USER INFO */}

                      <div className="border-b border-slate-100 px-3 py-2.5">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user.first_name}{" "}
                          {user.last_name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {user.email}
                        </p>

                        <span className="mt-1.5 inline-block rounded border border-teal-100 bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00535B]">
                          {getRoleLabel()}
                        </span>
                      </div>

                      {/* MENU */}

                      <div className="py-1">

                        {/* ADMIN DASHBOARD */}

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() =>
                              setProfileDropdown(false)
                            }
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <LayoutDashboard
                              size={15}
                              className="text-[#00535B]"
                            />

                            <span>
                              {t("adminDashboard") ||
                                "لوحة تحكم المسؤول"}
                            </span>
                          </Link>
                        )}

                        {/* MY PROFILE */}

                        <Link
                          href={getProfileLink()}
                          onClick={() =>
                            setProfileDropdown(false)
                          }
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <User
                            size={15}
                            className="text-[#00535B]"
                          />

                          <span>
                            {t("myProfile") ||
                              "الملف الشخصي"}
                          </span>
                        </Link>

                        {/* NURSE WORKSPACE */}

                        {user.role === "nurse" && (
                          <Link
                            href="/profile"
                            onClick={() =>
                              setProfileDropdown(false)
                            }
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <Stethoscope
                              size={15}
                              className="text-[#00535B]"
                            />

                            <span>
                              {t("nurseWorkspace") ||
                                "مساحة عمل الممرضة"}
                            </span>
                          </Link>
                        )}

                        {/* SYSTEM SETTINGS */}

                        {user.role === "admin" && (
                          <Link
                            href="/admin/settings"
                            onClick={() =>
                              setProfileDropdown(false)
                            }
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <Settings
                              size={15}
                              className="text-[#00535B]"
                            />

                            <span>
                              {t("systemSettings") ||
                                "إعدادات النظام"}
                            </span>
                          </Link>
                        )}
                      </div>

                      {/* SIGN OUT */}

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <LogOut size={15} />

                          <span>
                            {t("signOut") ||
                              "تسجيل الخروج"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              ) : (

                /* ================= NOT LOGGED IN ================= */

                <Link
                  href="/Sign-in"
                  className={`hidden rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 md:block ${
                    pathname === "/Sign-in"
                      ? "bg-[#E6F7F8] text-[#00535B]"
                      : "text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                  }`}
                >
                  {t("signIn") || "Sign In"}
                </Link>
              )}
            </>
          )}

          {/* ================= GET STARTED ================= */}

          <Button
            href="/find-a-nurses"
            variant="solid"
            className="hidden bg-[#00535B] text-sm text-white transition-colors hover:bg-[#00737D] md:inline-flex"
          >
            {t("getStarted") || "Get Started"}
          </Button>

          {/* ================= MOBILE BUTTON ================= */}

          <button
            type="button"
            onClick={() =>
              setOpen((v) => !v)
            }
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-[#E6F7F8] hover:text-[#00535B] md:hidden"
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <div className="animate-in slide-in-from-top-2 border-t border-black/5 bg-white duration-150 md:hidden">
          <nav
            className={`container-content flex flex-col gap-1 py-4 ${
              lang === "ar"
                ? "text-right"
                : "text-left"
            }`}
          >

            {/* NAV LINKS */}

            {links.map((link) => {
              const isActive =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#E6F7F8] text-[#00535B]"
                      : "text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* MOBILE USER */}

            {user ? (
              <>
                <div className="my-2 border-t border-slate-100 px-4 pt-3">

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t("signedInAs") ||
                      "مسجل الدخول باسم"}
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    {user.first_name}{" "}
                    {user.last_name}
                  </p>

                  <p className="text-[10px] font-semibold text-[#00535B]">
                    {user.email}
                  </p>

                  <span className="mt-1 inline-block rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#00535B]">
                    {getRoleLabel()}
                  </span>
                </div>

                {/* ADMIN */}

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                  >
                    <LayoutDashboard
                      size={16}
                      className="text-[#00535B]"
                    />

                    <span>
                      {t("adminDashboard") ||
                        "لوحة تحكم المسؤول"}
                    </span>
                  </Link>
                )}

                {/* MY PROFILE */}

                <Link
                  href={getProfileLink()}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                >
                  <User
                    size={16}
                    className="text-[#00535B]"
                  />

                  <span>
                    {t("myProfile") ||
                      "الملف الشخصي"}
                  </span>
                </Link>

                {/* NURSE */}

                {user.role === "nurse" && (
                  <Link
                    href="/profile"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                  >
                    <Stethoscope
                      size={16}
                      className="text-[#00535B]"
                    />

                    <span>
                      {t("nurseWorkspace") ||
                        "مساحة عمل الممرضة"}
                    </span>
                  </Link>
                )}

                {/* SIGN OUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut size={16} />

                  <span>
                    {t("signOut") ||
                      "تسجيل الخروج"}
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/Sign-in"
                onClick={() =>
                  setOpen(false)
                }
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  pathname === "/Sign-in"
                    ? "bg-[#E6F7F8] text-[#00535B]"
                    : "text-slate-700 hover:bg-[#E6F7F8] hover:text-[#00535B]"
                }`}
              >
                {t("signIn") || "تسجيل الدخول"}
              </Link>
            )}

            {/* GET STARTED */}

            <div className="pt-2">
              <Button
                href="/find-a-nurses"
                variant="solid"
                className="w-full bg-[#00535B] text-sm text-white hover:bg-[#00737D]"
                onClick={() =>
                  setOpen(false)
                }
              >
                {t("getStarted") ||
                  "ابدأ الآن"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}