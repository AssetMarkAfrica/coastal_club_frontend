"use client";

export default function WaitlistExperience() {
  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f5f0e8] px-6 py-10">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gold-muted/25 bg-white shadow-[0_24px_64px_rgba(16,36,63,0.14)]">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c9a84c 0px, transparent 160px), radial-gradient(circle at 80% 80%, #10243f 0px, transparent 180px)",
          }}
        />

        <div className="relative px-7 py-10 sm:px-10 sm:py-12">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-muted"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Application In Progress
          </p>

          <h1
            className="mt-3 text-3xl font-semibold text-primary sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            You are officially on the waitlist.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Thank you for applying to Estrella del Mar. Your application is now under review,
            and our team will respond within the next 48 hours. Keep an eye on your email and
            notifications for your next step.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gold-muted/25 bg-cream/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                What happens next
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Admin review, status update, and contract instructions if approved.
              </p>
            </div>
            <div className="rounded-lg border border-gold-muted/25 bg-cream/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Stay ready
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Check notifications and your inbox so you do not miss your approval.
              </p>
            </div>
          </div>

    
        </div>
      </section>
    </main>
  );
}
