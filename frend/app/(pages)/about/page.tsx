"use client";

import { ShieldCheck, HeartHandshake, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

const stats = [
  { value: "10,000+", key: "familiesServed" },
  { value: "2,500+", key: "verifiedNurses" },
  { value: "40+", key: "citiesCovered" },
  { value: "4.9/5", key: "averageRating" },
];

const values = [
  {
    icon: HeartHandshake,
    titleKey: "compassionFirst",
    descriptionKey: "compassionDescription",
  },
  {
    icon: ShieldCheck,
    titleKey: "trustSafety",
    descriptionKey: "trustSafetyDescription",
  },
  {
    icon: Users,
    titleKey: "communityDriven",
    descriptionKey: "communityDescription",
  },
  {
    icon: Sparkles,
    titleKey: "simpleByDesign",
    descriptionKey: "simpleDescription",
  },
];

const team = [
  {
    name: "Dana Whitfield",
    roleKey: "coFounderCEO",
    bioKey: "danaBio",
  },
  {
    name: "Marcus Elling",
    roleKey: "coFounderCTO",
    bioKey: "marcusBio",
  },
  {
    name: "Priya Raman",
    roleKey: "headOfNursePartnerships",
    bioKey: "priyaBio",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
  

      <main>
        {/* HERO */}
        <section className="bg-gradient-to-br from-teal-800 to-teal-900 py-20 text-white">
          <div className="container-content text-center">
            <span className="eyebrow">{t("about.ourStory")}</span>

            <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              {t("about.trustedCare")}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-teal-100/90">
              {t("about.heroDescription")}
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-white py-14">
          <div className="container-content grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.key}>
                <p className="text-3xl font-bold text-teal-800">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-navy-900/60">
                  {t(`about.${stat.key}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section className="bg-cloud py-20">
          <div className="container-content grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="eyebrow-light">
                {t("about.howWeStarted")}
              </span>

              <h2 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
                {t("about.builtByANurse")}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-navy-900/70">
                {t("about.storyParagraph1")}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-navy-900/70">
                {t("about.storyParagraph2")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-teal-700 p-6 text-white">
                <p className="text-2xl font-bold">2026</p>

                <p className="mt-1 text-sm text-teal-100/80">
                  {t("about.foundedIn")}
                </p>
              </div>

              <div className="rounded-2xl bg-navy-950 p-6 text-white">
                <p className="text-2xl font-bold">100%</p>

                <p className="mt-1 text-sm text-white/60">
                  {t("about.licensedChecked")}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-2xl font-bold text-teal-800">
                  24/7
                </p>

                <p className="mt-1 text-sm text-navy-900/60">
                  {t("about.supportAvailable")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="bg-white py-20">
          <div className="container-content text-center">
            <span className="eyebrow-light">
              {t("about.whatWeStandFor")}
            </span>

            <h2 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
              {t("about.ourValues")}
            </h2>

            <div className="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.titleKey}
                  className="rounded-2xl bg-cloud p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <value.icon size={20} />
                  </span>

                  <h3 className="mt-4 font-semibold text-navy-900">
                    {t(`about.${value.titleKey}`)}
                  </h3>

                  <p className="mt-2 text-sm text-navy-900/60">
                    {t(`about.${value.descriptionKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="bg-cloud py-20">
          <div className="container-content text-center">
            <span className="eyebrow-light">
              {t("about.leadership")}
            </span>

            <h2 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
              {t("about.meetTheTeam")}
            </h2>

            <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                    {member.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>

                  <h3 className="mt-4 font-semibold text-navy-900">
                    {member.name}
                  </h3>

                  <p className="text-sm font-medium text-teal-700">
                    {t(`about.${member.roleKey}`)}
                  </p>

                  <p className="mt-2 text-sm text-navy-900/60">
                    {t(`about.${member.bioKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-20 text-center text-white">
          <div className="container-content">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("about.joinUs")}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-teal-100/90">
              {t("about.ctaDescription")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/find-a-nurses" variant="primary">
                {t("about.getStarted")}
              </Button>

              <Button href="/join-as-a-nurse" variant="outline">
                {t("about.joinAsNurse")}
              </Button>
            </div>
          </div>
        </section>
      </main>

   
    </>
  );
}