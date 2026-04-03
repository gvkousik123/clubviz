"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

interface EventCardRowProps {
    event: {
        id: string;
        title: string;
        imageUrl?: string;
        startDateTime: string;
        clubName?: string;
        location?: string;
        shortDescription?: string;
        formattedDate?: string;
    };
    fallbackImage?: string;
    onBookmark?: (eventId: string) => void;
}

export function EventCardRow({ event, fallbackImage = '/event list/Rectangle 1.jpg', onBookmark }: EventCardRowProps) {
    const eventDate = new Date(event.startDateTime);
    const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate().toString().padStart(2, '0');

    const isValidImageUrl = (url?: string) => {
        if (!url) return false;
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onBookmark) {
            onBookmark(event.id);
        }
    };

    return (
        <Link href={`/event/${event.id}`}>
            <div
                className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}
            >
                {/* Image */}
                <div className="relative">
                    <img
                        src={event.imageUrl && isValidImageUrl(event.imageUrl) ? event.imageUrl : fallbackImage}
                        alt={event.title}
                        data-fullscreen="true"
                        className="w-full h-[180px] object-contain bg-gray-900"
                        style={{
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: '#28D2DB',
                            borderBottomRightRadius: '0',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            borderBottomLeftRadius: '20px',
                        }}
                    />
                </div>

                {/* Date Badge - positioned on the right */}
                <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                    <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">
                        {monthShort}<br />{day}
                    </div>
                </div>

                {/* Content - positioned in the dark area below image */}
                <div className="absolute left-[18px] right-[18px] top-[188px] flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-[13px] font-bold font-['Manrope'] leading-[18px] mb-1 truncate">
                            {event.title}
                        </div>
                        <div className="text-[#C6C6C6] text-[11px] font-semibold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                            {event.clubName || event.location}
                        </div>
                    </div>
                    {onBookmark && (
                        <button
                            onClick={handleBookmark}
                            className="w-[34px] h-[34px] p-[5px] bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] flex justify-center items-center"
                        >
                            <Bookmark className="w-5 h-5 text-[#14FFEC]" />
                        </button>
                    )}
                </div>

                <div className="absolute left-[18px] right-[18px] top-[249px]">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent"></div>
                </div>

                <div className="absolute left-[18px] right-[18px] top-[262px] text-white text-[11px] font-bold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                    {event.shortDescription || event.formattedDate}
                </div>
            </div>
        </Link>
    );
}
