import React from 'react';
import Link from 'next/link';
import SharedNavbar from '@/components/SharedNavbar';
import OtherLounges from '@/components/OtherLounges';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sunset Bar | Estrella del Mar',
    description: 'Experience panoramic city views under a glass-canopied rooftop at the Sunset Bar.',
};

export default function SunsetBarPage() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up-1 {
            opacity: 0;
            animation: fadeInUp 1s ease-out 0.2s forwards;
        }
        .animate-fade-in-up-2 {
            opacity: 0;
            animation: fadeInUp 1s ease-out 0.4s forwards;
        }
        .animate-fade-in-up-3 {
            opacity: 0;
            animation: fadeInUp 1s ease-out 0.6s forwards;
        }
        .animate-fade-in-up-4 {
            opacity: 0;
            animation: fadeInUp 1s ease-out 0.8s forwards;
        }
      `}} />

            <main className="[perspective:1px] h-screen overflow-x-hidden overflow-y-auto bg-[#2a162b] text-white m-0 p-0 font-sans">
                <SharedNavbar />
                {/* Background Parallax Layer */}
                <div className="absolute inset-0 [transform:translateZ(-1px)_scale(2)] -z-10 w-full h-full">
                    {/* Background Media Container (Video/Image) */}
                    <div className="w-full h-full absolute inset-0 opacity-60 bg-black">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="https://res.cloudinary.com/dqwub0fhb/video/upload/v1789927472/SunsetBarVideo_wtmj1l.mp4" type="video/mp4" />
                        </video>
                    </div>
                    {/* Atmospheric Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a162b] via-[#2a162b]/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Foreground Content Layer - Hero Section */}
                <div className="relative min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10">
                    <div className="max-w-4xl flex flex-col items-center text-center mt-20">
                        {/* Eyebrow */}
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in-up-1 justify-center">
                            <span className="w-8 h-px bg-[#F1E0A6]"></span>
                            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                Glass-Canopied Rooftop
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg animate-fade-in-up-2">
                            Sunset <br />
                            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-4">Bar</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-fade-in-up-3 leading-relaxed text-center">
                            A breathtaking rooftop sanctuary offering panoramic city views at dusk. Under an elegant glass canopy, relax on bespoke rattan furnishings while savoring crafted cocktails and a mesmerizing twilight ambiance.
                        </p>

                        {/* Etiquette & Action Glass Panel */}
                        <div className="bg-[#2a162b]/70 backdrop-blur-md border border-[#F1E0A6]/15 rounded-xl p-8 max-w-xl animate-fade-in-up-4 mx-auto">
                            <div className="flex items-start space-x-4 mb-8 text-left">
                                <span className="material-symbols-outlined text-[#F1E0A6] text-2xl mt-1">celebration</span>
                                <div>
                                    <h3 className="font-serif text-2xl text-[#F1E0A6] mb-2">The Vibe & Attire</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        Embrace the golden hour in our vibrant, yet relaxed atmosphere. Smart casual attire is recommended. Join us as the city lights up and the evening unfolds with live DJ sets and signature drinks.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/booking/customer/create?venue=sunset_bar"
                                className="bg-[#2a162b] text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6] hover:text-[#2a162b] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.2)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full w-full flex items-center justify-center space-x-2 group"
                            >
                                <span>Reserve a Table</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Section 2: The Experience */}
                <div className="relative py-24 bg-[#1a0c1a] flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]"></span>
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Unforgettable Evenings
                                </span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">
                                Crafted Under the <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Stars</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Our Sunset Bar is designed to capture the magic of the transition from day to night. Featuring a stunning glass roof and expansive city views, it's the perfect backdrop for our innovative cocktail menu and modern tapas.
                            </p>
                            <ul className="space-y-6 pt-4">
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">local_bar</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Signature Mixology</h4>
                                        <p className="text-sm text-white/60">Botanical infusions and crafted cocktails inspired by the vibrant city.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">chair_alt</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Luxurious Comfort</h4>
                                        <p className="text-sm text-white/60">Relax in our custom rattan furnishings and marble-accented spaces.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">nightlife</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Vibrant Atmosphere</h4>
                                        <p className="text-sm text-white/60">Ambient lighting and curated DJ sets that elevate the evening energy.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927332/SunsetBar1_yuqcpe.png"
                                alt="Sunset Bar ambiance"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0c1a] via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-center lg:text-left">
                                <p className="text-[#F1E0A6] font-serif text-2xl italic">"Where the city meets the sky."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Visual Showcase */}
                <div className="relative py-24 bg-[#2a162b] flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <h2 className="font-serif text-4xl text-white mb-4">A Glimpse of Sunset Bar</h2>
                            <p className="text-white/70 max-w-2xl">Immerse yourself in the breathtaking views and stylish decor that define our rooftop experience.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-[400px] rounded-xl overflow-hidden border border-[#F1E0A6]/10 shadow-lg">
                                <img src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927333/SunsetBar2_bgk0fk.png" alt="Sunset Bar Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="h-[400px] rounded-xl overflow-hidden border border-[#F1E0A6]/10 shadow-lg">
                                <img src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1789927332/SunsetBar3_hmuhvc.png" alt="Sunset Bar View" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <OtherLounges currentRoute="/sunset-bar" />
            </main>
        </>
    );
}
