"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Event } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type EventListCardProps = {
    event: Event;
    href: string;
    fallbackImage: string;
    formattedDate: { day: string; month: string };
    isFavorite: boolean;
    onToggleFavorite: (eventId: string) => void;
    className?: string;
};

export function EventListCard({
    event,
    href,
    fallbackImage,
    formattedDate,
    isFavorite,
    onToggleFavorite,
    className
}: EventListCardProps) {
    const rawImages = (event as any)?.images;
    const rawLocationText = (event as any)?.locationText;
    const rawImageUrl = (event as any)?.imageUrl;
    const rawImage = (event as any)?.image;

    const primaryGenre = useMemo(() => {
        if (event.musicGenres && event.musicGenres.length > 0) {
            return event.musicGenres.slice(0, 2).join(" & ");
        }
        if (event.tags && event.tags.length > 0) {
            return event.tags.slice(0, 2).join(" · ");
        }
        return "Club Experience";
    }, [event.musicGenres, event.tags]);

    const locationLabel = useMemo(() => {
        const parts: string[] = [];
        if (event.club?.name) parts.push(event.club.name);
        const clubCity = rawLocationText?.city ?? event.club?.city;
        if (clubCity) parts.push(clubCity);
        if (parts.length === 0 && typeof event.location === 'string' && event.location.length > 0) {
            parts.push(event.location);
        }
        if (parts.length === 0 && rawLocationText?.address1) {
            parts.push(rawLocationText.address1);
        }
        return parts.length > 0 ? parts.join(", ") : "Venue to be announced";
    }, [event.club?.name, event.club?.city, event.location, rawLocationText]);

    const imageSrc = useMemo(() => {
        if (typeof event.coverImage === 'string' && event.coverImage.length > 0) {
            return event.coverImage;
        }
        if (Array.isArray(rawImages) && rawImages.length > 0) {
            const first = rawImages[0];
            if (typeof first === 'string') {
                return first;
            }
            if (first?.url) {
                return first.url;
            }
        }
        if (typeof rawImageUrl === 'string' && rawImageUrl.length > 0) {
            return rawImageUrl;
        }
        if (typeof rawImage === 'string' && rawImage.length > 0) {
            return rawImage;
        }
        return fallbackImage;
    }, [event.coverImage, rawImages, rawImageUrl, rawImage, fallbackImage]);

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(event.id);
    };

    return (
        <Link href={`/event/${event.id}`} className={cn("group block flex-shrink-0 cursor-pointer", className)}>
            <div className="w-[222px] h-[305px] relative rounded-[20px] overflow-hidden" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                {/* Image */}
                <div className="relative">
                    <img
                        src={imageSrc}
                        alt={event.title}
                        data-fullscreen="true"
                        className="w-full h-[180px] object-cover"
                        style={{
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: '#28D2DB',
                            borderBottomRightRadius: '0',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            borderBottomLeftRadius: '20px',
                        }}
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== fallbackImage) {
                                target.src = fallbackImage;
                            }
                        }}
                    />
                </div>

                {/* Date Badge - positioned on the right */}
                <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                    <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">
                        {formattedDate.month}<br />{formattedDate.day}
                    </div>
                </div>

                {/* Content - positioned in the dark area below image */}
                <div className="absolute left-[18px] right-[18px] top-[188px] flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-[#E6E6E6] text-lg font-bold font-['Manrope'] leading-[22px] tracking-[0.16px] break-words mb-1 line-clamp-2">
                            {event.title}
                        </h3>
                        <p className="text-[#C3C3C3] text-xs font-bold font-['Manrope'] leading-[15px] tracking-[0.12px] break-words truncate">
                            {locationLabel}
                        </p>
                    </div>
                    {/* Heart Icon - positioned to the right of text and centered vertically */}
                    <div className="flex items-center justify-center w-[23px] h-[21px] flex-shrink-0 ml-2">
                        <button
                            type="button"
                            onClick={handleFavorite}
                            className="transition-all duration-300 hover:scale-110"
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart
                                className={cn(
                                    "w-7 h-7",
                                    isFavorite ? "fill-[#28D2DB] text-[#28D2DB]" : "text-[#28D2DB]"
                                )}
                            />
                        </button>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="w-[222px] h-[34px] left-0 top-[270px] absolute rounded-b-[20px] border-t border-[#0FD8E2] overflow-hidden flex items-center justify-center" style={{ background: 'radial-gradient(ellipse 148.20% 1115.41% at 50.00% 50.00%, #005F57 0%, #14FFEC 100%)' }}>
                    <div className="text-white text-[14px] font-bold font-['Manrope'] leading-[17px] text-center truncate px-2">
                        {primaryGenre}
                    </div>
                </div>
            </div>
        </Link>
    );
}