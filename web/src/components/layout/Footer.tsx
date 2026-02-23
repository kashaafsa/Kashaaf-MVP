"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Twitch, Youtube, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export function Footer() {
    const pathname = usePathname();
    const { t, toggleLocale } = useI18n();
    const isAuth = pathname?.startsWith("/auth");

    if (isAuth) return null;

    return (
        <footer className="bg-gaming-dark border-t border-white/10 pt-16 pb-8 font-sans text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Socials */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">{t("footer.followUs")}</h3>
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
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">{t("footer.platform")}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/feed" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("nav.feed")}</Link></li>
                            <li><Link href="/AI" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("footer.aiAssistant")}</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("footer.tournaments")}</Link></li>
                            <li><Link href="/games" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("nav.games")}</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider">{t("footer.company")}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("nav.aboutUs")}</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("footer.contactUs")}</Link></li>
                            <li><Link href="/careers" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("footer.careers")}</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-gaming-primary transition-colors text-sm">{t("footer.privacyPolicy")}</Link></li>
                        </ul>
                    </div>

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1 md:text-end flex flex-col items-start md:items-end">
                        <div className="flex items-center gap-[26px]">
                            <img src="/logo-final.png" alt="Kashaaf" className="h-[170px] w-auto object-contain" />
                            <div className="h-32 w-px bg-white/20"></div>
                            <img src="/coxe-logo.png" alt="COXE - Center of Digital Entrepreneurship" className="h-[160px] w-auto object-contain opacity-90" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Kashaaf. {t("footer.rights")}
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <button
                            onClick={toggleLocale}
                            className="flex items-center text-gray-500 text-sm cursor-pointer hover:text-white transition-colors"
                        >
                            <Globe size={20} className="me-2" />
                            <span>{t("footer.language")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
