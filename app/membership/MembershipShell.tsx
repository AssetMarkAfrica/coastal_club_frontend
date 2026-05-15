"use client";

import { usePathname } from "next/navigation";
import MemberSidebar from "@/app/sidebar/MemberSidebar";
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import MemberNavbar from "@/app/navbar/MemberNavbar";
import AdminNavbar from "@/app/navbar/AdminNavbar";

export default function MembershipShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/membership/view-applications");

  return (
    <div
      className="flex min-h-screen bg-cream antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {isAdminRoute ? <AdminSidebar /> : <MemberSidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        {isAdminRoute ? <AdminNavbar /> : <MemberNavbar />}
        {children}
      </div>
    </div>
  );
}
