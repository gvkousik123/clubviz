import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    variant?: 'default' | 'card';
    fullHeight?: boolean;
    withGradient?: boolean;
}

export function AuthLayout({
    children,
    variant = 'default',
    fullHeight = true,
    withGradient = true
}: AuthLayoutProps) {
    return (
        <div
            className={`relative flex flex-col items-center justify-center w-full ${fullHeight ? 'h-screen max-h-screen' : ''} py-6 bg-[#0a0a0a] overflow-hidden`}
        >
            {/* Background gradient/overlay */}
            {withGradient && (
                <>
                    {/* Dark background base with enhanced gradient */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />

                    {/* Main teal gradient overlay */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(20,184,166,0.25) 35%, rgba(14,116,144,0.2) 70%, rgba(0,0,0,0.8) 100%)',
                        }}
                    />

                    {/* Central glow effect - enhanced */}
                    <div
                        className="absolute z-0 rounded-full opacity-35"
                        style={{
                            width: '90%',
                            height: '80%',
                            top: '10%',
                            left: '5%',
                            background: 'radial-gradient(ellipse, rgba(20,184,166,0.4) 0%, rgba(6,182,212,0.3) 30%, rgba(14,116,144,0.1) 60%, rgba(0,0,0,0) 100%)',
                            filter: 'blur(80px)',
                        }}
                    />

                    {/* Secondary teal accent */}
                    <div
                        className="absolute z-0 rounded-full opacity-25"
                        style={{
                            width: '40%',
                            height: '30%',
                            top: '30%',
                            left: '60%',
                            background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(6,182,212,0.2) 50%, rgba(0,0,0,0) 100%)',
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Bottom glow effect - enhanced */}
                    <div
                        className="absolute bottom-0 left-0 right-0 z-0 h-[30vh]"
                        style={{
                            background: 'linear-gradient(to top, rgba(20,184,166,0.2) 0%, rgba(6,182,212,0.1) 50%, rgba(0,0,0,0) 100%)',
                        }}
                    />
                </>
            )}

            {/* Content */}
            <div className={`relative z-10 w-full ${variant === 'card' ? 'max-w-md bg-background-glass backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg' : 'max-w-none'}`}>
                {children}
            </div>
        </div>
    );
}