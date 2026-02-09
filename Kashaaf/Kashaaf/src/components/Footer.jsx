import React from 'react';
import { Twitter, Instagram, Youtube, Twitch, MessageCircle, Mail, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gaming-dark border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Socials */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gaming-primary hover:text-black transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gaming-primary hover:text-black transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gaming-primary hover:text-black transition-all">
                                <Twitch size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gaming-primary hover:text-black transition-all">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Feed</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">AI Assistant</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Tournaments</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Games</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1 md:text-right flex flex-col items-start md:items-end">
                        <img src="/logo-final.png" alt="Kashaaf" className="h-40 w-auto mb-4" />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Kashaaf. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="flex items-center text-gray-500 text-sm">
                            <Globe size={10} className="mr-2" />
                            <span>English (US)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
