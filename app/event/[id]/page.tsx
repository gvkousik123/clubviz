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
    Users,
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

    const [eventData, setEventData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        const loadEventData = async () => {
            try {
                const eventId = params.id as string;
                if (!eventId) {
                    setError('No event ID provided');
                    setIsLoading(false);
                    return;
                }

                console.log('🔍 Loading event:', eventId, 'Guest mode:', isGuestMode());

                let eventDetails = null;

                if (isGuestMode()) {
                    // Use public event service for guests
                    eventDetails = await PublicEventService.getPublicEventById(eventId);
                    console.log('✅ Public event data:', eventDetails);
                } else {
                    // Use regular event service for authenticated users
                    const response = await EventService.getEventDetails(eventId);
                    console.log('✅ Authenticated event response:', response);

                    // Handle both wrapped and direct response formats
                    if (response && typeof response === 'object') {
                        if (response.data) {
                            eventDetails = response.data;
                        } else if (response.id) {
                            eventDetails = response;
                        }
                    }
                }

                if (eventDetails) {
                    setEventData(eventDetails);
                    setIsLiked(eventDetails.isRegistered || false);
                    setError(null);
                } else {
                    setError('Failed to load event data');
                }
            } catch (err: any) {
                console.error('💥 Error loading event:', err);
                setError(err.message || 'Error loading event details');
            } finally {
                setIsLoading(false);
            }
        };

        loadEventData();
    }, [params.id]);

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: eventData?.title || 'ClubViz Event',
                    text: `Check out ${eventData?.title}`,
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
        if (isGuestMode()) {
            toast({ title: 'Sign in', description: 'Please sign in to favorite events.' });
            return;
        }

        try {
            setIsLiked(!isLiked);
            if (!isLiked) {
                await EventService.addToFavorites(eventData.id);
            } else {
                await EventService.removeFromFavorites(eventData.id);
            }
        } catch (error) {
            setIsLiked(!isLiked);
        }
    };

    const handleRegister = async () => {
        if (isGuestMode()) {
            router.push('/auth/login?redirect=' + window.location.pathname);
            return;
        }

        setIsActionLoading(true);
        try {
            if (eventData.isRegistered || eventData.rsvpStatus === 'REGISTERED') {
                await EventService.leaveEvent(eventData.id);
                setEventData(prev => ({ ...prev, isRegistered: false, rsvpStatus: 'NOT_REGISTERED' }));
                toast({ title: 'Unregistered', description: 'You have left the event.' });
            } else {
                await EventService.attendEvent(eventData.id);
                setEventData(prev => ({ ...prev, isRegistered: true, rsvpStatus: 'REGISTERED' }));
                toast({ title: 'Success!', description: 'You are registered for this event.' });
            }
        } catch (err: any) {
            toast({ title: 'Action failed', description: err.message, variant: 'destructive' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#14FFEC] animate-spin mx-auto mb-4" />
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !eventData) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
                    <button
                        onClick={handleBackClick}
                        className="px-6 py-2 bg-[#14FFEC] text-black rounded-full font-bold hover:bg-[#10d4c4] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#021313] text-white">

            {/* Hero Section with Event Image */}
            <div className="relative h-[420px] w-full">
                <img
                    src={eventData?.imageUrl || eventData?.image || "/event list/Rectangle 1.jpg"}
                    alt={eventData?.title || "Event"}
                    className="w-full h-full object-cover brightness-75"
                />

                {/* Gradient Overlay - darker version */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#021313]" />

                {/* Back Button */}
                <div className="absolute top-4 left-4 flex items-center">
                    <button
                        onClick={handleBackClick}
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
                <div className="px-4 pt-8">
                    {/* Event Title */}
                    <div className="flex justify-center items-center mb-7">
                        <h1 className="text-white text-center text-xl font-['Manrope'] leading-8 tracking-[0.24px] uppercase">
                            {eventData?.title || ''}
                        </h1>
                    </div>

                    {/* Action Icons */}
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <button
                            onClick={handleShare}
                            className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center active:scale-95 transition hover:bg-[#006B67]"
                        >
                            <Share2 size={24} className="text-[#14FFEC]" />
                        </button>

                        <button
                            onClick={handleToggleLike}
                            className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center active:scale-95 transition hover:bg-[#006B67]"
                        >
                            <Heart
                                size={24}
                                className={isLiked ? "text-[#FF3B3B] fill-[#FF3B3B]" : "text-[#14FFEC]"}
                            />
                        </button>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center justify-center gap-2 px-2 mb-4">
                        <Calendar size={20} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-4 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] text-sm">{eventData?.formattedDate} | {eventData?.formattedTime}</p>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center gap-3 mb-4 px-2 justify-center">
                        <MapPin size={20} className="text-[#14FFEC] flex-shrink-0" />
                        <p className="text-white font-['Manrope'] text-center text-sm">{eventData?.location || eventData?.club?.name || 'Location TBD'}</p>
                    </div>

                    {/* Registration Status Badge */}
                    {(eventData?.isRegistered || eventData?.rsvpStatus === 'REGISTERED') && (
                        <div className="flex justify-center mb-4">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs border border-green-500/30">
                                ✓ You are registered
                            </span>
                        </div>
                    )}
                </div>

                {/* Separator Line */}
                <div className="flex justify-center my-6">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Description */}
                {eventData?.description && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-lg font-['Manrope'] mb-2 font-bold">About</h2>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{eventData.description}</p>
                    </div>
                )}

                {/* Attendees Info */}
                {eventData?.attendeeCount !== undefined && (
                    <div className="px-6 mb-6">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                            <Users size={20} className="text-[#14FFEC] flex-shrink-0" />
                            <div>
                                <p className="text-white/50 text-xs font-semibold uppercase">Attendees</p>
                                <p className="text-white text-sm font-semibold">
                                    {eventData.attendeeCount} / {eventData.maxAttendees || '∞'} attending
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Organizer/Club */}
                {(eventData?.club || eventData?.organizer) && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-lg font-['Manrope'] mb-3 font-bold">Host</h2>
                        <Link href={`/club/${eventData?.club?.id}`} className="block">
                            <div className="bg-[#0D1F1F] rounded-lg p-4 flex items-center gap-3 hover:bg-[#0F252D] transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img
                                        src={eventData?.club?.logo || eventData?.organizer?.avatar || "/common/avatar-default.jpg"}
                                        alt="Host"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "/common/avatar-default.jpg")}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-['Manrope'] font-bold truncate">
                                        {eventData?.club?.name || eventData?.organizer?.displayName || 'Organizer'}
                                    </h3>
                                    <p className="text-[#14FFEC] text-xs">
                                        {eventData?.club ? 'Visit Club' : 'Organizer'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Bottom Action Button */}
                <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                    <button
                        onClick={handleRegister}
                        disabled={isActionLoading}
                        className={`pointer-events-auto shadow-lg shadow-[#14FFEC]/20 w-full max-w-md h-[54px] rounded-[30px] flex justify-center items-center text-base font-bold font-['Manrope'] transition-all active:scale-95 ${
                            eventData?.isRegistered
                                ? 'bg-red-500/80 text-white hover:bg-red-600'
                                : 'bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white hover:brightness-110'
                        } disabled:opacity-50`}
                    >
                        {isActionLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : eventData?.isRegistered ? (
                            'Cancel Registration'
                        ) : (
                            'Register Now'
                        )}
                    </button>
                </div>

                <div className="h-24"></div> {/* Spacer for fixed button */}
            </div>
        </div>
    );
}

