"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n-context';

const videos = [
    '/videos/overwatch.mp4',
    '/videos/cod.mp4',
    '/videos/fc.mp4',
    '/videos/valorant.mp4',
];

const LandingHero = () => {
    const { t, tArray } = useI18n();
    const sentences = tArray("hero.sentences");

    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [sentences.length]);

    return (
        <div className="relative h-screen w-full overflow-hidden font-sans">
            {/* video background */}
            <AnimatePresence>
                <motion.video
                    key={currentVideoIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={videos[currentVideoIndex]} type="video/mp4" />
                </motion.video>
            </AnimatePresence>

            {/* overlays */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-transparent to-transparent z-10" />

            {/* content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-4"
                >
                    <img src="/logo-final.png" alt="Kashaaf" className="w-64 md:w-80 mx-auto drop-shadow-2xl" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gaming-primary font-bold text-lg md:text-xl mb-4 tracking-[0.2em]"
                >
                    {t("hero.tagline")}
                </motion.h2>

                {/* rotating sentences */}
                <div className="h-[60px] md:h-[40px] mb-8 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentSentenceIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto"
                        >
                            {sentences[currentSentenceIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/auth?mode=signup"
                        className="px-8 py-4 bg-gaming-primary text-black font-bold rounded-full text-lg hover:bg-gaming-primary/80 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {t("hero.joinNow")} <Play size={20} fill="currentColor" />
                    </Link>
                    <Link
                        href="/pilot"
                        className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Rocket size={20} /> {t("hero.pilot")}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingHero;
