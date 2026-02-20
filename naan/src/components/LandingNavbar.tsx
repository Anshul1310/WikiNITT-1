"use client";

import { signIn, useSession } from "next-auth/react";
import { UserMenu } from "@/components/Navbar";
import { Menu, MapPin, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LandingSearch } from "@/components/LandingSearch";
import { SearchModal } from "@/components/SearchModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function LandingNavbar() {
    const { status } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: "Map", href: "/map" },
        { label: "About Us", href: "#footer" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href === "#footer") {
            e.preventDefault();
            const footer = document.getElementById("footer");
            if (footer) {
                footer.scrollIntoView({ behavior: "smooth" });
            } else if (pathname !== "/") {
                window.location.href = "/#footer";
            }
        }
    };

    return (
        <header className="w-full font-[Manrope,sans-serif] relative z-50 pt-4">
            <div className="flex justify-between items-center px-8 py-3 max-w-[1400px] mx-auto relative">
                {/* Logo - Minimalist Serif 'W' */}
                <div className="flex items-center gap-2 z-10 w-[140px]">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="WikiNITT" className="h-10 w-10 object-contain" />
                    </Link>
                </div>

                {/* Centered Desktop Nav */}
                <nav className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex gap-12 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={cn(
                                    "text-[1rem] font-medium transition-colors hover:text-[#3b28cc]",
                                    pathname === item.href || (item.href === "/" && pathname === "/")
                                        ? "text-[#1a1a1a]"
                                        : "text-[#666]"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-5 z-10 w-[140px] justify-end">
                    {/* Search icon */}
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="text-[#333] hover:text-[#1a1a1a] transition-colors p-1"
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Login / User menu */}
                    {status === "authenticated" ? (
                        <UserMenu />
                    ) : (
                        <button
                            onClick={() => signIn("dauth")}
                            className="rounded-full px-6 py-2.5 bg-[#FFF9EA] text-[#333] text-[0.85rem] font-bold shadow-sm hover:shadow-md hover:bg-[#fff5d6] transition-all"
                        >
                            Login
                        </button>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="lg:hidden text-[#666]"
                        onClick={() => setMobileOpen((prev) => !prev)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl mt-3 transition-all duration-300 origin-top",
                    mobileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}
            >
                <div className="px-5 py-4 flex flex-col gap-4">
                    {pathname === "/articles" && (
                        <div className="w-full flex flex-col gap-3">
                            <LandingSearch />
                            <button
                                onClick={() => { setIsSearchOpen(true); closeMobile(); }}
                                className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 bg-white text-[#3b28cc] font-semibold"
                            >
                                <Search className="w-4 h-4" /> Open Search
                            </button>
                        </div>
                    )}
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobile}
                            className="flex items-center justify-between text-[0.95rem] font-semibold text-[#222] py-2"
                        >
                            {item.label}
                            {pathname === item.href ? (
                                <span className="w-2 h-2 rounded-full bg-[#3b28cc]" />
                            ) : (
                                <span className="text-[#3b28cc] text-xs">Go</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}