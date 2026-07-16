import RoleGuard from "@/components/guards/RoleGuard";
import StaffSidebar from "@/app/sidebar/StaffSidebar";
import { ReactNode } from "react";

export default function StaffEventsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin", "staff", "member"]}>
      <div
        className="flex min-h-screen bg-cream antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <StaffSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </RoleGuard>
  );
}
