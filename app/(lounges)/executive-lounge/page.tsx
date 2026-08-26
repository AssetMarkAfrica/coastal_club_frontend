import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Executive Lounge | Estrella del Mar',
    description: 'Ascend to the pinnacle of discretion and refinement in the Executive Lounge.',
};

export default function ExecutiveLoungePage() {
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

            <main className="[perspective:1px] h-screen overflow-x-hidden overflow-y-auto bg-[#10243F] text-white m-0 p-0 font-sans">
                {/* Background Parallax Layer */}
                <div className="absolute inset-0 [transform:translateZ(-1px)_scale(2)] -z-10 w-full h-full">
                    {/* Background Media Container (Video/Image) */}
                    <div className="w-full h-full absolute inset-0 opacity-60 bg-black">
                        {/* 
              Background Video Integration.
              The user mentioned they will add a video here to create a spectacular ambience.
              Added autoPlay, loop, muted, and playsInline for seamless background playback.
            */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            {/* Replace the src with the actual background video file path */}
                            <source src="/videos/executive-lounge-bg.mp4" type="video/mp4" />
                        </video>
                    </div>
                    {/* Atmospheric Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[#10243F]/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Foreground Content Layer - Hero Section */}
                <div className="relative min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10">
                    <div className="max-w-4xl flex flex-col items-center text-center mt-20">
                        {/* Eyebrow */}
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in-up-1 justify-center">
                            <span className="w-8 h-px bg-[#F1E0A6]"></span>
                            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                A Private Sanctum
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg animate-fade-in-up-2">
                            The Executive <br />
                            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-4">Lounge</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-fade-in-up-3 leading-relaxed text-center">
                            Ascend to the pinnacle of discretion and refinement. Here, panoramic skyline views frame intimate
                            conversations amidst plush velvet and amber light. Access is strictly reserved for our most
                            distinguished members.
                        </p>

                        {/* Etiquette & Action Glass Panel */}
                        <div className="bg-[#10243F]/70 backdrop-blur-md border border-[#F1E0A6]/15 rounded-xl p-8 max-w-xl animate-fade-in-up-4 mx-auto">
                            <div className="flex items-start space-x-4 mb-8 text-left">
                                <span className="material-symbols-outlined text-[#F1E0A6] text-2xl mt-1">checkroom</span>
                                <div>
                                    <h3 className="font-serif text-2xl text-[#F1E0A6] mb-2">Etiquette & Attire</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        To maintain the atmosphere of the lounge, an evening elegant dress code is strictly
                                        enforced. Gentlemen are required to wear a jacket; athletic wear and informal footwear
                                        are not permitted. Discretion and privacy are our highest priorities.
                                    </p>
                                </div>
                            </div>
                            <button className="bg-[#10243F] text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6] hover:text-[#10243F] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.2)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full w-full flex items-center justify-center space-x-2 group">
                                <span>Enquire for Access</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Foreground Decorative Element (Parallax Depth) */}
                    <div className="absolute bottom-0 right-10 w-64 h-64 pointer-events-none hidden lg:block opacity-80"
                        style={{ transform: 'translateZ(0.5px) scale(0.5)', transformOrigin: 'bottom right' }}>
                        <img className="w-full h-full object-contain"
                            alt="Luxury glass"
                            src="https://images.unsplash.com/photo-1575037614876-c38eb312e9e2?q=80&w=1170&auto=format&fit=crop"
                        />
                    </div>
                </div>

                {/* Section 2: The Experience */}
                <div className="relative py-24 bg-[#10243F] flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-px bg-[#F1E0A6]"></span>
                                <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
                                    Curated Excellence
                                </span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">
                                A Symphony of <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">Flavors</span>
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Our master mixologists craft bespoke cocktails using rare, globally sourced spirits, while our culinary artisans present a rotating selection of exquisite small plates designed to perfectly complement your evening. Every detail is meticulously curated to delight the senses.
                            </p>
                            <ul className="space-y-6 pt-4">
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">liquor</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Rare & Vintage Spirits</h4>
                                        <p className="text-sm text-white/60">An unparalleled collection of limited-edition scotches and cognacs.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">restaurant</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Artisanal Tapas</h4>
                                        <p className="text-sm text-white/60">Gourmet caviar service and hand-crafted small plates.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4 text-white/80">
                                    <span className="material-symbols-outlined text-[#F1E0A6] text-3xl">piano</span>
                                    <div>
                                        <h4 className="text-[#F1E0A6] font-serif text-xl mb-1">Live Acoustics</h4>
                                        <p className="text-sm text-white/60">Soulful jazz and acoustic performances setting the perfect tone.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-[#F1E0A6]/15 group order-1 lg:order-2 shadow-2xl shadow-black/50">
                            <img
                                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                                alt="Craft cocktails being prepared"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-center lg:text-left">
                                <p className="text-[#F1E0A6] font-serif text-2xl italic">"The art of mixology, perfected."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Membership & Access */}
                <div className="relative py-32 bg-[#0a1628] flex flex-col justify-center items-center p-6 sm:p-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10">
                    <div className="max-w-3xl text-center space-y-10">
                        <span className="material-symbols-outlined text-[#F1E0A6] text-5xl">diamond</span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white">
                            Exclusive <span className="text-[#F1E0A6] italic pr-2">Privileges</span>
                        </h2>
                        <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
                            The Executive Lounge operates on a strict members-only basis. Membership provides priority reservations, access to private tasting events, and dedicated concierge services tailored to your exact preferences.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/membership" className="bg-[#F1E0A6] text-[#10243F] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(241,224,166,0.3)] text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto">
                                <span>Explore Memberships</span>
                            </Link>
                            <Link href="/contact" className="bg-transparent text-[#F1E0A6] border border-[#F1E0A6] transition-all duration-300 hover:bg-[#F1E0A6]/10 hover:-translate-y-0.5 text-[13px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto">
                                <span>Contact Concierge</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
