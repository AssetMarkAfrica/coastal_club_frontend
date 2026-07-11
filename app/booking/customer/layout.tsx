import CustomerBottomNav from "../components/CustomerBottomNav";
import NonMemberSidebar from "@/app/sidebar/NonMemberSidebar";
import RoleGuard from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function CustomerBookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["member"]}>
      <div
        className="flex min-h-screen bg-cream antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <NonMemberSidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-[calc(64px+env(safe-area-inset-bottom)+24px)] md:pb-0">
          {children}
          <CustomerBottomNav />
        </div>
      </div>
    </RoleGuard>
  );
}
