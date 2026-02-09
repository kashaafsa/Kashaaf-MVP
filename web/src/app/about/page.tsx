"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Target, Share2, X } from 'lucide-react';

const AboutUs = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gaming-dark text-white overflow-hidden relative">
            <main className="flex-grow pt-32 pb-16"> {/* Increased top padding */}

                <div className="relative z-10 container mx-auto px-4 max-w-7xl"> {/* Increased max-width */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col w-full"
                    >

                        {/* 1. Header Section: Logo Left, Text Right */}
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
                            {/* Left: Logo */}
                            <motion.div
                                variants={itemVariants}
                                className="w-full md:w-1/2 flex justify-center md:justify-center"
                            >
                                <img
                                    src="/logo-final.png"
                                    alt="Kashaaf Logo"
                                    className="w-80 md:w-[450px] h-auto object-contain drop-shadow-2xl"
                                />
                            </motion.div>

                            {/* Right: Title & Intro */}
                            <motion.div
                                variants={itemVariants}
                                className="w-full md:w-1/2 text-center md:text-left"
                            >
                                <h1 className="text-5xl md:text-7xl font-bold text-gaming-primary mb-4">
                                    What is KASHAAF?
                                </h1>
                                <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-6">
                                    The Future of Esports Talent Discovery
                                </h2>
                                <p className="text-xl text-gray-400 leading-relaxed">
                                    Kashaaf serves as the comprehensive digital ecosystem for the esports sector, designed to bridge the gap between ambition and professionalism.
                                </p>
                            </motion.div>
                        </div>

                        {/* 2. Content Sections: Network & AI (Stacked Vertical) */}
                        <div className="space-y-24 mb-32 w-full">
                            {/* Professional Esports Network */}
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                <motion.div
                                    variants={itemVariants}
                                    className="flex-1 p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gaming-primary/50 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-16 h-16 rounded-full bg-gaming-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Share2 className="text-gaming-primary w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold mb-4 text-white">Professional Esports Network</h3>
                                            <p className="text-gray-400 leading-relaxed text-lg">
                                                A dedicated space for the entire esports ecosystem—Players, Coaches, Referees, and Streamers.
                                                Showcase your journey, publish your professional CV, and share highlights that demonstrate your true skill level.
                                                Connect with like-minded professionals in a specialized environment built just for gaming.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Image 1 */}
                                <motion.div variants={itemVariants} className="w-full lg:w-[450px] flex-shrink-0">
                                    <motion.img
                                        whileHover={{ scale: 1.05, rotate: 0 }}
                                        whileTap={{ scale: 0.95 }}
                                        src="/about_images/event-1.jpg"
                                        alt="Event 1"
                                        onClick={() => setSelectedImage("/about_images/event-1.jpg")}
                                        className="w-full h-64 object-cover rounded-2xl border-2 border-white/10 shadow-2xl rotate-2 cursor-pointer hover:border-gaming-primary/50 transition-all duration-300"
                                    />
                                </motion.div>
                            </div>

                            {/* AI-Powered Evolution */}
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                <motion.div
                                    variants={itemVariants}
                                    className="flex-1 p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gaming-secondary/50 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-16 h-16 rounded-full bg-gaming-secondary/20 flex items-center justify-center flex-shrink-0">
                                            <Cpu className="text-gaming-secondary w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold mb-4 text-white">AI-Powered Evolution</h3>
                                            <p className="text-gray-400 leading-relaxed text-lg">
                                                Transform from amateur to professional with our advanced AI analysis. Upload your gameplay footage and receive
                                                instant, data-driven ratings and varied advice. Our system designs a personalized professional development path
                                                tailored specifically to your current level and goals.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Image 2 */}
                                <motion.div variants={itemVariants} className="w-full lg:w-[450px] flex-shrink-0">
                                    <motion.img
                                        whileHover={{ scale: 1.05, rotate: 0 }}
                                        whileTap={{ scale: 0.95 }}
                                        src="/about_images/event-2.jpg"
                                        alt="Event 2"
                                        onClick={() => setSelectedImage("/about_images/event-2.jpg")}
                                        className="w-full h-64 object-cover rounded-2xl border-2 border-white/10 shadow-2xl rotate-[-2deg] cursor-pointer hover:border-gaming-secondary/50 transition-all duration-300"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* 3. Vision Section */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 max-w-4xl mx-auto w-full"
                        >
                            <div className="flex justify-center mb-6">
                                <Target className="w-16 h-16 text-gaming-primary" />
                            </div>
                            <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                            <p className="text-xl md:text-2xl font-bold text-gray-200 leading-relaxed">
                                "To become the leading platform for discovering and empowering esports talents in Saudi Arabia and the Middle East."
                            </p>
                        </motion.div>

                        {/* 4. Event Photos */}


                    </motion.div>
                </div>
            </main>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={32} />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Full Screen Event"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AboutUs;
