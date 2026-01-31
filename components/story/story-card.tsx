'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StoryCardProps {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    clubName?: string;
    isViewed?: boolean;
    index?: number;
    onClick?: () => void;
}

export function StoryCard({
    id,
    image,
    title,
    timestamp,
    clubName,
    isViewed = false,
    index = 0,
    onClick
}: StoryCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleImageError = () => {
        console.error('Story image failed to load:', image);
        setImageError(true);
        setImageLoaded(true);
    };

    // Don't render if no image
    if (!image) {
        console.warn('Story card missing image:', id);
        return null;
    }

    // Render as div with onClick if onClick is provided, otherwise use Link
    const Container = onClick ? 'div' : Link;
    const containerProps = onClick
        ? { onClick: handleClick, className: "block relative w-20 cursor-pointer" }
        : { href: `/story/${id}?index=${index}`, onClick: handleClick, className: "block relative w-20" };

    return (
        <Container {...containerProps as any}>
            {/* Outer Cyan/Green Border */}
            <div className={`w-20 h-20 md:w-20 md:h-20 rounded-full p-[3.5px] ${isViewed
                ? 'bg-gray-300'
                : 'bg-[#14FFEC]'
                }`}>
                {/* White Border */}
                <div className="w-full h-full bg-white rounded-full p-[0.1px]">
                    {/* Dark Background Padding */}
                    <div className="w-full h-full bg-background-primary rounded-full p-[2px]">
                        {/* Image Container */}
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                            {/* Loading placeholder */}
                            {!imageLoaded && !imageError && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 animate-pulse" />
                            )}

                            {/* Error placeholder */}
                            {imageError && (
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                                    <span className="text-[10px] text-white/50">Error</span>
                                </div>
                            )}

                            {/* Story Image */}
                            {!imageError && (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={handleImageError}
                                    sizes="(max-width: 768px) 64px, 80px"
                                />
                            )}

                            {/* Overlay for better text visibility */}
                            <div className="absolute inset-0 bg-black/10" />

                            {/* Live indicator (optional) */}
                            {!isViewed && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Title */}
            <div className="mt-2 text-center w-full">
                <p className="text-xs text-text-secondary font-medium truncate px-1">
                    {clubName || title}
                </p>
            </div>
        </Container>
    );
}