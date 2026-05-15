"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationDropDown from "@/app/notification/NotificationDropDown";

const PAGE_TITLES: Record<string, string> = {
  "/membership/view-applications": "Applications",
  "/membership/dashboard": "Dashboard",
  "/membership/plans": "Plans",
};

const getPageTitle = (pathname: string) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES)
    .filter(([route]) => pathname.startsWith(route + "/"))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : "Admin";
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header
      className="flex items-center justify-between px-5 h-16 sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: "rgba(247,243,236,0.94)",
        borderColor: "rgba(201,168,76,0.18)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div>
        <p
          className="text-lg font-semibold leading-none text-navy-deep"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Estrella del Mar
        </p>
        <p
          className="text-[10px] tracking-[0.18em] uppercase mt-0.5"
          style={{ color: "rgba(183,146,43,0.8)" }}
        >
          Admin {pageTitle}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <NotificationDropDown />

        <Link
          href="/profile"
          className="p-2 rounded-lg transition-all"
          style={{ color: "rgba(16,36,63,0.5)" }}
          aria-label="Profile"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
