// Shared landing page component — used by both app/page.tsx (public root)
// and app/landing-page/page.tsx (direct URL access).

import Link from "next/link";

export default function LandingPageContent() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');`}</style>

      <div className="bg-cream text-text-primary antialiased" style={{ fontFamily: "var(--font-inter)" }}>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex bg-navy-deep/90 backdrop-blur-md sticky top-0 z-50 border-b border-gold-muted/25 shadow-sm flex-row items-center w-full px-6 h-20 max-w-full mx-auto justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gold-light tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Estrella del Mar
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {[
              { label: "The Club", active: true },
              { label: "Dining" },
              { label: "Social" },
              { label: "Membership" },
              { label: "About Us" },
            ].map(({ label, active }) => (
              <Link
                key={label}
                href="#"
                className={`text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-white/5 px-1 pb-1 ${
                  active ? "text-gold-light border-b-2 border-gold-light" : "text-white/80 hover:text-gold-light"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-2">
              {["language", "search"].map((icon) => (
                <button key={icon} className="text-white/80 hover:text-gold-light transition-colors hover:bg-white/5 p-2 rounded-full">
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </button>
              ))}
            </div>
            <Link
              href="/auth/login"
              className="bg-primary text-gold-light border border-gold-muted/50 px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-gold-light hover:text-primary transition-all duration-300 rounded"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Join the Club
            </Link>
          </div>
        </nav>

        {/* ── Mobile Navigation ── */}
        <nav className="md:hidden bg-navy-deep sticky top-0 z-50 border-b border-gold-muted/25 px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-semibold text-gold-light" style={{ fontFamily: "var(--font-playfair)" }}>
            Estrella del Mar
          </span>
          <button className="text-gold-light">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </nav>

        {/* ── Hero Section ── */}
        <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjVUS_A5x9OgDlUnf2I4hkvZMiOk7nfGmJYYo5Y63PZre4BVNBZGsWvDa7CIAv1KNmBhl2lwaGOgOsFL-JpljTw4Bx_WuPDzoPhkcuqi2DrCu3Nk7H3sE2TZ88QcW4mKLrWQHIWZWWbkYUbigCgjjXEyhKgfW7XXO6iXbtlop91Sl2Epe0FtAmr2l2LD2y3ax2PU2PHyL68TKkG0U7ZsKWh71bNPVI4zTlxxPa6T4xLRzhgAsOlPIoOVzULx7HcNbIA0Mpclo"
              alt="Hero Beach Club"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-navy-deep/80" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
            <span className="text-xs text-gold-light uppercase tracking-[0.2em] mb-6 block drop-shadow-md font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
              Welcome to Laboma Beach
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Where Excellence <br />
              <span className="italic text-gold-light font-light">Meets the Horizon</span>
            </h1>
            <p className="text-lg text-cream/90 max-w-2xl mx-auto mb-12 drop-shadow-md" style={{ fontFamily: "var(--font-inter)" }}>
              An exclusive enclave of luxury, dining, and unparalleled social experiences on the pristine shores of Accra.
            </p>
            <Link
              href="/auth/register"
              className="glass-panel text-gold-light px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gold-light hover:text-navy-deep transition-all duration-300 rounded shadow-2xl flex items-center group"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Request Invitation
              <span className="material-symbols-outlined ml-3 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </Link>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <span className="text-gold-light/70 uppercase tracking-widest text-[10px] mb-2 font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
              Scroll to Explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-gold-light/50 to-transparent" />
          </div>
        </section>

        {/* ── The Experience Section ── */}
        <section className="py-24 px-6 bg-cream relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#B7922B 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-navy-deep mb-4" style={{ fontFamily: "var(--font-playfair)" }}>The Experience</h2>
              <div className="w-16 h-0.5 bg-gold-muted/50 mx-auto mb-6" />
              <p className="text-base text-text-secondary max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                Curated spaces designed for the discerning few. From sun-drenched shores to moonlit soirées.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjVUS_A5x9OgDlUnf2I4hkvZMiOk7nfGmJYYo5Y63PZre4BVNBZGsWvDa7CIAv1KNmBhl2lwaGOgOsFL-JpljTw4Bx_WuPDzoPhkcuqi2DrCu3Nk7H3sE2TZ88QcW4mKLrWQHIWZWWbkYUbigCgjjXEyhKgfW7XXO6iXbtlop91Sl2Epe0FtAmr2l2LD2y3ax2PU2PHyL68TKkG0U7ZsKWh71bNPVI4zTlxxPa6T4xLRzhgAsOlPIoOVzULx7HcNbIA0Mpclo",
                  alt: "The Beach Club", icon: "pool", title: "The Beach Club",
                  desc: "Pristine white sands, private cabanas, and attentive service at the water's edge.",
                  cta: "Discover More", offset: false,
                },
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeAXSHbRB9ugh6_oIsOESq_hmrZRlq_eBrrpzbvd0gfPSALmph_CqPdahtz-NNURNoHm9clxKs_SCPX90J5UbkdneAe4qJUt-iI65bKeGjHJ4KKTG95G3sDYiTRqi3lA28E-9tGM6R97TzjnK4koZFkT4ck5bPxDzgsUC6OtZJjBvG7VbG0qcf919X_NRtDVC-Z-S3IeMqN1NoaT1-kFEbhyxWQ9hr6GLkV1JpijC02BCvpQa67RVpaC9DxRP-72xkSnnRXpM",
                  alt: "Fine Dining", icon: "restaurant", title: "Fine Dining",
                  desc: "Culinary masterpieces crafted by world-class chefs, set against breathtaking coastal views.",
                  cta: "View Menus", offset: true,
                },
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzppAJpTKP7n1YwhinvpAKYW3C7tJ7JPeUbqezj4ZC1gj17MLwqigJvJRR4HLFdUSB0bA7MbZT5QFCxw2ktlUlcdf6fckq3E6TCHj6cYDFPoaCKhVI3FoqfOmwzPXPvK8r3GtnPgxspwRPsJpV0T6EIWZM3QGk7bYoN8xpcPoD_rDl3zqxkCbbTzC5evOYhRQpozMF7OuF2Kh4A4iH--y5mOPLolmxTtWt9XmHwJmSgZG2y1Idbso9uosKcEFxewl-J_vNnJU",
                  alt: "The Social Scene", icon: "celebration", title: "The Social Scene",
                  desc: "Exclusive events, intimate gatherings, and a community of distinguished individuals.",
                  cta: "Event Calendar", offset: false,
                },
              ].map(({ img, alt, icon, title, desc, cta, offset }) => (
                <div key={title} className={`bg-white rounded border border-gold-muted/20 overflow-hidden card-hover-lift group cursor-pointer ${offset ? "md:mt-12" : ""}`}>
                  <div className="h-64 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-8 relative">
                    <div className="absolute -top-6 right-8 w-12 h-12 bg-navy-deep rounded-full flex items-center justify-center border border-gold-muted/30 shadow-lg">
                      <span className="material-symbols-outlined text-gold-light">{icon}</span>
                    </div>
                    <h3 className="text-xl font-medium text-navy-deep mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                    <p className="text-sm text-text-secondary mb-6" style={{ fontFamily: "var(--font-inter)" }}>{desc}</p>
                    <Link href="#" className="text-xs font-semibold tracking-widest uppercase text-gold-muted hover:text-navy-deep transition-colors flex items-center" style={{ fontFamily: "var(--font-inter)" }}>
                      {cta} <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Location Section ── */}
        <section className="py-24 bg-white border-y border-gold-muted/20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 border border-gold-muted/20 rounded-lg -rotate-2" />
              <div className="absolute -inset-4 border border-gold-muted/20 rounded-lg rotate-2" />
              <div className="relative bg-cream-dark p-2 rounded-lg shadow-xl">
                <div className="bg-navy-deep rounded overflow-hidden relative h-[500px] w-full flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                  <div className="text-center z-10 px-8">
                    <span className="material-symbols-outlined text-5xl text-gold-light mb-4 block">location_on</span>
                    <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Laboma Beach</h3>
                    <p className="text-cream/70" style={{ fontFamily: "var(--font-inter)" }}>Accra, Ghana</p>
                    <div className="mt-8 border border-gold-muted/30 p-4 inline-block bg-white/5 backdrop-blur-sm rounded">
                      <p className="text-xs font-semibold tracking-widest uppercase text-gold-light" style={{ fontFamily: "var(--font-inter)" }}>Coordinates</p>
                      <p className="text-white font-mono text-sm mt-1">5.5401° N, 0.1345° W</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-muted mb-4 block" style={{ fontFamily: "var(--font-inter)" }}>The Sanctuary</span>
              <h2 className="text-4xl font-semibold text-navy-deep mb-6" style={{ fontFamily: "var(--font-playfair)" }}>A Hidden Gem on the Atlantic</h2>
              <p className="text-base text-text-secondary mb-8 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                Nestled along the pristine shores of Laboma Beach, Estrella del Mar offers an escape from the city's rhythm. The architecture harmonizes with the natural landscape, creating a seamless transition from refined interiors to the untamed beauty of the Atlantic Ocean.
              </p>
              <ul className="space-y-4 mb-10">
                {["15 minutes from Kotoka International Airport", "Secure, private access roads", "Helipad facilities available for Premier members"].map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="material-symbols-outlined text-gold-muted mr-3 mt-1">check_circle</span>
                    <span className="text-base text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="border border-navy-deep text-navy-deep px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-navy-deep hover:text-white transition-all duration-300 rounded flex items-center group" style={{ fontFamily: "var(--font-inter)" }}>
                Get Directions
                <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">east</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Membership CTA ── */}
        <section className="navy-gradient-bg py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-muted/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="material-symbols-outlined text-gold-light text-5xl mb-6 block">workspace_premium</span>
            <h2 className="text-4xl font-semibold text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Elevate Your Lifestyle</h2>
            <p className="text-lg text-cream/80 mb-10" style={{ fontFamily: "var(--font-inter)" }}>
              Membership at Estrella del Mar is strictly by invitation or referral. Discover our tiers and begin your journey into exclusive coastal luxury.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/auth/register" className="bg-gold-light text-navy-deep border border-gold-light px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-transparent hover:text-gold-light transition-all duration-300 rounded w-full sm:w-auto shadow-lg shadow-gold-muted/20" style={{ fontFamily: "var(--font-inter)" }}>
                Explore Our Tiers
              </Link>
              <button className="bg-transparent text-white border border-white/30 px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-all duration-300 rounded w-full sm:w-auto" style={{ fontFamily: "var(--font-inter)" }}>
                Contact Concierge
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-navy-deep w-full py-12 border-t border-gold-muted/30 flex flex-col items-center justify-center text-center space-y-6 px-6">
          <div className="text-xl font-semibold text-gold-light mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Estrella del Mar</div>
          <div className="flex flex-wrap justify-center gap-8 mb-4">
            {["Privacy Policy", "Terms of Service", "Press Inquiry", "Careers"].map((link) => (
              <Link key={link} href="#" className="text-gold-muted/80 hover:text-gold-light transition-colors text-xs font-semibold tracking-widest uppercase hover:underline decoration-gold-muted/50" style={{ fontFamily: "var(--font-inter)" }}>
                {link}
              </Link>
            ))}
          </div>
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold-muted/30 to-transparent" />
          <p className="text-sm text-gold-muted opacity-80" style={{ fontFamily: "var(--font-inter)" }}>
            © 2024 Estrella del Mar. All rights reserved. Laboma Beach, Accra.
          </p>
        </footer>

      </div>
    </>
  );
}
