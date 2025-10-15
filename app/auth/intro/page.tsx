"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IntroScreen() {
    const router = useRouter();

    // Auto-navigate to login after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/auth/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="relative h-screen overflow-hidden bg-[#031313] text-white">
            {/* Atmospheric background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/intro%20bg.gif')] bg-cover bg-center opacity-80 scale-110 blur-[8px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,234,212,0.28),rgba(3,19,19,0.6)_60%,rgba(3,19,19,0.95)_100%)]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#061b1b]/40 via-[#031313]/70 to-[#020808]"></div>

                {/* Halo stroke */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-12 w-[360px] h-[360px]">
                    <div className="absolute inset-0 rounded-full border border-teal-300/30 blur-[1px]" style={{ boxShadow: '0 0 80px rgba(20,184,166,0.35)' }}></div>
                    <div className="absolute inset-[18%] rounded-full border border-teal-400/20"></div>
                    <div className="absolute inset-[36%] rounded-full border border-teal-500/10"></div>
                </div>

                {/* Extra glows */}
                <div className="absolute -left-16 top-1/4 w-72 h-72 bg-teal-500/30 blur-[120px]"></div>
                <div className="absolute right-0 bottom-1/3 w-60 h-60 bg-cyan-500/20 blur-[100px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
                <div className="mb-8 drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
                    <ClubVizLogo size="lg" variant="full" />
                </div>

                <div className="mt-10 text-center">
                    <div className="relative inline-block px-10 py-6">
                        <span className="absolute -top-8 -left-3 text-5xl text-teal-100" style={{ textShadow: '0 0 18px rgba(94,234,212,0.55)' }}>
                            “
                        </span>
                        <h2
                            className="text-[34px] leading-[1.15] tracking-[0.28em] font-extralight uppercase text-teal-100"
                            style={{ textShadow: '0 0 18px rgba(94,234,212,0.45)' }}
                        >
                            IGNITE
                            <br />
                            THE
                        </h2>
                        <span className="absolute -bottom-10 -right-2 text-5xl text-teal-100" style={{ textShadow: '0 0 18px rgba(94,234,212,0.55)' }}>
                            ”
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom stroke & swipe indicator */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <div className="relative w-[320px] h-[170px]">
                    <div className="absolute inset-x-[-40px] bottom-[-100px] h-[260px] rounded-[300px] border border-teal-400/35 bg-gradient-to-t from-[#0a2b2f] via-[#093a40]/80 to-transparent backdrop-blur-[6px]" style={{ boxShadow: '0 0 120px rgba(20,184,166,0.35)' }}></div>
                    <div className="absolute inset-x-[-16px] bottom-[-30px] h-[160px] rounded-[160px] border border-teal-500/20"></div>
                    <div className="absolute inset-0 flex translate-y-6 items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/40 bg-[#0b2226]/80 shadow-[0_0_20px_rgba(20,184,166,0.45)] animate-bounce">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-teal-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ filter: 'drop-shadow(0 0 6px rgba(94,234,212,0.6))' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 14l7-7 7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}