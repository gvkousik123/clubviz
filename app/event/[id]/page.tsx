'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Share2,
    Heart,
    Calendar,
    Clock,
    MapPin,
    Music,
    Users,
    ThumbsUp,
    Ticket,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventService } from '@/lib/services/event.service';
import { PublicEventService, PublicEventDetails } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';

export default function EventDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!params.id) return;
            setLoading(true);
            try {
                const isGuest = isGuestMode();
                const eventId = params.id as string;
                console.log('🔍 Fetching event:', eventId, 'Guest mode:', isGuest);

                if (isGuest) {
                    // Use public event service for guests
                    const eventData = await PublicEventService.getPublicEventById(eventId);
                    console.log('✅ Event data received:', eventData);
                    if (eventData) {
                        setEvent(eventData);
                    } else {
                        setError('Event not found');
                    }
                } else {
                    // Use regular event service for authenticated users
                    const response = await EventService.getEventDetails(eventId);
                    console.log('✅ Authenticated event response:', response);
                    if (response.success && response.data) {
                        setEvent(response.data);
                    } else {
                        setError('Event not found');
                    }
                }
            } catch (err: any) {
                console.error("💥 Error fetching event details:", err);
                setError(err.message || 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [params.id]);

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: event?.title || 'ClubViz Event',
                    text: `Check out ${event?.title}`,
                    url: window.location.href,
                });
                return;
            }
            await navigator.clipboard?.writeText(window.location.href);
            toast({ title: 'Link copied', description: 'Event link copied to clipboard.' });
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleToggleLike = async () => {
        if (!event || isGuestMode()) {
            if (isGuestMode()) toast({ title: 'Sign in', description: 'Please sign in to favorite events.' });
            return;
        }

        try {
            // Optimistic update
            setIsLiked(!isLiked);
            if (!isLiked) {
                await EventService.addToFavorites(event.id);
            } else {
                await EventService.removeFromFavorites(event.id);
            }
        } catch (error) {
            // Revert on failure
            setIsLiked(!isLiked);
        }
    };

    const handleRegister = async () => {
        if (!event || isGuestMode()) {
            if (isGuestMode()) router.push('/auth/login?redirect=' + window.location.pathname);
            return;
        }

        setIsActionLoading(true);
        try {
            if (event.isRegistered || event.rsvpStatus === 'REGISTERED') {
                await EventService.leaveEvent(event.id);
                setEvent({ ...event, isRegistered: false, rsvpStatus: 'NOT_REGISTERED' });
                toast({ title: 'Unregistered', description: 'You have left the event.' });
            } else {
                await EventService.attendEvent(event.id);
                setEvent({ ...event, isRegistered: true, rsvpStatus: 'REGISTERED' });
                toast({ title: 'Success!', description: 'You are registered for this event.' });
            }
        } catch (err: any) {
            toast({ title: 'Action failed', description: err.message, variant: 'destructive' });
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#021313] flex flex-col items-center justify-center text-white">
                <p className="mb-4">{error || 'Event not found'}</p>
                <button onClick={() => { console.log('Going back...'); router.back(); }} className="text-[#14FFEC] flex items-center gap-2">
                    <ChevronLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    const eventDate = new Date(event.startDateTime);
    const dateStr = eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-[#021313] text-white">

            {/* Hero Section with Event Image */}
            <div className="relative h-[420px] w-full">
                <img
                    src={event.imageUrl || event.images?.[0] || "/event list/Rectangle 1.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover brightness-75"
                />

                {/* Gradient Overlay - darker version */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#021313]" />

                {/* Back Button */}
                <div className="absolute top-4 left-4 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft
                            size={20}
                            className="text-[#14FFEC]"
                        />
                    </button>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="w-full bg-[#021313] rounded-t-[40px] -mt-10 relative z-10">
                <div className="px-4 pt-8 ">
                    {/* Event Title */}
                    <div className="flex justify-center items-center mb-7">
                        <h1 className="text-white text-center text-xl font-['Manrope'] leading-8 tracking-[0.24px] uppercase">
                            {event.title}
                        </h1>
                    </div>

                    {/* Action Icons */}
                    <div className="flex justify-center items-center gap-4 mb-6">
                        {/* 
                           TODO: ThumbsUp logic if needed. 
                           For now implementing Share and Heart. 
                        */}

                        <button onClick={handleShare} className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center active:scale-95 transition">
                            <Share2 size={24} className="text-[#14FFEC]" />
                        </button>

                        <button onClick={handleToggleLike} className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center active:scale-95 transition">
                            <Heart size={24} className={isLiked ? "text-[#14FFEC] fill-[#14FFEC]" : "text-[#14FFEC]"} />
                        </button>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center gap-3 mb-4 px-2 justify-center">
                        <MapPin size={24} className="text-[#14FFEC] flex-shrink-0" />
                        <p className="text-white font-['Manrope'] text-center">{event.location || event.club?.name || 'Location TBD'}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center justify-center gap-2 px-2 mb-4">
                        <Calendar size={24} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope']">{dateStr} | {timeStr}</p>
                        </div>
                    </div>

                    {/* Registration Status Badge */}
                    {(event.isRegistered || event.rsvpStatus === 'REGISTERED') && (
                        <div className="flex justify-center mb-4">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                                You are registered
                            </span>
                        </div>
                    )}
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-6">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Description */}
                {event.description && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-lg font-['Manrope'] mb-2 font-bold">About</h2>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
                    </div>
                )}

                {/* People Attending (Mock or Real) */}
                {event.attendeeCount > 0 && (
                    <div className="px-6 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                <Users size={14} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-['Manrope']">{event.attendeeCount}+ attending</span>
                        </div>
                    </div>
                )}

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Organizer/Club */}
                {(event.club || event.organizer) && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-xl font-['Manrope'] mb-3">Host</h2>
                        <div className="bg-[#0D1F1F] rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden">
                                    <img
                                        src={event.club?.logo || event.organizer?.avatar || "/common/avatar-default.jpg"}
                                        alt="Host"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "/common/avatar-default.jpg")}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-['Manrope'] font-bold">
                                        {event.club?.name || event.organizer?.displayName || 'Organizer'}
                                    </h3>
                                    <p className="text-[#14FFEC] text-xs">
                                        {event.club ? 'Club' : 'Organizer'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Action Button */}
                <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                    <button
                        onClick={handleRegister}
                        disabled={isActionLoading}
                        className={`pointer-events-auto shadow-lg shadow-[#14FFEC]/20 w-full max-w-md h-[54px] rounded-[30px] flex justify-center items-center text-xl font-bold font-['Manrope'] transition-all active:scale-95 ${event.isRegistered
                            ? 'bg-red-500/80 text-white hover:bg-red-600'
                            : 'bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white hover:brightness-110'
                            }`}
                    >
                        {isActionLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            event.isRegistered ? 'Cancel Registration' : 'Register Now'
                        )}
                    </button>
                </div>

                <div className="h-24"></div> {/* Spacer for fixed button */}
            </div>
        </div>
    );
}

