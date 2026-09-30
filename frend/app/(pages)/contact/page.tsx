"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  MessageCircle,
  Clock3,
  ShieldCheck,
} from "lucide-react";

interface ContactSettings {
  email: string;
  phone: string;
  emergencyPhone: string;
  location: string;
  workingHours: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  email: "support@nurseconnect.health",
  phone: "+961 00 000 000",
  emergencyPhone: "112 / +961 00 000 000",
  location: "Beirut, Lebanon",
  workingHours: "24/7 Available",
};

export default function ContactPage() {
  const { t, dir } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactSettings>(DEFAULT_SETTINGS);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // جلب البيانات الديناميكية المحفوظة من قبل الأدمن
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings/contact_info`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setContactInfo((prev) => ({
              ...prev,
              ...json.data,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch contact settings:", err);
      }
    };

    fetchContactSettings();
  }, [API_URL]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        subject: String(formData.get("subject") || "general"),
        message: String(formData.get("message") || "").trim(),
      };

      if (!data.name || !data.email || !data.message) {
        alert(
          dir === "rtl"
            ? "يرجى ملء جميع الحقول المطلوبة."
            : "Please fill in all required fields."
        );
        setSending(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message.");
      }

      form.reset();
      setSubmitted(true);
    } catch (error: any) {
      console.error("Contact form error:", error);
      alert(
        error.message ||
          (dir === "rtl"
            ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
            : "Something went wrong while sending your message. Please try again.")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#EDFCFF] text-[#001F24]">
      <main className="w-full bg-[#EDFCFF] pt-20">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-16 lg:py-8">

          {/* ================= HERO ================= */}
          <section className="relative mb-6 overflow-hidden rounded-xl bg-[#DBF9FF] p-6 text-center shadow-sm lg:p-10">
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#A9ECE5] px-4 py-2 text-[#286D67]">
                <MessageCircle size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t("contact.badge")}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#001F24] sm:text-4xl lg:text-[42px] lg:leading-[50px]">
                {t("contact.title")}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-[#3E494A] sm:text-lg">
                {t("contact.description")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-5 pt-1 text-xs text-[#3E494A]">
                <span className="flex items-center gap-2">
                  <MessageCircle size={17} className="text-[#00535B]" />
                  {t("contact.support")}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} className="text-[#00535B]" />
                  {contactInfo.workingHours || t("contact.response")}
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#A9ECE5]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#9FF0FB]/40 blur-3xl" />
          </section>

          {/* ================= CONTENT ================= */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

            {/* ================= CONTACT FORM ================= */}
            <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-7 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#236863]">
                    {t("contact.formLabel")}
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-[#001F24]">
                    {t("contact.formTitle")}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DBF9FF] text-[#00535B]">
                  <Mail size={22} />
                </div>
              </div>

              {/* ================= SUCCESS ================= */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#E6F8F5] px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ACEFE7] text-[#00535B]">
                    <CheckCircle2 size={30} />
                  </div>

                  <h3 className="text-xl font-bold text-[#001F24]">
                    {t("contact.successTitle")}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#3E494A]">
                    {t("contact.successDescription")}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 rounded-xl bg-[#00535B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#006D77]"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                /* ================= FORM ================= */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* NAME */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-[#001F24]">
                        {t("contact.name")}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder={t("contact.namePlaceholder")}
                        className="w-full rounded-lg bg-[#EDFCFF] px-4 py-3.5 text-sm text-[#001F24] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006D77]"
                      />
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-semibold text-[#001F24]">
                        {t("contact.email")}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={t("contact.emailPlaceholder")}
                        className="w-full rounded-lg bg-[#EDFCFF] px-4 py-3.5 text-sm text-[#001F24] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006D77]"
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-[#001F24]">
                      {t("contact.subject")}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full rounded-lg bg-[#EDFCFF] px-4 py-3.5 text-sm text-[#001F24] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006D77]"
                    >
                      <option value="general">{t("contact.subjectGeneral")}</option>
                      <option value="booking">{t("contact.subjectBooking")}</option>
                      <option value="nurse">{t("contact.subjectNurse")}</option>
                      <option value="account">{t("contact.subjectAccount")}</option>
                    </select>
                  </div>

                  {/* MESSAGE */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-semibold text-[#001F24]">
                      {t("contact.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={t("contact.messagePlaceholder")}
                      className="w-full resize-y rounded-lg bg-[#EDFCFF] px-4 py-3.5 text-sm text-[#001F24] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006D77]"
                    />
                  </div>

                  {/* SEND BUTTON */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#00535B] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#006D77] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {sending ? (
                      <span>{dir === "rtl" ? "جارٍ الإرسال..." : "Sending..."}</span>
                    ) : (
                      <>
                        <span>{t("contact.sendButton")}</span>
                        <Send size={18} className={dir === "rtl" ? "rotate-180" : ""} />
                      </>
                    )}
                  </button>

                  <p className="flex items-center gap-2 text-xs text-[#6F797A]">
                    <ShieldCheck size={15} className="text-[#00535B]" />
                    {t("contact.formNote")}
                  </p>
                </form>
              )}
            </section>

            {/* ================= RIGHT SIDE ================= */}
            <aside className="flex flex-col gap-4 lg:col-span-5">

              {/* EMAIL */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DBF9FF] text-[#00535B]">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#001F24]">
                      {t("contact.emailTitle")}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#3E494A]">
                      {t("contact.emailDescription")}
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="mt-3 inline-block text-sm font-semibold text-[#00535B] hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7EFF7] text-[#00535B]">
                    <Phone size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#001F24]">
                      {t("contact.phoneTitle")}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#3E494A]">
                      {t("contact.phoneDescription")}
                    </p>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                      className="mt-3 inline-block text-sm font-semibold text-[#00535B] hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A9ECE5] text-[#00535B]">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#001F24]">
                      {t("contact.locationTitle")}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#3E494A]">
                      {t("contact.locationDescription")}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#00535B]">
                      {contactInfo.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* EMERGENCY */}
              <div className="rounded-xl bg-[#FFF0EF] p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#BA1A1A] text-white">
                    <Phone size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#93000A]">
                      {t("contact.emergencyTitle")}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#93000A]">
                      {t("contact.emergencyDescription")}
                    </p>
                    <p className="mt-2 text-sm font-bold tracking-wide text-[#BA1A1A]">
                      {contactInfo.emergencyPhone}
                    </p>
                  </div>
                </div>
              </div>

            </aside>
          </div>

          {/* ================= BOTTOM INFO ================= */}
          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* SUPPORT */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DBF9FF] text-[#00535B]">
                <MessageCircle size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#001F24]">
                  {t("contact.infoOneTitle")}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#3E494A]">
                  {t("contact.infoOneDescription")}
                </p>
              </div>
            </div>

            {/* HOURS */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7EFF7] text-[#00535B]">
                <Clock3 size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#001F24]">
                  {t("contact.infoTwoTitle")}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#3E494A]">
                  {contactInfo.workingHours || t("contact.infoTwoDescription")}
                </p>
              </div>
            </div>

            {/* PRIVACY */}
            <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A9ECE5] text-[#00535B]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#001F24]">
                  {t("contact.infoThreeTitle")}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#3E494A]">
                  {t("contact.infoThreeDescription")}
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}