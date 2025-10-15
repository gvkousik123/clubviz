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
                <div className="absolute inset-0 bg-[url('/intro%20bg.gif')] bg-cover bg-center opacity-70 scale-[1.08] blur-[10px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(94,234,212,0.45),rgba(3,19,19,0.3)_45%,rgba(3,19,19,0.85)_80%,rgba(3,19,19,0.95)_100%)] opacity-95"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#061b1b]/45 via-[#031313]/72 to-[#020808]"></div>

                {/* Central sphere glow */}
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[420px] h-[420px]">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.55)_0%,rgba(3,19,19,0.15)_48%,rgba(3,19,19,0.92)_100%)] blur-[40px] opacity-90"></div>
                    <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.3)_0%,rgba(3,19,19,0.75)_75%,rgba(3,19,19,0.95)_100%)] blur-[14px] opacity-70"></div>
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
            <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <div className="relative w-[220px] h-[110px]">
                    <div className="absolute inset-0 bottom-0 h-[110px] rounded-[180px] border border-teal-400/25 bg-gradient-to-t from-[#0a2b2f]/85 via-[#093a40]/55 to-transparent backdrop-blur-[4px]" style={{ boxShadow: '0 0 60px rgba(20,184,166,0.28)' }}></div>
                    <div className="absolute inset-0 flex translate-y-3 items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-teal-400/45 bg-[#0b2226]/85 shadow-[0_0_16px_rgba(20,184,166,0.4)] animate-bounce">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-teal-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ filter: 'drop-shadow(0 0 6px rgba(94,234,212,0.6))' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 14l7-7 7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}