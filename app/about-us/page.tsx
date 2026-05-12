import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata = {
    title: "About Us – Estrella del Mar",
    description:
        "Founded on the pristine shores of Laboma Beach, Estrella del Mar stands as a testament to uncompromising luxury and community.",
};

export default function AboutUsPage() {
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
              @keyframes wordDrop { from{opacity:0;transform:translateY(-24px)} to{opacity:1;transform:translateY(0)} }
              @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
              @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
              @keyframes overlaySway { 0%,100%{opacity:.58} 50%{opacity:.65} }
              @keyframes scrollBounce { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:.4} }
              .hero-word { display:inline-block; opacity:0; animation:wordDrop 0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
              .line-grow  { transform-origin:left; transform:scaleX(0); animation:lineGrow 1s ease .5s forwards; }
              .gold-shimmer { background:linear-gradient(90deg,#c9a84c 0%,#e8c96f 35%,#f5e0a0 50%,#e8c96f 65%,#c9a84c 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
              .overlay-sway { animation:overlaySway 6s ease-in-out infinite; }
              .scroll-bounce { animation:scrollBounce 1.8s ease-in-out infinite; }
              .pillar-card { transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease; }
              .pillar-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(201,168,76,.18); border-color:rgba(201,168,76,.5); }
            `}</style>

            <div className="bg-cream min-h-screen flex flex-col text-text-primary antialiased" style={{ fontFamily: "var(--font-inter)" }}>

                {/* ── Top Nav ── */}
                <nav className="bg-navy-deep/90 backdrop-blur-md sticky top-0 z-50 border-b border-gold-muted/25 shadow-sm flex justify-between items-center w-full px-6 h-16 max-w-full mx-auto">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-2xl font-semibold text-gold-light tracking-tight"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            Estrella del Mar
                        </Link>
                        <div className="hidden md:flex gap-6 items-center">
                            {[
                                { label: "The Club", href: "#" },
                                { label: "Dining", href: "#" },
                                { label: "Social", href: "#" },
                                { label: "Membership", href: "#" },
                            ].map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-gold-light transition-colors duration-300 hover:bg-white/5 px-2 py-1 rounded"
                                    style={{ fontFamily: "var(--font-inter)" }}
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                href="/about-us"
                                className="text-xs font-semibold tracking-widest uppercase text-gold-light border-b-2 border-gold-light pb-1 hover:bg-white/5 px-2 py-1 rounded"
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                About Us
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3">
                            {["language", "search"].map((icon) => (
                                <button
                                    key={icon}
                                    aria-label={icon}
                                    className="text-white/80 hover:text-gold-light transition-colors p-2 hover:bg-white/5 rounded-full"
                                >
                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                </button>
                            ))}
                        </div>
                        <Link
                            href="/auth/login"
                            className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-gold-light text-gold-light hover:bg-gold-light hover:text-navy-deep transition-colors duration-300 text-xs font-semibold tracking-widest uppercase rounded"
                            style={{ fontFamily: "var(--font-inter)" }}
                        >
                            Join the Club
                        </Link>
                        <button className="md:hidden text-gold-light p-2">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </nav>

                {/* ── Main Content ── */}
                <main className="flex-grow flex flex-col items-center w-full">

                    {/* Hero Header */}
                    <header className="w-full py-20 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold text-navy-deep mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                            {["Our", "Heritage", "&", "Vision"].map((w, i) => (
                                <span key={i} className="hero-word" style={{ animationDelay: `${200 + i * 110}ms`, marginRight: "0.3em" }}>{w}</span>
                            ))}
                        </h1>
                        <div className="w-16 h-1 bg-gold-muted mb-8 line-grow" />
                        <p className="text-base text-text-secondary max-w-2xl leading-relaxed" style={{ opacity: 0, animation: "wordDrop .7s ease 750ms forwards" }}>
                            Founded on the pristine shores of Laboma Beach, Estrella del Mar stands as a testament
                            to uncompromising luxury and community. We curate an environment where exclusivity meets
                            warmth, offering our members a sanctuary of refined elegance in the heart of Accra.
                        </p>
                        <div className="mt-10 scroll-bounce" aria-hidden>
                            <span className="material-symbols-outlined text-gold-muted text-2xl">expand_more</span>
                        </div>
                    </header>

                    {/* Section 1: The Story — Split Layout */}
                    <section className="w-full max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <AnimateOnScroll animation="fade-left" className="space-y-6 order-2 lg:order-1">
                            <span className="text-xs font-semibold tracking-widest uppercase text-gold-muted" style={{ fontFamily: "var(--font-inter)" }}>The Genesis</span>
                            <h2 className="text-4xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>A Beacon of Luxury</h2>
                            <p className="text-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                                The vision for Estrella del Mar was born from a desire to create a private enclave
                                that rivals the world's most prestigious clubs, yet remains deeply rooted in the
                                vibrant spirit of Ghana. Our founders, discerning individuals with a global
                                perspective, sought to establish a venue where business, leisure, and culture
                                intersect seamlessly.
                            </p>
                            <p className="text-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                                Every architectural detail, from the grand lobby to the intimate dining rooms, has
                                been meticulously crafted to evoke a sense of timeless grandeur. We are not just a
                                club; we are a legacy in the making.
                            </p>
                        </AnimateOnScroll>

                        <AnimateOnScroll animation="fade-right" delay={150} className="relative order-1 lg:order-2 h-[400px] lg:h-[600px] rounded-lg overflow-hidden border border-gold-light/30 shadow-[0_4px_24px_rgba(30,58,95,0.08)]">
                            <div className="absolute inset-0 bg-navy-deep/5" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzppAJpTKP7n1YwhinvpAKYW3C7tJ7JPeUbqezj4ZC1gj17MLwqigJvJRR4HLFdUSB0bA7MbZT5QFCxw2ktlUlcdf6fckq3E6TCHj6cYDFPoaCKhVI3FoqfOmwzPXPvK8r3GtnPgxspwRPsJpV0T6EIWZM3QGk7bYoN8xpcPoD_rDl3zqxkCbbTzC5evOYhRQpozMF7OuF2Kh4A4iH--y5mOPLolmxTtWt9XmHwJmSgZG2y1Idbso9uosKcEFxewl-J_vNnJU"
                                alt="Sophisticated interior of Estrella del Mar" className="w-full h-full object-cover" />
                        </AnimateOnScroll>
                    </section>

                    {/* Section 2: Location — Panoramic Overlay */}
                    <section className="w-full py-24 relative overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjVUS_A5x9OgDlUnf2I4hkvZMiOk7nfGmJYYo5Y63PZre4BVNBZGsWvDa7CIAv1KNmBhl2lwaGOgOsFL-JpljTw4Bx_WuPDzoPhkcuqi2DrCu3Nk7H3sE2TZ88QcW4mKLrWQHIWZWWbkYUbigCgjjXEyhKgfW7XXO6iXbtlop91Sl2Epe0FtAmr2l2LD2y3ax2PU2PHyL68TKkG0U7ZsKWh71bNPVI4zTlxxPa6T4xLRzhgAsOlPIoOVzULx7HcNbIA0Mpclo"
                                alt="Panoramic aerial view of Laboma Beach"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="overlay-sway absolute inset-0 bg-navy-deep/60" />
                        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
                            <AnimateOnScroll animation="fade-up">
                                <span className="text-xs font-semibold tracking-widest uppercase text-gold-light mb-4 block" style={{ fontFamily: "var(--font-inter)" }}>Our Sanctuary</span>
                                <h2 className="text-4xl font-semibold text-white mb-8" style={{ fontFamily: "var(--font-playfair)" }}>Laboma Beach, Accra</h2>
                                <p className="text-white/90 text-lg leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
                                    We chose the golden sands of Laboma Beach not just for its breathtaking beauty, but
                                    for its profound sense of tranquility. Here, where the Atlantic breeze meets the
                                    rhythmic pulse of the city, Estrella del Mar offers a secluded retreat. It is a
                                    place where the horizon stretches infinitely, mirroring the boundless possibilities
                                    we offer our members.
                                </p>
                            </AnimateOnScroll>
                        </div>
                    </section>

                    {/* Section 3: Core Pillars */}
                    <section className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
                        <AnimateOnScroll animation="fade-up" className="text-center mb-16 w-full">
                            <h2 className="text-4xl font-semibold text-navy-deep mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Our Core Pillars</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
                                The principles that guide every interaction, event, and service at Estrella del Mar.
                            </p>
                        </AnimateOnScroll>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {[
                                { icon: "lock", title: "Privacy", desc: "We hold our members' discretion in the highest regard. Estrella del Mar is a secure, enclosed environment where you can conduct business or unwind with absolute peace of mind.", delay: 0 },
                                { icon: "workspace_premium", title: "Prestige", desc: "Membership is a hallmark of distinction. We curate our community meticulously, ensuring that every individual contributes to the rich tapestry of our esteemed network.", delay: 150 },
                                { icon: "volunteer_activism", title: "Philanthropy", desc: "We believe in uplifting the community that surrounds us. Through the Estrella Foundation, our members actively participate in initiatives that drive positive change in Accra and beyond.", delay: 300 },
                            ].map(({ icon, title, desc, delay }) => (
                                <AnimateOnScroll key={title} animation="scale-in" delay={delay}>
                                    <div className="pillar-card bg-white rounded-lg p-8 border border-gold-light/30 shadow-[0_4px_24px_rgba(30,58,95,0.08)] flex flex-col items-center text-center h-full">
                                        <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-6 border border-gold-muted/20">
                                            <span className="material-symbols-outlined text-gold-muted text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-navy-deep mb-4" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{desc}</p>
                                    </div>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </section>

                    {/* CTA Strip */}
                    <AnimateOnScroll animation="fade-up" className="w-full max-w-7xl mx-auto px-6 pb-24">
                        <div className="rounded-xl py-14 px-8 flex flex-col md:flex-row items-center justify-between gap-6"
                            style={{ background: "linear-gradient(130deg,#0a1428 0%,#1e3a5f 60%,#0a1428 100%)", border: "1px solid rgba(201,168,76,.25)", boxShadow: "0 24px 64px rgba(10,20,40,.25)" }}>
                            <div>
                                <h3 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Become Part of Our Legacy</h3>
                                <p className="text-white/70 text-sm max-w-md" style={{ fontFamily: "var(--font-inter)" }}>An invitation to a world curated for the few who appreciate the finest things in life.</p>
                            </div>
                            <Link href="/auth/register"
                                className="inline-flex items-center gap-2 px-8 py-3 text-navy-deep font-semibold text-sm tracking-widest uppercase rounded hover:-translate-y-0.5 transition-transform"
                                style={{ background: "linear-gradient(90deg,#c9a84c,#e8c96f,#c9a84c)", fontFamily: "var(--font-inter)" }}>
                                Apply for Membership
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </Link>
                        </div>
                    </AnimateOnScroll>
                </main>

                {/* ── Footer ── */}
                <footer className="bg-navy-deep w-full py-12 border-t border-gold-muted/30 flex flex-col items-center justify-center text-center space-y-6 px-6 mt-auto">
                    <div className="text-xl font-semibold gold-shimmer mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        Estrella del Mar
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mb-6">
                        {["Privacy Policy", "Terms of Service", "Press Inquiry", "Careers"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-xs font-semibold tracking-widest uppercase text-gold-muted/80 hover:text-gold-light transition-colors hover:underline decoration-gold-muted/50"
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold-muted/30 to-transparent" />
                    <p className="text-sm text-gold-muted/60" style={{ fontFamily: "var(--font-inter)" }}>
                        © 2024 Estrella del Mar. All rights reserved. Laboma Beach, Accra.
                    </p>
                </footer>

            </div>
        </>
    );
}
