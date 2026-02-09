import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const sentences = [
    "The ultimate social platform for gamers to connect, showcase, and compete",
    "Join the community to see the latest highlights!",
    "Level up your gaming career with the world's best community",
    "Where legends are born and no talent is wasted!"
];

const videos = [
    "/videos/overwatch.mp4",
    "/videos/cod.mp4",
    "/videos/fc.mp4",
    "/videos/valorant.mp4"
];

const Hero = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % sentences.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Video Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-transparent to-transparent z-10" />

            {/* Video Background */}
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


            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-2"
                >
                    {/* Logo Placeholder */}
                    <div className="w-64 md:w-80 mx-auto">
                        <img
                            src="/logo-final.png"
                            alt="Kashaaf Logo"
                            className="w-full h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-2"
                >
                    WHERE NO TALENT IS WASTED
                </motion.h1>

                <div className="h-24 mb-4 overflow-hidden relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentTextIndex}
                            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                            transition={{
                                duration: 0.5,
                                type: "spring",
                                stiffness: 100
                            }}
                            className="text-xl md:text-2xl font-bold text-white absolute w-full"
                            style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.7)" }}
                        >
                            {sentences[currentTextIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button className="px-8 py-4 bg-gaming-primary text-black font-bold rounded-full text-lg hover:bg-gaming-primary/80 transition-all hover:scale-105 flex items-center justify-center gap-2">
                        Join Now <Play size={20} fill="currentColor" />
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-all hover:scale-105">
                        Explore Feed
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
