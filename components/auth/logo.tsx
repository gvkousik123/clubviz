import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'icon' | 'full';
}

export function ClubVizLogo({ size = 'md', variant = 'full' }: LogoProps) {
    // Size classes for logo icon
    const logoSizes = {
        sm: { width: 60, height: 60 },
        md: { width: 80, height: 80 },
        lg: { width: 100, height: 100 },
    };

    return (
        <div className="flex flex-col items-center gap-4 relative z-50">
            {/* Logo Icon */}
            <div className="relative z-50">
                <Image
                    src="/logo/logo.png"
                    alt="ClubWiz Logo"
                    width={logoSizes[size].width}
                    height={logoSizes[size].height}
                    className="object-contain"
                    priority={true}
                    style={{
                        filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 30px rgba(0, 0, 0, 0.4))',
                    }}
                />
            </div>

            {/* ClubWiz text with enhanced neon effect */}
            {variant === 'full' && (
                <div className="relative z-50">
                    <Image
                        src="/logo/CLUBWIZ.png"
                        alt="CLUBWIZ"
                        width={size === 'lg' ? 300 : size === 'md' ? 240 : 190}
                        height={size === 'lg' ? 70 : size === 'md' ? 56 : 45}
                        className="object-contain"
                        priority={true}
                        style={{
                            filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 30px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 45px rgba(0, 0, 0, 0.3))',
                        }}
                    />
                    {/* Extra glow effect overlay */}
                    <div
                        className="absolute inset-0 -z-10"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%)',
                            filter: 'blur(20px)',
                        }}
                    />
                </div>
            )}
        </div>
    );
}