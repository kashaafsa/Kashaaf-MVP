"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Twitch, Youtube, Globe, X, Linkedin } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const isAuth = pathname?.startsWith("/auth");

    if (isAuth) return null;

    return (
        <footer className="bg-gaming-dark border-t border-white/10 pt-16 pb-8 font-sans text-white">
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
                            <li><Link href="/feed" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Feed</Link></li>
                            <li><Link href="/AI" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">AI Assistant</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Tournaments</Link></li>
                            <li><Link href="/games" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Games</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Contact Us</Link></li>
                            <li><Link href="/careers" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Careers</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1 md:text-right flex flex-col items-start md:items-end">
                        <div className="flex items-center gap-[26px]">
                            <img src="/logo-final.png" alt="Kashaaf" className="h-[170px] w-auto object-contain" />
                            <div className="h-32 w-px bg-white/20"></div>
                            <img src="/coxe-logo.png" alt="COXE - Center of Digital Entrepreneurship" className="h-[160px] w-auto object-contain opacity-90" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Kashaaf. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="flex items-center text-gray-500 text-sm cursor-pointer hover:text-white">
                            <Globe size={20} className="mr-2" />
                            <span>English (US)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/50 border border-border/50 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-110"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary hover:translate-x-1 inline-block"
            >
                {children}
            </Link>
        </li>
    );
}
