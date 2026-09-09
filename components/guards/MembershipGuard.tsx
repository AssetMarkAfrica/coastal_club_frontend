"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthLoading, selectIsAuthenticated } from "@/store/auth/authSelectors";
import { selectMyMembership } from "@/store/membership/membershipSelectors";
import { fetchMyMembership } from "@/store/membership/membershipThunks";

type GuardState = "pending" | "ready" | "redirecting";

/**
 * MembershipGuard
 *
 * requireActive={true}  → only users WITH an active membership may pass.
 *                          Non-members are redirected to /booking/customer/create.
 *
 * requireActive={false} → only users WITHOUT an active membership may pass.
 *                          Active members are redirected to /booking/member/create.
 *
 * The guard owns its own fetch lifecycle via a local ref so it is never
 * confused by the global membershipLoading flag which is shared across all
 * membership thunks on the page.
 */
export default function MembershipGuard({
  requireActive,
  children,
}: {
  requireActive: boolean;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const authLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // Read after our own fetch resolves — NOT used to trigger loading state.
  const myMembership = useAppSelector(selectMyMembership);

  const [guardState, setGuardState] = useState<GuardState>("pending");
  // Prevent double-fetching in StrictMode / concurrent renders
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    // Not logged in — send to login immediately
    if (!isAuthenticated) {
      setGuardState("redirecting");
      router.replace("/auth/login");
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // If membership data is already in the store (app navigation), skip the network call
    if (myMembership !== null) {
      setGuardState("ready");
      return;
    }

    // Fetch and decide once the result lands
    dispatch(fetchMyMembership()).then((action) => {
      // Whether fulfilled or rejected, we now have a definitive answer
      // action.payload is the MyMembership object on success, or undefined on failure
      const membership = fetchMyMembership.fulfilled.match(action)
        ? action.payload
        : null;

      const hasActive = membership?.is_active === true;

      if (requireActive && !hasActive) {
        setGuardState("redirecting");
        router.replace("/booking/customer/create");
      } else if (!requireActive && hasActive) {
        setGuardState("redirecting");
        router.replace("/booking/member/create");
      } else {
        setGuardState("ready");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  // Handle the case where myMembership was already in store when guard mounted
  useEffect(() => {
    if (guardState !== "ready" || myMembership === null) return;

    const hasActive = myMembership.is_active === true;

    if (requireActive && !hasActive) {
      setGuardState("redirecting");
      router.replace("/booking/customer/create");
    } else if (!requireActive && hasActive) {
      setGuardState("redirecting");
      router.replace("/booking/member/create");
    }
    // Only run when we first transition to "ready" via the store shortcut path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardState]);

  if (guardState !== "ready") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-muted/30 border-t-gold-muted" />
      </main>
    );
  }

  return <>{children}</>;
}
