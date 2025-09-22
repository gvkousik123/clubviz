"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLayout } from "@/components/auth/auth-layout";
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                {/* Logo */}
                <div className="mb-8">
                    <ClubVizLogo size="lg" variant="full" />
                </div>

                {/* Tagline with quotes */}
                <div className="text-center mt-8">
                    <div className="relative">
                        <span
                            className="absolute -top-6 -left-4 text-4xl text-teal-400 opacity-80"
                            style={{
                                textShadow: '0 0 15px rgba(20, 184, 166, 0.6)',
                                fontFamily: "'Poppins', sans-serif"
                            }}
                        >
                            "
                        </span>
                        <h2
                            className="text-center text-2xl tracking-[0.25em] font-light uppercase"
                            style={{
                                color: '#5eead4',
                                textShadow: '0 0 10px rgba(94, 234, 212, 0.4)',
                                fontFamily: "'Poppins', sans-serif"
                            }}
                        >
                            IGNITE
                            <br />
                            THE
                        </h2>
                        <span
                            className="absolute -bottom-8 -right-4 text-4xl text-teal-400 opacity-80"
                            style={{
                                textShadow: '0 0 15px rgba(20, 184, 166, 0.6)',
                                fontFamily: "'Poppins', sans-serif"
                            }}
                        >
                            "
                        </span>
                    </div>
                </div>
            </div>

            {/* Swipe up indicator */}
            <div className="absolute bottom-8 inset-x-0 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center animate-bounce">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-teal-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(20, 184, 166, 0.5))' }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}