import MembershipShell from "./MembershipShell";

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MembershipShell>{children}</MembershipShell>;
}
