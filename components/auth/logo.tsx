import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'icon' | 'full';
}

export function ClubVizLogo({ size = 'md', variant = 'full' }: LogoProps) {
    // Size classes for logo icon
    const logoSizes = {
        sm: { width: 75, height: 75 },
        md: { width: 100, height: 100 },
        lg: { width: 125, height: 125 },
    };

    // Size classes for text logo
    const textSizes = {
        sm: { width: 238, fontSize: 'text-3xl' },
        md: { width: 300, fontSize: 'text-4xl' },
        lg: { width: 375, fontSize: 'text-5xl' },
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
                />
            </div>

            {/* ClubWiz text with neon effect */}
            {variant === 'full' && (
                <div className="relative z-50 text-center mt-2">
                    <Image
                        src="/logo/CLUBWIZ.png"
                        alt="CLUBWIZ"
                        width={size === 'lg' ? 375 : size === 'md' ? 300 : 238}
                        height={size === 'lg' ? 87 : size === 'md' ? 70 : 56}
                        className="object-contain"
                        priority={true}
                    />
                </div>
            )}
        </div>
    );
}