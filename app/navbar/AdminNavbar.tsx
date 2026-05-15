"use client";
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

       
      </div>
    </header>
  );
}
