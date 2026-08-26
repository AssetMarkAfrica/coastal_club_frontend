import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
//  MEDIA ASSETS
// ─────────────────────────────────────────────────────────────────────────────
const BG_VIDEO_URL = "https://res.cloudinary.com/dqwub0fhb/video/upload/v1787759440/FineDiningVideo_a6wgj6.mp4";

const FINE_DINING_IMAGES = {
    philosophy: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining1_bmcrtp.png",
    dishes: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining2_mluv5r.png",
    banner: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining3_ulq0dx.png",
    wineCellar: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787761393/FineDining6_hwvzt2.png",
    atmosphere: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining5_dzbvnr.png",
};

export const metadata: Metadata = {
    title: 'The Dining Room | Fine Dining at Estrella del Mar',
    description: 'Experience haute cuisine and culinary mastery on the ground floor of Estrella del Mar. Bespoke tasting menus, 1,500+ cellar vintages, and uncompromised service.',
};

const signatureDishes = [
    {
        name: 'A5 Miyazaki Wagyu Striploin',
        origin: 'Japan',
        description: 'Seared over Japanese white oak, bone marrow reduction, shaved winter truffle, smoked salt.',
    },
    {
        name: 'Wild Chilean Sea Bass',
        origin: 'Southern Ocean',
        description: 'Pan-roasted with saffron dashi broth, baby leeks, sea asparagus, and oscietra caviar.',
    },
    {
        name: 'Heritage Duck Breast',
        origin: 'France',
        description: 'Dry-aged for 14 days, glazed in black cherry jus, parsnip silk, and charred endive.',
    },
    {
        name: 'Morel & Black Truffle Risotto',
        origin: 'Italy',
        description: 'Acquerello carnaroli rice, 36-month Parmigiano-Reggiano, hand-foraged mushrooms.',
    },
];

const wineHighlights = [
    { label: '1,500+ Vintages', desc: 'Curated by our Master Sommelier, featuring rare Grand Crus and allocations.' },
    { label: 'Coravin Selection', desc: 'Sample legendary vintages by the glass without compromising the bottle.' },
    { label: 'Cellar Tastings', desc: 'Private pre-dinner tasting sessions held inside our subterranean glass vault.' },
];

export default function FineDiningPage() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up-1 { opacity:0; animation: fadeInUp 1s ease-out 0.2s forwards; }
                .animate-fade-in-up-2 { opacity:0; animation: fadeInUp 1s ease-out 0.4s forwards; }
                .animate-fade-in-up-3 { opacity:0; animation: fadeInUp 1s ease-out 0.6s forwards; }
                .animate-fade-in-up-4 { opacity:0; animation: fadeInUp 1s ease-out 0.8s forwards; }

                .fd-card {
                    border: 1px solid rgba(241,224,166,0.08);
                    transition: border-color .4s, background .4s, transform .35s;
                }
                .fd-card:hover {
                    border-color: rgba(241,224,166,0.25);
                    background: rgba(241,224,166,0.04);
                    transform: translateY(-4px);
                }

                .fd-menu-row {
                    border-bottom: 1px solid rgba(241,224,166,0.08);
                    transition: background .25s;
                }
                .fd-menu-row:hover {
                    background: rgba(241,224,166,0.04);
                }
                .fd-menu-row:hover .fd-dish-name {
                    color: #F1E0A6;
                }
                .fd-dish-name { transition: color .4s; }
                `
            }} />

            <main className="[perspective:1px] h-screen overflow-x-hidden overflow-y-auto bg-[#10243F] text-white m-0 p-0 font-sans">

                {/* ── HERO BACKGROUND LAYER ── */}
                <div className="absolute inset-0 [transform:translateZ(-1px)_scale(2)] -z-10 w-full h-full overflow-hidden">
                    <div className="w-full h-full absolute inset-0 opacity-55 bg-black">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src={BG_VIDEO_URL} type="video/mp4" />
                        </video>
                    </div>
                    {/* Atmospheric gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/75 to-transparent pointer-events-none" />
                </div>

                {/* ── HERO CONTENT ── */}
                <div className="relative min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10">
                    <div className="max-w-4xl flex flex-col items-center text-center mt-20">

                        {/* Eyebrow */}
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in-up-1 justify-center">
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                Ground Floor · Culinary Excellence
                            </span>
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                        </div>

                        {/* Title */}
                        <h1
                            className="text-white mb-6 drop-shadow-lg animate-fade-in-up-2 leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3.2rem, 9vw, 7rem)' }}
                        >
                            The Dining<br />
                            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-4">
                                Room
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-fade-in-up-3 leading-relaxed text-center">
                            Where gastronomy meets artistry. On the ground floor of Estrella del Mar, our flagship restaurant
                            presents seasonal tasting menus, artisanal craftsmanship, and impeccable service.
                        </p>

                        {/* Glass panel */}
                        <div className="bg-[#10243F]/70 backdrop-blur-md border border-[#F1E0A6]/15 rounded-xl p-8 max-w-xl animate-fade-in-up-4 mx-auto w-full">
                            <div className="flex items-start space-x-4 mb-8 text-left">
                                <span className="material-symbols-outlined text-[#F1E0A6] text-2xl mt-1 shrink-0">restaurant</span>
                                <div>
                                    <h3 className="font-serif text-2xl text-[#F1E0A6] mb-2">Hours & Reservations</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        Dinner is served Tuesday through Sunday, 6 PM – 11 PM. Smart elegant dress code.
                                        Tasting menus and à la carte options available. Reservations highly recommended.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/booking"
                                className="bg-[#10243F] text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6] hover:text-[#10243F] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.2)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full w-full flex items-center justify-center space-x-2 group"
                            >
                                <span>Reserve a Table</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 2: CULINARY PHILOSOPHY (FineDining1) ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Gastronomic Vision
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Rooted in <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Excellence</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Under the direction of our Executive Culinary Team, every dish celebrates pure provenance.
                                We partner directly with artisan coastal fisheries, heritage livestock farms, and local foragers
                                to compose plates of striking depth and elegance.
                            </p>
                            <div className="space-y-4 pt-2">
                                <div className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl shrink-0 mt-0.5">menu_book</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">7-Course Chef’s Tasting</h4>
                                        <p className="text-sm text-white/60">A multi-sensory progression highlighting the season's finest ingredients.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl shrink-0 mt-0.5">wine_bar</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Sommelier Pairings</h4>
                                        <p className="text-sm text-white/60">Thoughtfully matched pours from rare allocations and organic vineyards.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl shrink-0 mt-0.5">eco</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Sustainable Sourcing</h4>
                                        <p className="text-sm text-white/60">Daily catches, hyper-seasonal produce, and zero-waste kitchen practices.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image: FineDining1 */}
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src={FINE_DINING_IMAGES.philosophy}
                                alt="Chef creating culinary masterpiece"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F]/80 via-transparent to-transparent opacity-50 pointer-events-none" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[#F1E0A6] font-serif text-xl italic">"Every plate tells the story of its origin."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 3: SIGNATURE DISHES (FineDining2) ── */}
                <div className="relative py-24 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image: FineDining2 */}
                        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 shadow-2xl shadow-black/50">
                            <img
                                src={FINE_DINING_IMAGES.dishes}
                                alt="Fine Dining signature dish"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent opacity-50 pointer-events-none" />
                        </div>

                        {/* Menu list */}
                        <div className="space-y-8 order-2">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Curated Selections
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Signature <span className="italic text-[#F1E0A6]">Creations</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Sample highlights from our current evening menu — harmonizing classic European technique
                                with vibrant coastal flavors.
                            </p>
                            <div className="space-y-4 pt-2">
                                {signatureDishes.map((dish) => (
                                    <div key={dish.name} className="fd-menu-row pb-4 pt-2">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="fd-dish-name text-white font-serif text-xl">{dish.name}</h4>
                                            <span className="text-[#B7922B] text-xs font-semibold uppercase tracking-wider">{dish.origin}</span>
                                        </div>
                                        <p className="text-white/55 text-sm leading-relaxed">{dish.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CINEMATIC FULL-BLEED BANNER (FineDining3) ── */}
                <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden border-t border-b border-[#F1E0A6]/10 [transform:translateZ(0)] z-10" aria-hidden="true">
                    <img
                        src={FINE_DINING_IMAGES.banner}
                        alt="The Dining Room main hall"
                        className="w-full h-full object-cover brightness-95 contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/40 to-[#10243F]/20 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                        <blockquote className="max-w-3xl">
                            <p className="text-[#F1E0A6] font-serif text-2xl md:text-4xl italic drop-shadow-lg">
                                &ldquo;A plate is a canvas. Gastronomy, our highest form of art.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </section>

                {/* ── SECTION 4: THE WINE CELLAR (FineDining4) ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    The Wine Vault
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                World-Class <span className="italic text-[#F1E0A6]">Cellar</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Housed in a temperature-controlled glass vault directly beneath the main dining hall,
                                our cellar represents decades of passionate collection from iconic estates and boutique producers.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                {wineHighlights.map((w) => (
                                    <div key={w.label} className="fd-card rounded-xl p-5 bg-[#0a1a2e]/50">
                                        <span className="material-symbols-outlined text-[#F1E0A6] text-xl mb-3 block">wine_bar</span>
                                        <p className="text-white text-sm font-semibold mb-1">{w.label}</p>
                                        <p className="text-white/50 text-xs leading-relaxed">{w.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image: FineDining4 */}
                        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src={FINE_DINING_IMAGES.wineCellar}
                                alt="Sommelier pouring wine"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F]/80 via-transparent to-transparent opacity-50 pointer-events-none" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[#F1E0A6] font-serif text-xl italic">"Curated to elevate every course."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 5: ATMOSPHERE & CHEF'S TABLE (FineDining5) ── */}
                <div className="relative py-24 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image: FineDining5 */}
                        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 shadow-2xl shadow-black/50">
                            <img
                                src={FINE_DINING_IMAGES.atmosphere}
                                alt="Main dining hall atmosphere"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent opacity-50 pointer-events-none" />
                        </div>

                        {/* Text */}
                        <div className="space-y-8 order-2">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    The Dining Experience
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                An Atmosphere of <span className="italic text-[#F1E0A6]">Grace</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                High ceilings, plush seating, and warm acoustic design create an intimate ambiance where
                                conversations linger long past the final dessert.
                            </p>
                            <div className="space-y-5 pt-2">
                                <div className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl shrink-0 mt-0.5">table_restaurant</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Chef’s Table</h4>
                                        <p className="text-sm text-white/60">An exclusive 8-seat counter facing the open kitchen for front-row culinary theater.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl shrink-0 mt-0.5">concierge</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Intuitive Service</h4>
                                        <p className="text-sm text-white/60">Attentive, refined, and synchronized to the natural cadence of your party.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 6: RESERVATION CTA ── */}
                <div className="relative py-32 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    {/* Ambient gold glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7922B]/8 blur-[140px] rounded-full pointer-events-none" />

                    <div className="max-w-3xl text-center space-y-10 relative z-10">
                        <span className="material-symbols-outlined text-[#F1E0A6] text-5xl">diamond</span>
                        <h2
                            className="text-white leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                        >
                            Reserve Your <span className="italic text-[#F1E0A6] pr-2">Journey</span>
                        </h2>
                        <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                            Join us on the ground floor of Estrella del Mar for an unforgettable evening of culinary mastery.
                            Advance reservations are recommended.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="/booking"
                                className="bg-[#F1E0A6] text-[#10243F] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.3)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <span>Book a Table</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6]/10 hover:-translate-y-0.5 text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <span>Private Dining Enquiry</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}
