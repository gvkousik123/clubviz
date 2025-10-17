import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'icon' | 'full';
}

export function ClubVizLogo({ size = 'md', variant = 'full' }: LogoProps) {
    // Size classes for logo icon (slightly reduced)
    const logoSizes = {
        sm: { width: 80, height: 80 },
        md: { width: 120, height: 120 },
        lg: { width: 150, height: 150 },
    };

    // Size classes for text logo (significantly reduced)
    const textSizes = {
        sm: { width: 190, fontSize: 'text-2xl' },
        md: { width: 240, fontSize: 'text-3xl' },
        lg: { width: 300, fontSize: 'text-4xl' },
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
                        width={textSizes[size].width}
                        height={size === 'lg' ? 70 : size === 'md' ? 56 : 44}
                        className="object-contain"
                        priority={true}
                    />
                </div>
            )}
        </div>
    );
}