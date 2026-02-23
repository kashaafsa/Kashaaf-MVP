"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Users, Upload, Brain, Share2, Crown, Building2,
    CheckCircle2, ArrowRight, Activity, Gamepad2, Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n-context";

/* ───────── background videos ───────── */
const videos = [
    "/videos/overwatch.mp4",
    "/videos/cod.mp4",
    "/videos/fc.mp4",
    "/videos/valorant.mp4",
];

const stepIcons = [Users, Upload, Brain, Share2];

/* ============================= PAGE ============================= */
export default function PilotPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [authChecked, setAuthChecked] = useState(false);
    const [liveCount, setLiveCount] = useState<number | null>(null);
    const [counterError, setCounterError] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* ── auth gate ── */
    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!data.session) { router.replace("/auth?redirect=/pilot"); return; }
                setAuthChecked(true);
            } catch { router.replace("/auth?redirect=/pilot"); }
        })();
    }, [router]);

    /* ── fetch user count ── */
    const fetchCount = async (): Promise<number | null> => {
        try {
            const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true });
            if (error) throw error;
            return count;
        } catch { return null; }
    };

    useEffect(() => {
        if (!authChecked) return;
        let cancelled = false;
        const init = async () => {
            const count = await fetchCount();
            if (!cancelled) { if (count !== null) setLiveCount(count); else setCounterError(true); }
        };
        init();
        pollRef.current = setInterval(async () => {
            const c = await fetchCount();
            if (!cancelled && c !== null) { setLiveCount(c); setCounterError(false); }
        }, 30_000);
        return () => { cancelled = true; if (pollRef.current) clearInterval(pollRef.current); };
    }, [authChecked]);

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gaming-primary/30 border-t-gaming-primary rounded-full animate-spin" />
            </div>
        );
    }

    const individualBenefits = [t("pilot.indBenefit1"), t("pilot.indBenefit2"), t("pilot.indBenefit3"), t("pilot.indBenefit4"), t("pilot.indBenefit5"), t("pilot.indBenefit6")];
    const businessBenefits = [t("pilot.busBenefit1"), t("pilot.busBenefit2"), t("pilot.busBenefit3"), t("pilot.busBenefit4"), t("pilot.busBenefit5"), t("pilot.busBenefit6"), t("pilot.busBenefit7"), t("pilot.busBenefit8")];
    const steps = [
        { icon: stepIcons[0], title: t("pilot.step1Title"), desc: t("pilot.step1Desc") },
        { icon: stepIcons[1], title: t("pilot.step2Title"), desc: t("pilot.step2Desc") },
        { icon: stepIcons[2], title: t("pilot.step3Title"), desc: t("pilot.step3Desc") },
        { icon: stepIcons[3], title: t("pilot.step4Title"), desc: t("pilot.step4Desc") },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gaming-dark text-white font-sans">
            {/* ════════════════════ HERO BANNER ════════════════════ */}
            <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/70 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gaming-dark z-10" />
                <AnimatePresence>
                    <motion.video key={currentVideoIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} autoPlay muted playsInline onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)} className="absolute inset-0 w-full h-full object-cover z-0">
                        <source src={videos[currentVideoIndex]} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>

                <div className="relative z-20 text-center px-4">
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-4">
                        <img src="/logo-final.png" alt="Kashaaf" className="w-48 md:w-64 mx-auto drop-shadow-2xl" />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-3">
                        {t("pilot.joinThe")} <span style={{ color: "#00E5FF", textShadow: "0 0 30px rgba(0,229,255,.5)" }}>{t("pilot.pilotWord")}</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto" style={{ textShadow: "0 0 10px rgba(0,229,255,.3)" }}>
                        {t("pilot.subtitle")}
                    </motion.p>
                </div>
            </section>

            <main className="flex-grow bg-gaming-dark">
                {/* ════════════════════ WHO IT'S FOR ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 py-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl p-8 border border-white/10 backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(0,229,255,.08) 0%, rgba(10,10,10,.9) 100%)" }}>
                            <Gamepad2 className="mb-4" size={36} style={{ color: "#00E5FF" }} />
                            <h3 className="text-xl font-bold mb-2">{t("pilot.forPlayers")}</h3>
                            <p className="text-gray-400 leading-relaxed">{t("pilot.forPlayersDesc")}</p>
                        </div>
                        <div className="rounded-2xl p-8 border border-white/10 backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(112,0,255,.08) 0%, rgba(10,10,10,.9) 100%)" }}>
                            <Trophy className="mb-4" size={36} style={{ color: "#7000ff" }} />
                            <h3 className="text-xl font-bold mb-2">{t("pilot.forAcademies")}</h3>
                            <p className="text-gray-400 leading-relaxed">{t("pilot.forAcademiesDesc")}</p>
                        </div>
                    </motion.div>
                </section>

                {/* ════════════════════ HOW IT WORKS ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 pb-20">
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">
                        {t("pilot.howItWorks")} <span style={{ color: "#00E5FF" }}>{t("pilot.works")}</span>
                    </motion.h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-2xl p-6 text-center border border-white/10 backdrop-blur-md hover:border-white/25 transition-all group" style={{ background: "rgba(255,255,255,0.03)" }}>
                                <span className="absolute -top-3 -start-3 w-8 h-8 rounded-full text-black text-sm font-bold flex items-center justify-center" style={{ background: "#00E5FF", boxShadow: "0 0 15px rgba(0,229,255,.4)" }}>{i + 1}</span>
                                <s.icon className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} style={{ color: "#00E5FF" }} />
                                <h3 className="font-bold mb-1 text-white">{s.title}</h3>
                                <p className="text-gray-500 text-sm">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ════════════════════ LIVE COUNTER ════════════════════ */}
                <section className="max-w-xl mx-auto px-4 pb-20">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl border border-white/10 p-10 text-center backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(0,229,255,.06) 0%, rgba(112,0,255,.06) 100%)", boxShadow: "0 0 60px rgba(0,229,255,.08), inset 0 0 60px rgba(0,229,255,.03)" }}>
                        <Activity className="mx-auto mb-3 animate-pulse" size={40} style={{ color: "#00E5FF" }} />
                        <p className="text-gray-400 text-xs uppercase tracking-[0.25em] mb-2">{t("pilot.usersLabel")}</p>
                        <p className="text-6xl md:text-7xl font-black text-white mb-2" style={{ textShadow: "0 0 30px rgba(0,229,255,.4)" }}>
                            {counterError && liveCount === null ? "—" : (liveCount ?? "...")}
                        </p>
                        <p className="text-xs text-gray-600">{counterError && liveCount === null ? t("pilot.unavailable") : t("pilot.realtimeNote")}</p>
                        <div className="absolute -top-16 -end-16 w-48 h-48 rounded-full border border-white/5 animate-ping pointer-events-none" />
                        <div className="absolute -bottom-12 -start-12 w-36 h-36 rounded-full border border-white/5 animate-pulse pointer-events-none" />
                    </motion.div>
                </section>

                {/* ════════════════════ PRICING ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 pb-24">
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight">
                        {t("pilot.chooseYour")} <span style={{ color: "#00E5FF" }}>{t("pilot.plan")}</span>
                    </motion.h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Individual */}
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 backdrop-blur-md p-8 flex flex-col hover:border-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,229,255,.1)" }}><Crown size={24} style={{ color: "#00E5FF" }} /></div>
                                <h3 className="text-xl font-bold">{t("pilot.individual")}</h3>
                            </div>
                            <div className="mb-6"><span className="text-5xl font-black" style={{ color: "#00E5FF", textShadow: "0 0 20px rgba(0,229,255,.3)" }}>20</span><span className="text-lg text-gray-500 ms-2">{t("pilot.sarMo")}</span></div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {individualBenefits.map((b) => (<li key={b} className="flex items-start gap-2.5 text-sm text-gray-300"><CheckCircle2 className="shrink-0 mt-0.5" size={16} style={{ color: "#00E5FF" }} />{b}</li>))}
                            </ul>
                            <Link href="/pay?plan=individual" className="block text-center py-3.5 rounded-full font-bold text-black text-lg transition-all hover:scale-105" style={{ background: "#00E5FF", boxShadow: "0 0 20px rgba(0,229,255,.3)" }}>
                                {t("pilot.subscribe")} <ArrowRight className="inline ms-1" size={16} />
                            </Link>
                        </motion.div>

                        {/* Business */}
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl border-2 backdrop-blur-md p-8 flex flex-col relative overflow-hidden hover:scale-[1.01] transition-transform" style={{ borderColor: "#7000ff", background: "linear-gradient(135deg, rgba(112,0,255,.1) 0%, rgba(10,10,10,.95) 100%)", boxShadow: "0 0 40px rgba(112,0,255,.15)" }}>
                            <span className="absolute top-4 end-4 text-xs uppercase tracking-wider px-3 py-1 rounded-full font-bold border" style={{ background: "rgba(112,0,255,.2)", borderColor: "rgba(112,0,255,.4)", color: "#a855f7" }}>{t("pilot.popular")}</span>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(112,0,255,.15)" }}><Building2 size={24} style={{ color: "#7000ff" }} /></div>
                                <h3 className="text-xl font-bold">{t("pilot.business")}</h3>
                            </div>
                            <div className="mb-6"><span className="text-5xl font-black" style={{ color: "#a855f7", textShadow: "0 0 20px rgba(112,0,255,.3)" }}>100</span><span className="text-lg text-gray-500 ms-2">{t("pilot.sarMo")}</span></div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {businessBenefits.map((b) => (<li key={b} className="flex items-start gap-2.5 text-sm text-gray-300"><CheckCircle2 className="shrink-0 mt-0.5" size={16} style={{ color: "#a855f7" }} />{b}</li>))}
                            </ul>
                            <Link href="/pay?plan=business" className="block text-center py-3.5 rounded-full font-bold text-white text-lg transition-all hover:scale-105" style={{ background: "#7000ff", boxShadow: "0 0 20px rgba(112,0,255,.3)" }}>
                                {t("pilot.subscribe")} <ArrowRight className="inline ms-1" size={16} />
                            </Link>
                            <div className="absolute -bottom-20 -end-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(112,0,255,.15) 0%, transparent 70%)" }} />
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
