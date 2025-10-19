"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Event } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type EventCardProps = {
    event: Event;
    href: string;
    fallbackImage: string;
    formattedDate: { day: string; month: string };
    isFavorite: boolean;
    onToggleFavorite: (eventId: string) => void;
    className?: string;
};

const CARD_CLIP_PATH = "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)";

export function EventCard({
    event,
    href,
    fallbackImage,
    formattedDate,
    isFavorite,
    onToggleFavorite,
    className
}: EventCardProps) {
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
    const capacityValue = typeof event.capacity === 'number' ? event.capacity : null;
    const ticketPrice = event.ticketPrice;
    const ticketPriceMinValue = ticketPrice && typeof ticketPrice.min === 'number' ? ticketPrice.min : null;
    const ticketPriceCurrency = ticketPrice?.currency ?? '';

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(event.id);
    };

    return (
        <Link href="/event/timeless-tuesday" className={cn("group block w-full cursor-pointer", className)}>
            <article className="relative w-full">
                <div
                    className="absolute inset-0 rounded-[28px] opacity-60 blur-[26px] transition duration-500 group-hover:opacity-100"
                    style={{
                        clipPath: CARD_CLIP_PATH,
                        background: "linear-gradient(135deg, rgba(20,184,166,0.45), rgba(6,182,212,0.15))",
                        boxShadow: "0 32px 70px rgba(4, 60, 60, 0.35)"
                    }}
                />
                <div
                    className="relative w-full overflow-hidden border border-teal-500/12 bg-[#071414]/90 backdrop-blur-[12px] transition-all duration-500 group-hover:border-teal-400/40"
                    style={{ clipPath: CARD_CLIP_PATH }}
                >
                    {/* Image */}
                    <div className="relative h-[200px]">
                        <img
                            src={imageSrc}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== fallbackImage) {
                                    target.src = fallbackImage;
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#031313] via-transparent to-transparent opacity-80"></div>

                        {/* Date badge */}
                        <div className="absolute right-4 top-4">
                            <div className="rounded-[14px] bg-gradient-to-b from-teal-500 via-teal-600 to-teal-700 px-3 py-2 text-center shadow-[0_12px_25px_rgba(13,148,136,0.45)]">
                                <div className="text-[10px] font-medium tracking-[0.25em] text-white/70">
                                    {formattedDate.month}
                                </div>
                                <div className="text-lg font-bold text-white leading-tight">
                                    {formattedDate.day}
                                </div>
                            </div>
                        </div>

                        {/* Favorite button */}
                        <button
                            type="button"
                            onClick={handleFavorite}
                            className="absolute right-4 top-[92px] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-black/60"
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart
                                className={cn("h-5 w-5", isFavorite ? "fill-teal-400 text-teal-400" : "text-white/80")}
                            />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 px-5 pb-5 pt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold leading-snug tracking-wide text-white line-clamp-2">
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <MapPin className="h-4 w-4 text-teal-300/80" />
                                <span className="truncate">{locationLabel}</span>
                            </div>
                        </div>
                        {(capacityValue !== null || ticketPriceMinValue !== null) && (
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/40">
                                <span>{capacityValue !== null ? `Capacity ${capacityValue}` : ''}</span>
                                <span>
                                    {ticketPriceMinValue !== null
                                        ? `${ticketPriceCurrency} ${ticketPriceMinValue.toLocaleString()}`
                                        : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Footer ribbon */}
                    <div
                        className="header-gradient px-5 py-3 text-center text-sm font-semibold tracking-[0.12em] text-white"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, calc(100% - 18px) 100%, 0 100%)" }}
                    >
                        {primaryGenre}
                    </div>
                </div>
            </article>
        </Link>
    );
}
