"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";

export default function SharedNavbar() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { label: "The Club",          href: "/" },
        { label: "Fine Dining",        href: "/fine-dining" },
        { label: "Sky Bar",            href: "/skybar" },
        { label: "Executive Lounge",   href: "/executive-lounge" },
        { label: "Private Room",       href: "/private-room" },
        { label: "Membership",         href: "/membership/plans" },
    ];

    return (
        <>
            <style>{`
                .snav-link {
                    position: relative;
                    padding-bottom: 2px;
                }
                .snav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1.5px;
                    background: #F1E0A6;
                    transform: scaleX(0);
                    transform-origin: left center;
                    transition: transform 0.3s ease;
                }
                .snav-link:hover::after { transform: scaleX(1); }
                .snav-link-active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1.5px;
                    background: #F1E0A6;
                    transform: scaleX(1);
                }
                .snav-link-active { position: relative; padding-bottom: 2px; }

                @keyframes mobileSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .mobile-menu-open { animation: mobileSlideDown 0.25s ease-out forwards; }
            `}</style>

            {/* ── Desktop Nav ── */}
            <nav
                className={`hidden md:flex fixed top-0 left-0 right-0 z-50 flex-row items-center w-full px-8 h-20 justify-between transition-all duration-500 ${
                    scrolled
                        ? "bg-[rgba(6,17,30,0.85)] backdrop-blur-xl border-b border-[rgba(241,224,166,0.1)] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
                        : "bg-transparent backdrop-blur-sm border-b border-transparent"
                }`}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex flex-col items-start hover:opacity-80 transition-opacity shrink-0"
                >
                    <span className="text-2xl font-semibold text-[#F1E0A6] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                        Estrella del Mar
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F1E0A6]/70 mt-0.5">
                        Beach Club
                    </span>
                </Link>

                {/* Links */}
                <div className="hidden lg:flex items-center space-x-7">
                    {navLinks.map(({ label, href }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                                    isActive
                                        ? "snav-link-active text-[#F1E0A6]"
                                        : "snav-link text-white/70 hover:text-[#F1E0A6]"
                                }`}
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                    {/* Icon buttons */}
                    {["search"].map((icon) => (
                        <button
                            key={icon}
                            className="text-white/60 hover:text-[#F1E0A6] transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <span className="material-symbols-outlined text-xl">{icon}</span>
                        </button>
                    ))}

                    {isAuthenticated ? (
                        <Link
                            href="/membership/dashboard"
                            className="bg-white/5 text-[#F1E0A6] border border-[rgba(241,224,166,0.25)] px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 rounded-lg backdrop-blur-sm"
                            style={{ fontFamily: "var(--font-inter)" }}
                        >
                            My Portal
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-white/5 text-[#F1E0A6] border border-[rgba(241,224,166,0.25)] px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 rounded-lg backdrop-blur-sm"
                            style={{ fontFamily: "var(--font-inter)" }}
                        >
                            Login
                        </Link>
                    )}

                    <Link
                        href="/membership/plans"
                        className="bg-[#F1E0A6] text-[#10243F] px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-white transition-all duration-300 rounded-lg shadow-[0_2px_12px_rgba(241,224,166,0.2)]"
                        style={{ fontFamily: "var(--font-inter)" }}
                    >
                        Join the Club
                    </Link>
                </div>
            </nav>

            {/* ── Mobile Nav ── */}
            <nav
                className={`md:hidden fixed top-0 left-0 right-0 z-50 px-5 py-4 flex justify-between items-center transition-all duration-500 ${
                    scrolled || mobileOpen
                        ? "bg-[rgba(6,17,30,0.92)] backdrop-blur-xl border-b border-[rgba(241,224,166,0.1)]"
                        : "bg-transparent backdrop-blur-sm"
                }`}
            >
                <Link
                    href="/"
                    className="flex flex-col items-start hover:opacity-80 transition-opacity"
                >
                    <span className="text-xl font-semibold text-[#F1E0A6]" style={{ fontFamily: "var(--font-playfair)" }}>
                        Estrella del Mar
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#F1E0A6]/70">
                        Beach Club
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="text-[#F1E0A6] hover:text-white transition-colors p-1"
                    aria-label="Toggle menu"
                >
                    <span className="material-symbols-outlined text-[28px]">
                        {mobileOpen ? "close" : "menu"}
                    </span>
                </button>
            </nav>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden fixed top-[60px] left-0 right-0 z-40 bg-[rgba(6,17,30,0.97)] backdrop-blur-2xl border-b border-[rgba(241,224,166,0.1)] mobile-menu-open shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
                    <div className="flex flex-col px-5 py-6 space-y-1">
                        {navLinks.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`py-3 px-4 rounded-lg text-sm font-semibold tracking-[0.08em] uppercase transition-all ${
                                    pathname === href
                                        ? "bg-[rgba(241,224,166,0.1)] text-[#F1E0A6] border border-[rgba(241,224,166,0.15)]"
                                        : "text-white/60 hover:text-[#F1E0A6] hover:bg-white/5"
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-[rgba(241,224,166,0.1)] flex flex-col gap-3">
                            {isAuthenticated ? (
                                <Link
                                    href="/membership/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 text-center text-[#F1E0A6] border border-[rgba(241,224,166,0.25)] rounded-lg text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all"
                                >
                                    My Portal
                                </Link>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 text-center text-[#F1E0A6] border border-[rgba(241,224,166,0.25)] rounded-lg text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all"
                                >
                                    Login
                                </Link>
                            )}
                            <Link
                                href="/membership/plans"
                                onClick={() => setMobileOpen(false)}
                                className="py-3 text-center bg-[#F1E0A6] text-[#10243F] rounded-lg text-xs font-semibold tracking-[0.1em] uppercase hover:bg-white transition-all"
                            >
                                Join the Club
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
