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
            className={`relative flex flex-col items-center justify-center w-full ${fullHeight ? 'min-h-screen' : ''} px-4 py-6 bg-[#0a0a0a] overflow-hidden`}
        >
            {/* Background gradient/overlay */}
            {withGradient && (
                <>
                    {/* Dark background base */}
                    <div className="absolute inset-0 z-0 bg-[#0a0a0a]" />

                    {/* Teal glow effect - positioned in center */}
                    <div
                        className="absolute z-0 rounded-full opacity-20"
                        style={{
                            width: '80%',
                            height: '70%',
                            top: '15%',
                            left: '10%',
                            background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, rgba(6,182,212,0.2) 30%, rgba(0,0,0,0) 70%)',
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Darker green/teal blurred shape for depth */}
                    <div
                        className="absolute z-0 rounded-full opacity-15"
                        style={{
                            width: '70%',
                            height: '60%',
                            top: '20%',
                            left: '15%',
                            background: 'radial-gradient(circle, rgba(14,116,144,0.2) 0%, rgba(15,118,110,0.1) 40%, rgba(0,0,0,0) 70%)',
                            filter: 'blur(50px)',
                        }}
                    />

                    {/* Bottom glow effect */}
                    <div
                        className="absolute bottom-0 left-0 right-0 z-0 h-[30vh]"
                        style={{
                            background: 'linear-gradient(to top, rgba(20,184,166,0.15) 0%, rgba(0,0,0,0) 100%)',
                        }}
                    />
                </>
            )}

            {/* Content */}
            <div className={`relative z-10 w-full max-w-md ${variant === 'card' ? 'bg-background-glass backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg' : ''}`}>
                {children}
            </div>

            {/* Bottom curve for splash screen */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                    <path
                        fill="#0f766e"
                        fillOpacity="0.2"
                        d="M0,128L60,112C120,96,240,64,360,80C480,96,600,160,720,176C840,192,960,160,1080,144C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}