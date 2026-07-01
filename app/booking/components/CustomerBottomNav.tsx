"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, WalletCards, CreditCard, Headset } from "lucide-react";

export default function CustomerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Book",
      icon: CalendarDays,
      href: "/booking/customer/create",
      activePaths: ["/booking/customer/create"],
    },
    {
      label: "Spend",
      icon: WalletCards,
      href: "/booking/customer/spend", // Example future path
      activePaths: ["/booking/customer/spend"],
    },
    {
      label: "Card",
      icon: CreditCard,
      href: "/booking/customer/card", // Example future path
      activePaths: ["/booking/customer/card"],
    },
    {
      label: "Help",
      icon: Headset,
      href: "/booking/customer/help", // Example future path
      activePaths: ["/booking/customer/help"],
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-4 pb-safe bg-navy-deep border-t border-gold-light/25 shadow-[0_-4px_24px_rgba(16,36,63,0.3)] rounded-t-xl">
      {navItems.map((item) => {
        const isActive = item.activePaths.includes(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-transform duration-200 hover:text-gold-light active:scale-90 ${
              isActive ? "text-gold-light scale-110" : "text-cream-dark/50"
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="font-label-uppercase text-[10px] uppercase tracking-wider font-semibold">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
