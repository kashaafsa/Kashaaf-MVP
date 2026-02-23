"use client";

import LandingHero from "@/components/landing/LandingHero";
import { useI18n } from "@/lib/i18n-context";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen bg-gaming-dark text-white font-sans">
      <main className="flex-grow">
        <LandingHero />
        <section className="bg-gaming-dark py-20 px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.trending")}</h2>
          <p className="text-gray-400">{t("home.trendingSub")}</p>
        </section>
      </main>
    </div>
  );
}

