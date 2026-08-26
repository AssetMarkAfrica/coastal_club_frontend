import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

// ─────────────────────────────────────────────────────────────────────────────
//  BACKGROUND VIDEO — Cloudinary (or any CDN)
//  Paste your Cloudinary URL here to enable video on the hero.
//  e.g. "https://res.cloudinary.com/your-cloud/video/upload/v000/private-room-bg.mp4"
//  Leave blank to use the dark fallback image.
// ─────────────────────────────────────────────────────────────────────────────
const BG_VIDEO_URL = "https://res.cloudinary.com/dqwub0fhb/video/upload/v1787758127/PrivateRoomVideo_ex7xik.mp4";

export const metadata: Metadata = {
    title: 'The Private Room | Estrella del Mar',
    description: 'An exclusive private space at Estrella del Mar — available for corporate gatherings, intimate celebrations, and milestone events. Fully bespoke, completely yours.',
};

const meetingFeatures = [
    { icon: 'cast', label: 'Presentation Display', sub: '85" 4K screen with wireless casting' },
    { icon: 'wifi', label: 'Private Network', sub: 'Dedicated high-speed fibre connection' },
    { icon: 'mic', label: 'Conference Audio', sub: 'Boardroom-grade microphone and speaker array' },
    { icon: 'inventory', label: 'Stationery & Materials', sub: 'Whiteboards, notepads, and branded essentials' },
    { icon: 'restaurant', label: 'Executive Catering', sub: 'Custom menus designed around your session' },
    { icon: 'lock', label: 'Complete Privacy', sub: 'Soundproofed walls — no interruptions, ever' },
];

const celebrationFeatures = [
    { icon: 'celebration', label: 'Custom Décor & Florals', sub: 'Styled to your theme, colour, and occasion' },
    { icon: 'cake', label: 'Bespoke Celebration Cakes', sub: 'Crafted in-house by our pâtissier' },
    { icon: 'local_bar', label: 'Curated Drinks Packages', sub: 'Champagne towers, cocktail menus, open bar options' },
    { icon: 'photo_camera', label: 'Photography Ready', sub: 'Ambient lighting optimised for stunning photos' },
    { icon: 'playlist_play', label: 'Custom Playlist or DJ', sub: 'Your soundtrack, from our curated artists or yours' },
    { icon: 'group', label: 'Dedicated Events Host', sub: 'A private host manages every moment of your evening' },
];

const capacityOptions = [
    { config: 'Boardroom', count: 'Up to 14', icon: 'table_restaurant', desc: 'Formal meeting setup with the full table arrangement' },
    { config: 'Cocktail Party', count: 'Up to 35', icon: 'local_bar', desc: 'Standing, mingling — the room at its most social' },
    { config: 'Seated Dinner', count: 'Up to 22', icon: 'restaurant', desc: 'Intimate round-table dining with full service' },
    { config: 'Theatre Style', count: 'Up to 30', icon: 'event_seat', desc: 'Presentations, screenings, or keynote moments' },
];

export default function PrivateRoomPage() {
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

                .pr-feature-card {
                    border: 1px solid rgba(241,224,166,0.08);
                    transition: border-color .4s, background .4s, transform .35s;
                }
                .pr-feature-card:hover {
                    border-color: rgba(241,224,166,0.22);
                    background: rgba(241,224,166,0.04);
                    transform: translateY(-3px);
                }

                .pr-capacity-row {
                    border-bottom: 1px solid rgba(241,224,166,0.08);
                    transition: background .25s;
                }
                .pr-capacity-row:hover {
                    background: rgba(241,224,166,0.04);
                }
                .pr-capacity-row:hover .pr-capacity-name {
                    color: #F1E0A6;
                }
                .pr-capacity-name { transition: color .4s; }
                `
            }} />

            <main className="[perspective:1px] h-screen overflow-x-hidden overflow-y-auto bg-[#10243F] text-white m-0 p-0 font-sans">

                {/* ── HERO BACKGROUND ── */}
                <div className="absolute inset-0 [transform:translateZ(-1px)_scale(2)] -z-10 w-full h-full">
                    <div className="w-full h-full absolute inset-0 opacity-55 bg-black">
                        {BG_VIDEO_URL ? (
                            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                <source src={BG_VIDEO_URL} type="video/mp4" />
                            </video>
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=2073&auto=format&fit=crop')" }}
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/75 to-transparent pointer-events-none" />
                </div>

                {/* ── HERO CONTENT ── */}
                <div className="relative min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10">
                    <div className="max-w-4xl flex flex-col items-center text-center mt-20">

                        {/* Eyebrow */}
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in-up-1 justify-center">
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                Estrella del Mar · Exclusive Hire
                            </span>
                            <span className="w-8 h-px bg-[#F1E0A6]" />
                        </div>

                        {/* Title */}
                        <h1
                            className="text-white mb-6 drop-shadow-lg animate-fade-in-up-2 leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3.2rem, 9vw, 7rem)' }}
                        >
                            The Private<br />
                            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-4">
                                Room
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-fade-in-up-3 leading-relaxed text-center">
                            A fully private, entirely configurable space within Estrella del Mar. Whether you are hosting
                            a boardroom session, celebrating a milestone, or marking an occasion that deserves more than
                            ordinary — this room is yours.
                        </p>

                        {/* Glass panel */}
                        <div className="bg-[#10243F]/70 backdrop-blur-md border border-[#F1E0A6]/15 rounded-xl p-8 max-w-xl animate-fade-in-up-4 mx-auto w-full">
                            <div className="flex items-start space-x-4 mb-8 text-left">
                                <span className="material-symbols-outlined text-[#F1E0A6] text-2xl mt-1 shrink-0">key</span>
                                <div>
                                    <h3 className="font-serif text-2xl text-[#F1E0A6] mb-2">Full Exclusive Hire</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        The Private Room is reserved exclusively for your event. No shared spaces, no interruptions.
                                        A dedicated host, full catering and bar service, and complete privacy from arrival to farewell.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/booking"
                                className="bg-[#10243F] text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6] hover:text-[#10243F] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.2)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full w-full flex items-center justify-center space-x-2 group"
                            >
                                <span>Enquire & Book</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 2: CORPORATE MEETINGS ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image */}
                        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png"
                                alt="Private meeting room setup"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F]/70 via-transparent to-transparent opacity-50 pointer-events-none" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[#F1E0A6] font-serif text-xl italic">"Where important decisions find the right setting."</p>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-8 order-2">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Corporate & Meetings
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Built for <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Decisions</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                A refined environment for executive sessions, client presentations, strategy days, and
                                confidential discussions. Every amenity is in place — you simply arrive and lead.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {meetingFeatures.map((f) => (
                                    <div key={f.label} className="pr-feature-card rounded-xl p-5 bg-[#0a1a2e]/50">
                                        <span className="material-symbols-outlined text-[#F1E0A6] text-xl mb-3 block">{f.icon}</span>
                                        <p className="text-white text-sm font-semibold mb-1">{f.label}</p>
                                        <p className="text-white/50 text-xs leading-relaxed">{f.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 3: CELEBRATIONS ── */}
                <div className="relative py-24 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Text */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]" />
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Private Celebrations
                                </span>
                            </div>
                            <h2
                                className="text-white leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
                            >
                                Made for <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Moments</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Birthday dinners, anniversary evenings, proposal settings, graduation celebrations —
                                every milestone deserves a room that rises to the occasion. We handle every detail so
                                you simply enjoy the moment.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {celebrationFeatures.map((f) => (
                                    <div key={f.label} className="pr-feature-card rounded-xl p-5 bg-[#10243F]/50">
                                        <span className="material-symbols-outlined text-[#F1E0A6] text-xl mb-3 block">{f.icon}</span>
                                        <p className="text-white text-sm font-semibold mb-1">{f.label}</p>
                                        <p className="text-white/50 text-xs leading-relaxed">{f.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-[580px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758506/PrivateRoom2_gcowvn.png"
                                alt="Elegant private celebration setup"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95 contrast-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-transparent opacity-50 pointer-events-none" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[#F1E0A6] font-serif text-xl italic">"Your evening. Perfectly arranged."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CINEMATIC FEATURE BANNER ── */}
                <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden border-t border-b border-[#F1E0A6]/10 [transform:translateZ(0)] z-10" aria-hidden="true">
                    <img
                        src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758506/PrivateRoom3_cvokpc.png"
                        alt="Private Room ambiance"
                        className="w-full h-full object-cover brightness-95 contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/40 to-[#10243F]/20 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                        <blockquote className="max-w-2xl">
                            <p className="text-[#F1E0A6] font-serif text-2xl md:text-4xl italic drop-shadow-lg">
                                &ldquo;An intimate space designed for moments that demand perfection.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </section>

                {/* ── SECTION 4: CAPACITY CONFIGURATIONS ── */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-5xl w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
                            <div>
                                <div className="flex items-center space-x-3 mb-6">
                                    <span className="w-8 h-px bg-[#F1E0A6]" />
                                    <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                        Configurations
                                    </span>
                                </div>
                                <h2
                                    className="text-white leading-tight"
                                    style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
                                >
                                    One Room, <span className="italic text-[#F1E0A6]">Every Setting</span>
                                </h2>
                            </div>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 pb-1">
                                Custom layouts available on request
                            </p>
                        </div>

                        {/* Capacity table */}
                        <div className="border-t border-[#F1E0A6]/10">
                            {capacityOptions.map((opt) => (
                                <div key={opt.config} className="pr-capacity-row grid grid-cols-1 md:grid-cols-[56px_180px_100px_1fr] gap-4 md:gap-6 items-center py-7 px-2">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-2xl">{opt.icon}</span>
                                    <span
                                        className="pr-capacity-name text-xl text-white"
                                        style={{ fontFamily: 'var(--font-playfair)' }}
                                    >
                                        {opt.config}
                                    </span>
                                    <span className="text-[#B7922B] text-sm font-semibold tracking-wide">{opt.count}</span>
                                    <span className="text-white/50 text-sm leading-relaxed">{opt.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SECTION 5: CTA ── */}
                <div className="relative py-32 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    {/* Ambient glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7922B]/8 blur-[140px] rounded-full pointer-events-none" />

                    <div className="max-w-3xl text-center space-y-10 relative z-10">
                        <span className="material-symbols-outlined text-[#F1E0A6] text-5xl">meeting_room</span>
                        <h2
                            className="text-white leading-tight"
                            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                        >
                            Make it <span className="italic text-[#F1E0A6] pr-2">Yours</span>
                        </h2>
                        <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                            Tell us the occasion, the date, and the number of guests — and we will take care of
                            everything else. Our events team will reach out within 24 hours to begin planning.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="/booking"
                                className="bg-[#F1E0A6] text-[#10243F] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.3)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <span>Submit an Enquiry</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6]/10 hover:-translate-y-0.5 text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <span>Speak to Events Team</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}
