"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import RoleGuard from "@/components/guards/RoleGuard";
import StaffSidebar from "@/app/sidebar/StaffSidebar";
import MemberSidebar from "@/app/sidebar/MemberSidebar";
import MemberNavbar from "@/app/navbar/MemberNavbar";
import AdminNavbar from "@/app/navbar/AdminNavbar";

export default function EventsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during SSR / first paint so RoleGuard's null output
  // matches exactly → no hydration mismatch.
  if (!mounted) return null;

  const isStaffRoute = pathname.startsWith("/events/staff");
  const allowedRoles = isStaffRoute
    ? ["admin", "staff"]
    : ["admin", "staff", "member"];

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div
        className="flex min-h-screen bg-cream antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {isStaffRoute ? <StaffSidebar /> : <MemberSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {isStaffRoute ? <AdminNavbar /> : <MemberNavbar />}
          {children}
        </div>
      </div>
    </RoleGuard>
  );
}
