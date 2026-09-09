import MemberSidebar from "@/app/sidebar/MemberSidebar";
import MemberNavbar from "@/app/navbar/MemberNavbar";
import MembershipGuard from "@/components/guards/MembershipGuard";
import { ReactNode } from "react";

export default function MemberBookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // requireActive={true} → users WITHOUT an active membership are redirected to /booking/customer/create
    <MembershipGuard requireActive={true}>
      <div
        className="flex min-h-screen bg-cream antialiased"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <MemberSidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <MemberNavbar />
          {children}
        </div>
      </div>
    </MembershipGuard>
  );
}
