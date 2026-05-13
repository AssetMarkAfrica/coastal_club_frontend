import { Suspense } from "react";
import GoogleCallbackClient from "./GoogleCallbackClient";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Google Sign-In</h1>
            <p className="mt-3 text-sm text-slate-600">Completing Google sign-in...</p>
          </section>
        </main>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}