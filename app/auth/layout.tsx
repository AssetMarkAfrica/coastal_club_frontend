"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectIsNewUser,
} from "@/store/auth/authSelectors";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isNewUser = useAppSelector(selectIsNewUser);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isNewUser ? "/profile" : "/");
    }
  }, [isAuthenticated, isNewUser, router]);

  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <p className="text-sm text-slate-600">Redirecting...</p>
      </main>
    );
  }

  return <>{children}</>;
}
