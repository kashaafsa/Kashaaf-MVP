import React, { useState } from 'react';
import { Menu, X, ChevronDown, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGamesOpen, setIsGamesOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Logo & Navigation */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer group mr-10">
                            <img src="/logo-final.png" alt="Kashaaf" className="h-25 w-auto object-contain" />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-8">
                                <a href="#" className="hover:text-gaming-primary transition-colors px-3 py-2 rounded-md font-medium">Feed</a>
                                <a href="#" className="hover:text-gaming-primary transition-colors px-3 py-2 rounded-md font-medium">AI Lab</a>

                                {/* Games Dropdown */}
                                <div
                                    className="relative inline-block text-left"
                                    onMouseEnter={() => setIsGamesOpen(true)}
                                    onMouseLeave={() => setIsGamesOpen(false)}
                                >
                                    <button className="flex items-center hover:text-gaming-primary transition-colors px-3 py-2 rounded-md font-medium outline-none">
                                        Games <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>

                                    <AnimatePresence>
                                        {isGamesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-gaming-dark/95 border border-white/10 ring-1 ring-black ring-opacity-5 backdrop-blur-xl"
                                            >
                                                <div className="py-1" role="menu">
                                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Overwatch 2</a>
                                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">EA FC 26</a>
                                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Call of Duty</a>
                                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Valorant</a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Auth & Mobile Toggle */}
                    <div className="flex items-center">
                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <a href="#" className="text-white hover:text-gaming-primary transition-colors font-medium">Log in</a>
                            <a href="#" className="bg-gaming-primary text-black hover:bg-gaming-primary/80 px-4 py-2 rounded-full font-bold transition-transform hover:scale-105 inline-block">
                                Sign up
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center ml-4">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gaming-primary focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gaming-dark/95 border-b border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gaming-primary hover:bg-white/5">Feed</a>
                            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gaming-primary hover:bg-white/5">AI Page</a>
                            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gaming-primary hover:bg-white/5">Games</a>
                            <div className="border-t border-white/10 mt-4 pt-4 flex flex-col space-y-3 px-3">
                                <a href="#" className="w-full text-left text-white hover:text-gaming-primary font-medium block">Log in</a>
                                <a href="#" className="w-full bg-gaming-primary text-black px-4 py-2 rounded-full font-bold text-center block">Sign up</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
