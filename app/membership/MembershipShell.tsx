"use client";

import { usePathname } from "next/navigation";
import MemberSidebar from "@/app/sidebar/MemberSidebar";
import AdminSidebar from "@/app/sidebar/AdminSidebar";
import StaffSidebar from "@/app/sidebar/StaffSidebar";
import MemberNavbar from "@/app/navbar/MemberNavbar";
import AdminNavbar from "@/app/navbar/AdminNavbar";
import RoleGuard from "@/components/guards/RoleGuard";

export default function MembershipShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/membership/view-applications");
  const isPaymentRoute = pathname.startsWith("/membership/payments");
  const isLatePaymentRoute = pathname.startsWith("/membership/late-payments");
  const isStaffRoute = pathname.startsWith("/membership/members/subscriptions");

  // Admin-only for admin pages; staff is never allowed in the membership app
  const allowedRoles = isAdminRoute || isPaymentRoute || isLatePaymentRoute ? ["admin"] : isStaffRoute ? ["staff"] : ["member"];

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div
        className="flex min-h-screen bg-cream antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {isAdminRoute || isPaymentRoute || isLatePaymentRoute ? <AdminSidebar /> : isStaffRoute ? <StaffSidebar /> : <MemberSidebar />}

        <div className="flex-1 flex flex-col min-w-0">
          {isAdminRoute || isPaymentRoute || isLatePaymentRoute ? <AdminNavbar /> : isStaffRoute ? <AdminNavbar /> : <MemberNavbar />}
          {children}
        </div>
      </div>
    </RoleGuard>
  );
}
