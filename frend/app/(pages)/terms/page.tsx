"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  UserCheck,
  CalendarDays,
  HeartHandshake,
  ShieldCheck,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function TermsPage() {
  const { t, dir } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: "terms.useTitle",
      description: "terms.useDescription",
      check: "terms.useCheck",
    },
    {
      icon: UserCheck,
      title: "terms.accountsTitle",
      description: "terms.accountsDescription",
      check: "terms.accountsCheck",
    },
    {
      icon: CalendarDays,
      title: "terms.bookingTitle",
      description: "terms.bookingDescription",
      check: "terms.bookingCheck",
    },
    {
      icon: HeartHandshake,
      title: "terms.responsibilitiesTitle",
      description: "terms.responsibilitiesDescription",
      check: "terms.responsibilitiesCheck",
    },
    {
      icon: ShieldCheck,
      title: "terms.safetyTitle",
      description: "terms.safetyDescription",
      check: "terms.safetyCheck",
    },
    {
      icon: Mail,
      title: "terms.contactTitle",
      description: "terms.contactDescription",
      check: "terms.contactCheck",
    },
  ];

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#EDFCFF] text-[#001F24]"
    >
   

      <main className="w-full bg-[#EDFCFF] pt-20">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-16 lg:py-8">

          {/* HERO */}
          <header className="relative mb-6 overflow-hidden rounded-xl bg-[#DBF9FF] p-6 shadow-sm lg:p-10">
            <div className="relative z-10 flex max-w-3xl flex-col gap-4">
              
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#A9ECE5] px-4 py-2 text-[#286D67]">
                <FileText size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t("terms.badge")}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#001F24] sm:text-4xl lg:text-[42px] lg:leading-[50px]">
                {t("terms.title")}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-[#3E494A] sm:text-lg">
                {t("terms.description")}
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-[#3E494A]">
                <span className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-[#00535B]"
                  />
                  {t("terms.simpleTerms")}
                </span>

                <span className="flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    className="text-[#00535B]"
                  />
                  {t("terms.trust")}
                </span>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 rounded-full border border-[#006972]/20 lg:block" />
            <div className="pointer-events-none absolute -right-4 top-8 hidden h-56 w-56 rounded-full border border-[#006972]/15 lg:block" />
          </header>

          {/* IMPORTANT NOTICE */}
          <section className="mb-8 rounded-xl bg-white p-5 shadow-sm lg:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7EFF7] text-[#00535B]">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#001F24]">
                  {t("terms.noticeTitle")}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#3E494A]">
                  {t("terms.noticeDescription")}
                </p>
              </div>
            </div>
          </section>

          {/* TERMS CARDS */}
          <section className="mb-10">
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00535B]">
                {t("terms.sectionsLabel")}
              </span>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#001F24]">
                {t("terms.sectionsTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="flex flex-col rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md lg:p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C2E9F1] text-[#00535B]">
                        <Icon size={21} />
                      </div>

                      <span className="text-xs font-medium text-[#6F797A]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#001F24]">
                      {t(section.title)}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#3E494A]">
                      {t(section.description)}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-[#EDFCFF] pt-4 text-xs font-semibold text-[#00535B]">
                      <CheckCircle2 size={15} />
                      <span>{t(section.check)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* CONTACT / CTA */}
          <section 	id="helpful" className="flex flex-col items-center justify-between gap-6 rounded-xl bg-[#00535B] p-6 text-center shadow-xl md:flex-row md:text-start lg:p-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {t("terms.ctaTitle")}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#9FF0FB]">
                {t("terms.ctaDescription")}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <a
                href="mailto:legal@nurseconnect.health"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#00535B] shadow-md transition-all hover:bg-[#DBF9FF]"
              >
                <Mail size={19} />
                {t("terms.contactButton")}
              </a>

              <a
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#006D77] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#166270]"
              >
                <ArrowLeft
                  size={19}
                  className={dir === "rtl" ? "rotate-180" : ""}
                />
                {t("terms.homeButton")}
              </a>
            </div>
          </section>
        </div>
      </main>


    </div>
  );
}