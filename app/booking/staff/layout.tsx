import RoleGuard from "../components/RoleGuard";
import { ReactNode } from "react";

export default function StaffBookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      {children}
    </RoleGuard>
  );
}
