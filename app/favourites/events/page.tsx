'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2, Share2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { toast } from '@/hooks/use-toast';
import { EventService } from '@/lib/services/event.service';

// Dummy favorite events data for display
const favoriteEventsData = [
    {
        id: '1',
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: 'APR 04',
        category: 'Techno & Bollytech',
        image: '/venue/Screenshot 2024-12-10 195651.png'
    },
    {
        id: '2',
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: 'APR 04',
        category: 'Techno & Bollytech',
        image: '/venue/Screenshot 2024-12-10 195651.png'
    },
    {
        id: '3',
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: 'APR 04',
        category: 'Techno & Bollytech',
        image: '/venue/Screenshot 2024-12-10 195852.png'
    }
];

export default function FavoriteEventsPage() {
    const router = useRouter();
    const [favoriteEvents, setFavoriteEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load favorite events from API
        const loadFavoriteEvents = async () => {
            try {
                const response = await EventService.getFavoriteEvents();
                if (response.success && response.data) {
                    setFavoriteEvents(response.data);
                } else {
                    setFavoriteEvents([]);
                }
            } catch (error) {
                console.error('Error loading favorite events:', error);
                setFavoriteEvents([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavoriteEvents();
    }, []);

    const handleShare = (eventId: string) => {
        // Handle share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Check out this event!',
                url: `${window.location.origin}/event/${eventId}`
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}`);
            toast({
                title: "Link copied!",
                description: "Event link copied to clipboard.",
            });
        }
    };

    const handleBookmark = (eventId: string) => {
        toast({
            title: "Removed from favorites",
            description: "Event removed from your favorites.",
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden">
            <PageHeader title="FAVOURITE EVENTS" />

            {/* Event Cards */}
            <div className="px-8 space-y-10 pt-[20vh]">
                {favoriteEventsData.map((event) => (

                    <div key={event.id} className="w-full h-[150px] relative">
                        {/* Main card background */}
                        <div
                            className="w-full h-[150px] absolute left-0 top-0 rounded-[20px]"
                            style={{
                                background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)',
                                outline: '15px #0D1F1F solid'
                            }}
                        >
                            {/* Event image - Reduced height */}
                            <div className="w-[120px] h-[150px] absolute left-0 top-0 rounded-tl-[20px] overflow-hidden z-30">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderWidth: '1.5px',
                                        borderStyle: 'solid',
                                        borderColor: '#28D2DB',
                                        borderRadius: '20px',
                                        borderTopRightRadius: '0px'
                                    }}
                                />
                            </div>

                            {/* Date badge - Increased height, reduced width */}
                            <div
                                className="w-[35px] h-[36px] absolute left-[15px] top-0 rounded-b-[24px] border-l border-r border-b border-[#CDCDCD] flex flex-col justify-center items-center shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-10"
                                style={{
                                    background: 'linear-gradient(180deg, black 0%, #00C0CA 100%)'
                                }}
                            >
                                <div className="w-[26px] text-center text-white text-[12px] font-['Manrope'] font-semibold leading-3">
                                    {event.date}
                                </div>
                            </div>

                            {/* Event details - Wrapped text, avoid icons area */}
                            <div className="absolute left-[135px] top-[35px] right-[70px] flex flex-col gap-[2px]">
                                <div className="text-[#E6E6E6] text-[14px] font-['Manrope'] font-bold leading-[18px] tracking-[0.14px] break-words">
                                    {event.title}
                                </div>
                                <div className="text-[#C3C3C3] text-[10px] font-['Manrope'] font-bold leading-[14px] tracking-[0.10px] break-words">
                                    {event.venue}
                                </div>
                            </div>

                            {/* Bookmark icon - Reduced size */}
                            <button
                                onClick={() => handleBookmark(event.id)}
                                className="w-[32px] h-[32px] absolute right-[15px] top-[20px] bg-[#005D5C] rounded-[24px] backdrop-blur-[10.10px] flex justify-center items-center hover:bg-[#007D7C] transition-colors"
                            >
                                <Bookmark className="w-[18px] h-[18px] text-[#14FFEC] fill-[#14FFEC]" />
                            </button>

                            {/* Share icon - Reduced size */}
                            <button
                                onClick={() => handleShare(event.id)}
                                className="w-[32px] h-[32px] absolute right-[15px] top-[65px] bg-[#005D5C] rounded-[24px] backdrop-blur-[10.10px] flex justify-center items-center hover:bg-[#007D7C] transition-colors"
                            >
                                <Share2 className="w-[18px] h-[18px] text-[#14FFEC]" />
                            </button>

                            {/* Category bar - Slightly extend left to cover gap */}
                            <div
                                className="absolute left-[100px] right-0 bottom-0 h-[34px] rounded-br-[20px] border-t border-[#0FD8E2] flex justify-center items-center overflow-hidden"
                                style={{
                                    background: 'radial-gradient(ellipse 148.20% 1115.41% at 50.00% 50.00%, #004342 0%, #00C3C1 100%)'
                                }}
                            >
                                <div className="text-[#14FFEC] text-[14px] font-['Manrope'] font-bold leading-[17px] text-center">
                                    {event.category}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}