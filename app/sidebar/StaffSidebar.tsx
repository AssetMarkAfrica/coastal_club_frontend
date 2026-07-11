"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/auth/authSelectors";
import { logoutUser } from "@/store/auth/authThunks";

/* ── Icons ───────────────────────────────────────────── */
const IconClipboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
);
const IconReceipt = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
);
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconSupport = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
);
const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

/* ── Nav items — only pages that actually exist ──────── */
const NAV_ITEMS = [
    {
        label: "Reservations",
        icon: <IconClipboard />,
        href: "/booking/staff/reservations",
    },
    {
        label: "Spend Entries",
        icon: <IconReceipt />,
        href: "/booking/staff/spend-entries",
    },
    {
        label: "Log New Spend",
        icon: <IconPlus />,
        href: "/booking/staff/spend-entries/create",
    },
] as const;

/* ── Active-tab helper ───────────────────────────────── */
function useIsActive() {
    const pathname = usePathname();
    return (href: string): boolean => {
        // "Log New Spend" is a child of spend-entries; match it exactly
        // so both items don't light up at once.
        if (href === "/booking/staff/spend-entries") {
            return (
                pathname === "/booking/staff/spend-entries" ||
                (pathname.startsWith("/booking/staff/spend-entries/") &&
                    !pathname.startsWith("/booking/staff/spend-entries/create"))
            );
        }
        return pathname === href || pathname.startsWith(href + "/");
    };
}

/* ── Component ───────────────────────────────────────── */
export default function StaffSidebar() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isActive = useIsActive();
    const currentUser = useAppSelector(selectCurrentUser);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const initials =
        [currentUser?.first_name?.[0], currentUser?.last_name?.[0]]
            .filter(Boolean)
            .join("")
            .toUpperCase() || "S";

    const displayName =
        currentUser?.first_name
            ? `${currentUser.first_name} ${currentUser.last_name ?? ""}`.trim()
            : "Staff Member";

    const onLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await dispatch(logoutUser()).unwrap();
        } catch {
            // Local auth state is still cleared by slice on fulfilled path.
        } finally {
            router.replace("/auth/login");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* ── Desktop sidebar ───────────────────────────────── */}
            <aside
                className="hidden lg:flex w-62 shrink-0 flex-col bg-navy-deep text-cream border-r border-white/5"
                style={{ fontFamily: "var(--font-inter)" }}
            >
                {/* Brand + profile */}
                <div className="px-6 pt-8 pb-6 border-b border-white/8">
                    <p
                        className="text-2xl italic text-gold-muted leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Estrella del Mar
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-gold-muted/30 bg-gold-muted/10 px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-gold-light">
                            Staff Portal
                        </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-2 border-gold-muted/60 bg-primary-container/60 overflow-hidden flex items-center justify-center shrink-0">
                            <span suppressHydrationWarning className="text-gold-muted text-sm font-semibold">
                                {initials}
                            </span>
                        </div>
                        <div>
                            <p suppressHydrationWarning className="text-sm font-semibold text-cream leading-tight">
                                {displayName}
                            </p>
                            <p className="text-[11px] text-gold-muted/80 mt-0.5">Staff</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-0.5">
                    {NAV_ITEMS.map(({ label, icon, href }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-all duration-150 border-l-2 ${active
                                    ? "bg-primary/70 border-gold-muted text-gold-light font-medium"
                                    : "text-cream/60 hover:text-cream hover:bg-white/5 border-transparent"
                                    }`}
                            >
                                <span className={active ? "text-gold-muted" : "text-cream/40"}>
                                    {icon}
                                </span>
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="px-3 pb-6 space-y-0.5 border-t border-white/8 pt-4">
                    <Link
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-cream/50 hover:text-cream/80 transition-colors"
                    >
                        <IconSupport /> Support
                    </Link>
                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-cream/50 hover:text-cream/80 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <IconLogout /> {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            {/* ── Mobile bottom nav ─────────────────────────────── */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-navy-deep border-t border-gold-muted/25 shadow-[0_-4px_24px_rgba(16,36,63,0.35)]"
                style={{ fontFamily: "var(--font-inter)", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {NAV_ITEMS.map(({ label, icon, href }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-all duration-200 active:scale-90 ${active ? "text-gold-light scale-105" : "text-cream/45 hover:text-cream/80"
                                }`}
                        >
                            <span className={`transition-colors ${active ? "text-gold-muted" : "text-cream/40"}`}>
                                {icon}
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase leading-none">
                                {label}
                            </span>
                        </Link>
                    );
                })}
                {/* Logout shortcut */}
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-cream/45 hover:text-cream/80 transition-all active:scale-90 disabled:opacity-40"
                >
                    <IconLogout />
                    <span className="text-[9px] font-semibold tracking-widest uppercase leading-none">
                        {isLoggingOut ? "..." : "Logout"}
                    </span>
                </button>
            </nav>
        </>
    );
}
