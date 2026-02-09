"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, User, Settings, Moon, Sun, Monitor, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const pathname = usePathname();
    const { setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isGamesOpen, setIsGamesOpen] = useState(false);

    const isLanding = pathname === "/";
    const isAuth = pathname?.startsWith("/auth");

    if (isAuth) return null;

    // Dynamic Styles based on Landing vs App
    const navbarClasses = isLanding
        ? "fixed top-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10 text-white font-sans transition-all duration-300"
        : "sticky top-0 z-50 w-full border-b border-border/50 bg-background/50 backdrop-blur-xl transition-all duration-300";

    const logoSrc = "/logo-navbar.png";
    const logoClasses = isLanding
        ? "h-25 w-auto object-contain"
        : "object-contain transition-transform group-hover:scale-110";

    return (
        <header className={navbarClasses}>
            <div className={`mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 w-full`}>

                {/* Left Side: Logo & Navigation */}
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <Link href="/" className={`group flex items-center gap-2 mr-10`}>
                        <div className={`relative ${isLanding ? "h-auto w-auto" : "h-25 w-25"}`}>
                            {/* Using standard img tag for landing logo to match original design exact sizing, Next Image for app */}
                            {isLanding ? (
                                <img src={logoSrc} alt="Kashaaf" className={logoClasses} />
                            ) : (
                                <Image
                                    src={logoSrc}
                                    alt="Kashaaf Logo"
                                    fill
                                    className={logoClasses}
                                    priority
                                />
                            )}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink href="/feed" active={pathname === "/feed"} isLanding={isLanding}>
                            Feed
                        </NavLink>

                        {isLanding ? (
                            // Landing Specific Links
                            <>
                                <NavLink href="/AI" active={false} isLanding={isLanding}>AI Lab</NavLink>
                                {/* Games Dropdown for Landing */}
                                <div
                                    className="relative inline-block text-left"
                                    onMouseEnter={() => setIsGamesOpen(true)}
                                    onMouseLeave={() => setIsGamesOpen(false)}
                                >
                                    <button className="flex items-center hover:text-gaming-primary transition-colors px-3 py-2 rounded-md font-medium outline-none cursor-pointer">
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
                                                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Overwatch 2</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">EA FC 26</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Call of Duty</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-white/5 hover:text-gaming-primary" role="menuitem">Valorant</Link>
                                                </div>

                                            </motion.div>

                                        )}
                                    </AnimatePresence>
                                </div>
                                <NavLink href="/tournament" active={false} isLanding={isLanding}>Tournament</NavLink>
                                <NavLink href="/about" active={false} isLanding={isLanding}>About Us</NavLink>
                            </>
                        ) : (
                            // App Specific Links
                            <>
                                <NavLink href="/AI" active={pathname === "/AI"} isLanding={isLanding}>
                                    AI LAB
                                </NavLink>
                                <NavLink href="/games" active={pathname === "/games"} isLanding={isLanding}>
                                    Games
                                </NavLink>
                                <NavLink href="/tournament" active={pathname === "/tournament"} isLanding={isLanding}>
                                    Tournament
                                </NavLink>
                                <NavLink href="/about" active={pathname === "/about"} isLanding={isLanding}>
                                    About Us
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-4">

                    {isLanding ? (
                        // Landing Actions (Log in / Sign up)
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/auth" className="text-white hover:text-gaming-primary transition-colors font-medium">Log in</Link>
                            <Link href="/auth?mode=signup" className="bg-gaming-primary text-black hover:bg-gaming-primary/80 px-4 py-2 rounded-full font-bold transition-transform hover:scale-105 inline-block">
                                Join
                            </Link>
                        </div>
                    ) : (
                        // App Actions (User Menu)
                        <>
                            {/* Home Button */}
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    Home
                                </Button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/avatar-placeholder.png" alt="User" />
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold">JD</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">John Doe</p>
                                            <p className="text-xs leading-none text-muted-foreground">kashaaf@example.com</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span className="ml-2">Theme</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                                <Sun className="mr-2 h-4 w-4" />
                                                Light
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                <Moon className="mr-2 h-4 w-4" />
                                                Dark
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                                <Monitor className="mr-2 h-4 w-4" />
                                                System
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center ml-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isLanding ? "text-white hover:text-gaming-primary" : "text-foreground hover:text-primary"}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Unified) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`md:hidden border-b ${isLanding ? "bg-gaming-dark/95 border-white/10" : "bg-background/95 border-border/10"}`}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/feed" className={`block px-3 py-2 rounded-md text-base font-medium ${isLanding ? "text-white hover:text-gaming-primary hover:bg-white/5" : "text-foreground hover:text-primary hover:bg-primary/5"}`}>Feed</Link>

                            {isLanding ? (
                                <>
                                    <Link href="/AI" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gaming-primary hover:bg-white/5">AI Lab</Link>
                                    <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gaming-primary hover:bg-white/5">Games</Link>
                                    <Link href="/tournament" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gaming-primary hover:bg-white/5">Tournament</Link>
                                    <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gaming-primary hover:bg-white/5">About Us</Link>
                                    <div className="border-t border-white/10 mt-4 pt-4 flex flex-col space-y-3 px-3">
                                        <Link href="/auth" className="w-full text-left text-white hover:text-gaming-primary font-medium block">Log in</Link>
                                        <Link href="/auth?mode=signup" className="w-full bg-gaming-primary text-black px-4 py-2 rounded-full font-bold text-center block">Join</Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/AI" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5">AI LAB</Link>
                                    <Link href="/games" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5">Games</Link>
                                    <Link href="/tournament" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5">Tournament</Link>
                                    <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5">About Us</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}

function NavLink({ href, active, isLanding, children }: { href: string; active: boolean; isLanding: boolean; children: React.ReactNode }) {
    if (isLanding) {
        return (
            <Link href={href} className="hover:text-gaming-primary transition-colors px-3 py-2 rounded-md font-medium text-white">
                {children}
            </Link>
        )
    }

    return (
        <Link
            href={href}
            className={`
        px-3 py-2 rounded-md font-medium transition-colors
        ${active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
      `}
        >
            {children}
        </Link>
    );
}
