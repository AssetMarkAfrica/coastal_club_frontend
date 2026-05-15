"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/auth/authSelectors";
import { logoutUser } from "@/store/auth/authThunks";

const navItems = [

  { label: "Applications", href: "/membership/view-applications", icon: "users" },

] as const;

const iconMap: Record<string, React.ReactNode> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "credit-card": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
};

export default function AdminSidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "A";

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
    <aside className="hidden lg:flex w-sidebar-width shrink-0 flex-col border-r border-gold-muted/25 bg-linear-to-b from-navy-deep to-primary py-8 text-cream shadow-2xl shadow-navy-deep/40">
      <div className="px-6 mb-8">
        <h1 className="text-2xl italic text-gold-muted" style={{ fontFamily: "var(--font-playfair)" }}>
          Estrella del Mar
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gold-muted/30 bg-gold-muted/20 flex items-center justify-center">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="Admin avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-gold-light">{initials}</span>
            )}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-gold-light">
              Admin Portal
            </p>
            <p className="text-xs text-cream/60">System Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all ${
                active
                  ? "border-r-4 border-gold-muted bg-gold-muted/10 text-gold-light"
                  : "text-cream/70 hover:bg-primary-container/50 hover:text-gold-light"
              }`}
            >
              {iconMap[item.icon]}
              <span className="text-[11px] uppercase tracking-[0.12em] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gold-muted/20 px-6 pt-6">
        <Link href="#" className="flex items-center gap-3 py-3 text-cream/70 hover:text-gold-light">
          <span className="text-sm">?</span>
          <span className="text-[11px] uppercase tracking-[0.12em] font-semibold">Support</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 py-3 text-cream/70 hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-sm">↩</span>
          <span className="text-[11px] uppercase tracking-[0.12em] font-semibold">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}

