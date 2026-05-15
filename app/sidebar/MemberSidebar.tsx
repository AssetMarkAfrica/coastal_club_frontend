"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/auth/authSelectors";
import { selectMyMembership } from "@/store/membership/membershipSelectors";
import { logoutUser } from "@/store/auth/authThunks";

/* ── Icons ───────────────────────────────────────────── */
const IconGrid = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
);
const IconCard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);
const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconStar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

/* ── Nav items definition ─────────────────────────────── */
const NAV_ITEMS = [
    { label: "Dashboard", icon: <IconGrid />, href: "/membership/dashboard" },
    { label: "Member Card", icon: <IconCard />, href: "/membership/card" },
    { label: "Bookings", icon: <IconCalendar />, href: "/membership/bookings" },
    { label: "Exclusive Perks", icon: <IconStar />, href: "/membership/perks" },
    { label: "Settings", icon: <IconSettings />, href: "/membership/settings" },
] as const;

/* ── Active-tab helper ───────────────────────────────── */
function useIsActive() {
    const pathname = usePathname();
    return (href: string): boolean => {
        // Dashboard: treat both /membership and /membership/dashboard as active
        if (href === "/membership/dashboard") {
            return (
                pathname === "/membership" ||
                pathname === "/membership/dashboard" ||
                pathname.startsWith("/membership/dashboard/")
            );
        }
        return pathname === href || pathname.startsWith(href + "/");
    };
}

/* ── Component ───────────────────────────────────────── */
export default function MemberSidebar() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isActive = useIsActive();
    const currentUser = useAppSelector(selectCurrentUser);
    const membership = useAppSelector(selectMyMembership);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const initials =
        [currentUser?.first_name?.[0], currentUser?.last_name?.[0]]
            .filter(Boolean)
            .join("")
            .toUpperCase() || "M";

    const tierLabel = membership
        ? membership.plan.tier.charAt(0).toUpperCase() + membership.plan.tier.slice(1)
        : null;

    const displayName =
        currentUser?.first_name
            ? `${currentUser.first_name} ${currentUser.last_name ?? ""}`.trim()
            : "Member Profile";

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

                <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-gold-muted/60 bg-primary-container/60 overflow-hidden flex items-center justify-center shrink-0">
                        <span suppressHydrationWarning className="text-gold-muted text-sm font-semibold">{initials}</span>
                    </div>
                    <div>
                        <p suppressHydrationWarning className="text-sm font-semibold text-cream leading-tight">{displayName}</p>
                        <p suppressHydrationWarning className="text-[11px] text-gold-muted/80 mt-0.5">
                            {tierLabel ? `${tierLabel} Member` : "Member"}
                        </p>
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
            <div className="px-3 pb-6 space-y-4 border-t border-white/8 pt-4">
                <Link
                    href="/membership/plans"
                    className="w-full flex items-center justify-center rounded border border-gold-muted/70 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gold-light hover:bg-gold-muted hover:text-primary transition-colors"
                >
                    Explore Plans
                </Link>
                <div className="space-y-0.5">
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
            </div>
        </aside>
    );
}
