import CustomerBottomNav from "../components/CustomerBottomNav";
import { ReactNode } from "react";

export default function CustomerBookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-cream font-body-lg text-text-primary antialiased min-h-screen flex flex-col pb-[calc(64px+env(safe-area-inset-bottom)+24px)] md:pb-0">
      {children}
      <CustomerBottomNav />
    </div>
  );
}
