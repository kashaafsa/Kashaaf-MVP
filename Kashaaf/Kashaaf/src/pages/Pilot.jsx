import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, Upload, Brain, Share2, Crown, Building2,
    CheckCircle2, ArrowRight, Activity, Gamepad2, Target, Trophy
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

/* ───────── benefit arrays (placeholders — replace with real copy later) ───────── */
const individualBenefits = [
    'Personal player profile & highlight reel',
    'Upload up to 10 clips / month',
    'AI-powered performance insights',
    'Personalized coaching plan',
    'Shareable public profile link',
    'Access to community feed',
];

const businessBenefits = [
    'All Individual features included',
    'Unlimited clip uploads',
    'Team / academy dashboard',
    'Advanced analytics & reports',
    'Priority AI coaching queue',
    'Scout & recruit player profiles',
    'Custom branding on shared links',
    'Dedicated support channel',
];

/* ───────── 4 steps ───────── */
const steps = [
    { icon: Users, title: 'Create Profile', desc: 'Sign up and build your gamer identity in seconds.' },
    { icon: Upload, title: 'Upload Clips', desc: 'Share your best gameplay moments in any format.' },
    { icon: Brain, title: 'Get Insights', desc: 'AI analyzes your gameplay and builds a coaching plan.' },
    { icon: Share2, title: 'Get Discovered', desc: 'Share your profile with scouts, teams, and the community.' },
];

/* ───────── background videos (same as hero) ───────── */
const videos = [
    '/videos/overwatch.mp4',
    '/videos/cod.mp4',
    '/videos/fc.mp4',
    '/videos/valorant.mp4',
];

/* ============================= COMPONENT ============================= */
const Pilot = () => {
    const [liveCount, setLiveCount] = useState(null);
    const [counterError, setCounterError] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const pollRef = useRef(null);
    const subRef = useRef(null);

    /* ── fetch helper ── */
    const fetchCount = async () => {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('public_stats')
                .select('total_users')
                .eq('id', 1)
                .single();
            if (error) throw error;
            return data.total_users;
        } catch {
            return null;
        }
    };

    /* ── mount: subscribe + fallback poll ── */
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            const count = await fetchCount();
            if (!cancelled) {
                if (count !== null) setLiveCount(count);
                else setCounterError(true);
            }

            if (supabase) {
                try {
                    subRef.current = supabase
                        .channel('public_stats_changes')
                        .on(
                            'postgres_changes',
                            { event: 'UPDATE', schema: 'public', table: 'public_stats', filter: 'id=eq.1' },
                            (payload) => {
                                if (!cancelled && payload.new?.total_users !== undefined) {
                                    setLiveCount(payload.new.total_users);
                                    setCounterError(false);
                                }
                            }
                        )
                        .subscribe((status) => {
                            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') startPolling();
                        });
                    return;
                } catch { /* fall through */ }
            }
            startPolling();
        };

        const startPolling = () => {
            if (pollRef.current) return;
            pollRef.current = setInterval(async () => {
                const c = await fetchCount();
                if (!cancelled && c !== null) {
                    setLiveCount(c);
                    setCounterError(false);
                }
            }, 15_000);
        };

        init();
        return () => {
            cancelled = true;
            if (pollRef.current) clearInterval(pollRef.current);
            if (subRef.current && supabase) supabase.removeChannel(subRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* ════════════════════ HERO BANNER (video bg like landing) ════════════════════ */}
            <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                {/* Video bg */}
                <div className="absolute inset-0 bg-black/70 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gaming-dark z-10" />

                <AnimatePresence>
                    <motion.video
                        key={currentVideoIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        autoPlay muted playsInline
                        onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    >
                        <source src={videos[currentVideoIndex]} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>

                <div className="relative z-20 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="mb-4"
                    >
                        <img src="/logo-final.png" alt="Kashaaf" className="w-48 md:w-64 mx-auto drop-shadow-2xl" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-3"
                    >
                        JOIN THE <span style={{ color: '#00E5FF', textShadow: '0 0 30px rgba(0,229,255,.5)' }}>PILOT</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                        style={{ textShadow: '0 0 10px rgba(0,229,255,.3)' }}
                    >
                        The esports social platform where no talent is wasted. Built for players who want to grow — and academies that want to discover them.
                    </motion.p>
                </div>
            </section>

            <main className="flex-grow bg-gaming-dark">

                {/* ════════════════════ WHO IT'S FOR ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Players */}
                        <div
                            className="rounded-2xl p-8 border border-white/10 backdrop-blur-md"
                            style={{ background: 'linear-gradient(135deg, rgba(0,229,255,.08) 0%, rgba(10,10,10,.9) 100%)' }}
                        >
                            <Gamepad2 className="mb-4" size={36} style={{ color: '#00E5FF' }} />
                            <h3 className="text-xl font-bold mb-2">For Players</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Build your profile, upload highlights, receive AI coaching plans, and get discovered by scouts — all from one platform.
                            </p>
                        </div>

                        {/* Academies */}
                        <div
                            className="rounded-2xl p-8 border border-white/10 backdrop-blur-md"
                            style={{ background: 'linear-gradient(135deg, rgba(112,0,255,.08) 0%, rgba(10,10,10,.9) 100%)' }}
                        >
                            <Trophy className="mb-4" size={36} style={{ color: '#7000ff' }} />
                            <h3 className="text-xl font-bold mb-2">For Academies & Teams</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Scout rising talent, manage your roster, and use data-driven analytics to make smarter decisions.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* ════════════════════ HOW IT WORKS ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 pb-20">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight"
                    >
                        HOW IT <span style={{ color: '#00E5FF' }}>WORKS</span>
                    </motion.h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl p-6 text-center border border-white/10 backdrop-blur-md hover:border-white/25 transition-all group"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            >
                                <span
                                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full text-black text-sm font-bold flex items-center justify-center"
                                    style={{ background: '#00E5FF', boxShadow: '0 0 15px rgba(0,229,255,.4)' }}
                                >
                                    {i + 1}
                                </span>
                                <s.icon className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} style={{ color: '#00E5FF' }} />
                                <h3 className="font-bold mb-1 text-white">{s.title}</h3>
                                <p className="text-gray-500 text-sm">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ════════════════════ LIVE COUNTER ════════════════════ */}
                <section className="max-w-xl mx-auto px-4 pb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl border border-white/10 p-10 text-center backdrop-blur-md"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,229,255,.06) 0%, rgba(112,0,255,.06) 100%)',
                            boxShadow: '0 0 60px rgba(0,229,255,.08), inset 0 0 60px rgba(0,229,255,.03)',
                        }}
                    >
                        <Activity className="mx-auto mb-3 animate-pulse" size={40} style={{ color: '#00E5FF' }} />
                        <p className="text-gray-400 text-xs uppercase tracking-[0.25em] mb-2">Total users on Kashaaf right now</p>
                        <p
                            className="text-6xl md:text-7xl font-black text-white mb-2"
                            style={{ textShadow: '0 0 30px rgba(0,229,255,.4)' }}
                        >
                            {counterError && liveCount === null ? '—' : (liveCount ?? '...')}
                        </p>
                        <p className="text-xs text-gray-600">
                            {counterError && liveCount === null ? 'Temporarily unavailable' : 'Updates in real time'}
                        </p>

                        {/* decorative rings */}
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-white/5 animate-ping pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full border border-white/5 animate-pulse pointer-events-none" />
                    </motion.div>
                </section>

                {/* ════════════════════ PRICING ════════════════════ */}
                <section className="max-w-5xl mx-auto px-4 pb-24">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tight"
                    >
                        CHOOSE YOUR <span style={{ color: '#00E5FF' }}>PLAN</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* ── Individual ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-2xl border border-white/10 backdrop-blur-md p-8 flex flex-col hover:border-white/20 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,229,255,.1)' }}>
                                    <Crown size={24} style={{ color: '#00E5FF' }} />
                                </div>
                                <h3 className="text-xl font-bold">Individual</h3>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-black" style={{ color: '#00E5FF', textShadow: '0 0 20px rgba(0,229,255,.3)' }}>20</span>
                                <span className="text-lg text-gray-500 ml-2">SAR / mo</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {individualBenefits.map((b) => (
                                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                                        <CheckCircle2 className="shrink-0 mt-0.5" size={16} style={{ color: '#00E5FF' }} />
                                        {b}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/pay?plan=individual"
                                className="block text-center py-3.5 rounded-full font-bold text-black text-lg transition-all hover:scale-105"
                                style={{ background: '#00E5FF', boxShadow: '0 0 20px rgba(0,229,255,.3)' }}
                            >
                                Subscribe <ArrowRight className="inline ml-1" size={16} />
                            </Link>
                        </motion.div>

                        {/* ── Business ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border-2 backdrop-blur-md p-8 flex flex-col relative overflow-hidden hover:scale-[1.01] transition-transform"
                            style={{
                                borderColor: '#7000ff',
                                background: 'linear-gradient(135deg, rgba(112,0,255,.1) 0%, rgba(10,10,10,.95) 100%)',
                                boxShadow: '0 0 40px rgba(112,0,255,.15)',
                            }}
                        >
                            <span
                                className="absolute top-4 right-4 text-xs uppercase tracking-wider px-3 py-1 rounded-full font-bold border"
                                style={{ background: 'rgba(112,0,255,.2)', borderColor: 'rgba(112,0,255,.4)', color: '#a855f7' }}
                            >
                                Popular
                            </span>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(112,0,255,.15)' }}>
                                    <Building2 size={24} style={{ color: '#7000ff' }} />
                                </div>
                                <h3 className="text-xl font-bold">Business</h3>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-black" style={{ color: '#a855f7', textShadow: '0 0 20px rgba(112,0,255,.3)' }}>100</span>
                                <span className="text-lg text-gray-500 ml-2">SAR / mo</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {businessBenefits.map((b) => (
                                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                                        <CheckCircle2 className="shrink-0 mt-0.5" size={16} style={{ color: '#a855f7' }} />
                                        {b}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/pay?plan=business"
                                className="block text-center py-3.5 rounded-full font-bold text-white text-lg transition-all hover:scale-105"
                                style={{ background: '#7000ff', boxShadow: '0 0 20px rgba(112,0,255,.3)' }}
                            >
                                Subscribe <ArrowRight className="inline ml-1" size={16} />
                            </Link>

                            {/* decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(112,0,255,.15) 0%, transparent 70%)' }} />
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Pilot;
