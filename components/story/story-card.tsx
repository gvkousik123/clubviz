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

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link
            href={`/story/${id}?index=${index}`}
            className="block relative w-20 h-20 md:w-24 md:h-24"
            onClick={handleClick}
        >
            {/* Story Ring */}
            <div className={`absolute inset-0 rounded-full p-0.5 ${isViewed
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-primary-500 via-cyan-500 to-purple-500'
                }`}>
                <div className="w-full h-full bg-background-primary rounded-full p-0.5">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                        {/* Loading placeholder */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 animate-pulse" />
                        )}

                        {/* Story Image */}
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 80px, 96px"
                        />

                        {/* Overlay for better text visibility */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Live indicator (optional) */}
                        {!isViewed && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm" />
                        )}
                    </div>
                </div>
            </div>

            {/* Story Title */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-xs text-text-secondary font-medium truncate max-w-20">
                    {clubName || title}
                </p>
            </div>
        </Link>
    );
}