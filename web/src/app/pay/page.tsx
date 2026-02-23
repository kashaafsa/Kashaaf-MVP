"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, Mail, MessageCircle, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const videos = [
    "/videos/overwatch.mp4",
    "/videos/cod.mp4",
    "/videos/fc.mp4",
    "/videos/valorant.mp4",
];

function PayContent() {
    const params = useSearchParams();
    const { t } = useI18n();
    const planKey = params.get("plan") || "individual";
    const planNames: Record<string, string> = { individual: t("pilot.individual"), business: t("pilot.business") };
    const planPrices: Record<string, number> = { individual: 20, business: 100 };
    const name = planNames[planKey] || planNames.individual;
    const price = planPrices[planKey] || planPrices.individual;
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    return (
        <div className="flex flex-col min-h-screen bg-gaming-dark text-white font-sans">
            <div className="relative flex-grow flex items-center justify-center">
                <div className="absolute inset-0 bg-black/80 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gaming-dark/50 to-gaming-dark z-10" />
                <AnimatePresence>
                    <motion.video key={currentVideoIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} autoPlay muted playsInline onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)} className="absolute inset-0 w-full h-full object-cover z-0">
                        <source src={videos[currentVideoIndex]} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-20 w-full max-w-lg mx-4 mt-28 mb-16 rounded-2xl border border-white/10 backdrop-blur-xl p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(0,229,255,.04) 0%, rgba(10,10,10,.92) 100%)", boxShadow: "0 0 60px rgba(0,0,0,.5), inset 0 0 60px rgba(0,229,255,.02)" }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: planKey === "business" ? "rgba(112,0,255,.15)" : "rgba(0,229,255,.1)" }}>
                        <CreditCard size={28} style={{ color: planKey === "business" ? "#a855f7" : "#00E5FF" }} />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">
                        {name} {t("pay.planTitle")}
                    </h1>
                    <p className="text-5xl font-black mb-1" style={{ color: planKey === "business" ? "#a855f7" : "#00E5FF", textShadow: `0 0 25px ${planKey === "business" ? "rgba(112,0,255,.4)" : "rgba(0,229,255,.4)"}` }}>
                        {price} <span className="text-lg font-medium text-gray-500">{t("pilot.sarMo")}</span>
                    </p>

                    <div className="rounded-xl p-6 my-8 border text-start" style={{ background: "rgba(234,179,8,.06)", borderColor: "rgba(234,179,8,.2)" }}>
                        <div className="flex items-start gap-3">
                            <Lock className="shrink-0 mt-0.5" size={22} style={{ color: "#eab308" }} />
                            <div>
                                <p className="font-bold text-yellow-400 mb-1">{t("pay.notAccepted")}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{t("pay.earlyAccess")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                        <a href="mailto:info@kashaaf.gg" className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium hover:border-white/25 transition-all" style={{ background: "rgba(255,255,255,.05)" }}>
                            <Mail size={16} style={{ color: "#00E5FF" }} /> {t("pay.emailUs")}
                        </a>
                        <a href="#" className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium hover:border-white/25 transition-all" style={{ background: "rgba(255,255,255,.05)" }}>
                            <MessageCircle size={16} style={{ color: "#00E5FF" }} /> {t("pay.chatWithUs")}
                        </a>
                    </div>

                    <div className="relative group w-full">
                        <button disabled className="w-full py-3.5 rounded-full font-bold text-lg cursor-not-allowed transition-all" style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.25)" }}>
                            {t("pay.payBtn")}
                        </button>
                        <span className="pointer-events-none absolute -top-10 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-4 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/10" style={{ background: "#1a1a1a", color: "#999" }}>
                            {t("pay.comingSoon")}
                        </span>
                    </div>

                    <Link href="/pilot" className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium transition-colors" style={{ color: "#00E5FF" }}>
                        <ArrowLeft size={14} /> {t("pay.backToPilot")}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default function PayPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gaming-dark" />}>
            <PayContent />
        </Suspense>
    );
}
