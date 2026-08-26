"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
//  BACKGROUND MEDIA
// ─────────────────────────────────────────────────────────────────────────────
const BG_VIDEO_URL = "https://res.cloudinary.com/dqwub0fhb/video/upload/v1787758817/SkybarVideo_zarrv5.mp4";

export default function SkybarClient() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const heroBg = heroBgRef.current;
        if (!wrapper || !heroBg) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            heroBg.style.transform = `translate(${(x - 0.5) * 30}px, ${(y - 0.5) * 30}px) scale(1.08)`;
        };
        const handleMouseLeave = () => {
            heroBg.style.transform = `translate(0px, 0px) scale(1.05)`;
        };

        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            wrapper.removeEventListener('mousemove', handleMouseMove);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

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

                .sb-parallax-bg {
                    position: absolute;
                    top: -5%; left: -5%;
                    width: 110%; height: 110%;
                    transition: transform 0.1s ease-out;
                    will-change: transform;
                    transform: translate(0px, 0px) scale(1.05);
                }

                .sb-glass-card {
                    border: 1px solid rgba(241,224,166,0.12);
                    transition: border-color .4s, background .4s, transform .35s;
                }
                .sb-glass-card:hover {
                    border-color: rgba(241,224,166,0.28);
                    background: rgba(241,224,166,0.04);
                    transform: translateY(-4px);
                }
                `
            }} />

            <main className="[perspective:1px] h-screen overflow-x-hidden overflow-y-auto bg-[#10243F] text-white m-0 p-0 font-sans">

                {/* ── HERO BACKGROUND LAYER ── */}
                <section
                    ref={wrapperRef}
                    className="absolute inset-0 [transform:translateZ(-1px)_scale(2)] -z-10 w-full h-full overflow-hidden"
                    aria-hidden="true"
                >
                    <div className="w-full h-full absolute inset-0 opacity-60 bg-black">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src={BG_VIDEO_URL} type="video/mp4" />
                        </video>
                    </div>
                    {/* Atmospheric gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/75 to-transparent pointer-events-none" />
                </section>

                {/* ── HERO CONTENT ── */}
                <div className="relative min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10">
                    <div className="max-w-4xl flex flex-col items-center text-center mt-20">

                        {/* Eyebrow */}
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in-up-1 justify-center">
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                Estrella del Mar · Rooftop
                            </span>
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                        </div>

                        {/* Title */}
                        <h1
                            className="text-white mb-6 drop-shadow-lg animate-fade-in-up-2 leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}
                        >
                            The<br />
                            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-4">
                                Sky Bar
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-fade-in-up-3 leading-relaxed text-center">
                            Ascend to a vibrant rooftop oasis on the 54th floor. Where cocktail artistry meets panoramic
                            city views and every evening unfolds with elevated social energy — open to all.
                        </p>

                        {/* Info glass panel */}
                        <div className="bg-[#10243F]/70 backdrop-blur-md border border-[#F1E0A6]/15 rounded-xl p-8 max-w-xl animate-fade-in-up-4 mx-auto w-full">
                            <div className="flex items-start space-x-4 mb-8 text-left">
                                <span className="material-symbols-outlined text-[#F1E0A6] text-2xl mt-1 shrink-0">styler</span>
                                <div>
                                    <h3 className="font-serif text-2xl text-[#F1E0A6] mb-2">Dress Code & Hours</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        Elevated evening attire is welcomed. Smart casual styling is accepted to maintain our
                                        vibrant ambiance. Open Thursday to Sunday, 5 PM – 2 AM. Tables are bookable;
                                        walk-ins welcomed on availability.
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

                {/* ── SECTION 2: THE BAR EXPERIENCE (Skybar1) ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text column */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Cocktail Artistry
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Crafted at the <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Summit</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Our master mixologists craft bespoke cocktails using rare spirits, house-made infusions, and
                                innovative technique. Set against breathtaking open-air city views, every pour is a statement.
                            </p>
                            <ul className="space-y-6 pt-4">
                                <li className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl shrink-0">local_bar</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Signature Cocktails</h4>
                                        <p className="text-sm text-white/60">Seasonal creations built around rare spirits and house-made infusions.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl shrink-0">music_note</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Curated DJ Nights</h4>
                                        <p className="text-sm text-white/60">From deep house to jazz — programmed nightly to match the city's rhythm.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl shrink-0">restaurant</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Small Plates</h4>
                                        <p className="text-sm text-white/60">A rotating menu of elevated bar bites — designed to complement, not compete.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Image column: Skybar1 */}
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png"
                                alt="Sky Bar terrace ambiance"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[#F1E0A6] font-serif text-2xl italic">"Poured with intention. Served with purpose."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 3: EVENTS (Skybar2) ── */}
                <div className="relative py-24 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image column: Skybar2 */}
                        <div className="relative h-[560px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar2_wt66as.png"
                                alt="Sky Bar evening skyline"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                                style={{ objectPosition: '50% 40%' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>

                        {/* Events column */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    The Programme
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Nights Worth <span className="italic text-[#F1E0A6] pr-2">Ascending For</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Each night is programmed with intention. No two evenings are alike — from sunset
                                sessions to live jazz closing out the week.
                            </p>
                            <div className="space-y-4 pt-2">
                                {[
                                    { day: 'Thursday', icon: 'wb_twilight', title: 'Opening Night', desc: 'A quieter start — curated playlists, premium pours, and the city waking up below.' },
                                    { day: 'Friday', icon: 'celebration', title: 'Sunset Sessions', desc: 'Resident DJs spin deep house as the sky transitions from gold to indigo.' },
                                    { day: 'Saturday', icon: 'music_note', title: 'Sky Beats', desc: 'The city\'s most sought-after Saturday night. Live percussion meets electronic sets.' },
                                    { day: 'Sunday', icon: 'piano', title: 'Jazz Horizons', desc: 'A live quartet winds down the week with acoustic sophistication.' },
                                ].map(ev => (
                                    <div key={ev.day} className="flex items-start space-x-4 p-4 rounded-xl border border-[#F1E0A6]/08 hover:border-[#F1E0A6]/20 hover:bg-[#F1E0A6]/03 transition-all duration-300">
                                        <span className="material-symbols-outlined text-[#F1E0A6] text-xl mt-0.5 shrink-0">{ev.icon}</span>
                                        <div>
                                            <p className="text-[10px] tracking-[0.2em] uppercase text-[#B7922B] mb-1">{ev.day}</p>
                                            <h4 className="text-white font-serif text-lg mb-1">{ev.title}</h4>
                                            <p className="text-sm text-white/55 leading-relaxed">{ev.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CINEMATIC FULL-BLEED BANNER (Skybar3) ── */}
                <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden border-t border-b border-[#F1E0A6]/10 [transform:translateZ(0)] z-10" aria-hidden="true">
                    <img
                        src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar3_cudwrl.png"
                        alt="Sky Bar panoramic rooftop view"
                        className="w-full h-full object-cover brightness-95 contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/40 to-[#10243F]/20 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                        <blockquote className="max-w-2xl">
                            <p className="text-[#F1E0A6] font-serif text-2xl md:text-4xl italic drop-shadow-lg">
                                &ldquo;The city is your backdrop. The sky, your ceiling.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </section>

                {/* ── ATMOSPHERE SHOWCASE (Skybar4) ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Rooftop Social
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Elevated <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Atmosphere</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Surround yourself with panoramic views, glowing fire pits, and ambient golden lighting.
                                Whether celebrating a personal occasion or mingling under the stars, the Sky Bar is designed
                                for unforgettable moments.
                            </p>
                        </div>
                        <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar4_mfresm.png"
                                alt="Sky Bar social lounge"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* ── SECTION 4: RESERVE / CTA ── */}
                <div className="relative py-32 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-3xl text-center space-y-10">
                        <span className="material-symbols-outlined text-[#F1E0A6] text-5xl">roofing</span>
                        <h2
                            className="text-white leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                        >
                            Reserve Your <span className="italic text-[#F1E0A6] pr-2">Table</span>
                        </h2>
                        <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                            Secure your place at the city's highest social destination. Tables fill quickly on weekends —
                            our team will confirm your booking within the hour.
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
                                <span>Private Hire</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}
