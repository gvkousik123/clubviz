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
    Loader2,
    Building2,
    ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventService } from '@/lib/services/event.service';
import { TicketService } from '@/lib/services/ticket.service';
import { PublicEventService, PublicEventDetails } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';
// Use centralized data store for cached event details
import { useEventDetail } from '@/lib/store';
import { EventDetailSkeleton } from '@/components/ui/skeleton-loaders';

export default function EventDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const eventId = params.id as string;
    const [isLiked, setIsLiked] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // ==================== OPTIMIZED: Use cached event data ====================
    // This prevents duplicate API calls when navigating back and forth
    const { event: eventData, loading: isLoading, error, refetch } = useEventDetail(eventId);

    // Load favorite status from API when event data is available
    useEffect(() => {
        if (eventData && !isGuestMode()) {
            EventService.isEventFavorite(eventData.id)
                .then((res: any) => setIsLiked(!!res?.favorited))
                .catch(() => {});
        }
    }, [eventData?.id]);

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
        setIsFavoriteLoading(true);
        const prev = isLiked;
        setIsLiked(!prev);
        try {
            if (!prev) {
                await EventService.addToFavorites(eventData!.id);
                toast({ title: 'Added to favorites', description: 'Event added to your favorites.' });
            } else {
                await EventService.removeFromFavorites(eventData!.id);
                toast({ title: 'Removed from favorites', description: 'Event removed from your favorites.' });
            }
        } catch (error: any) {
            setIsLiked(prev);
            toast({ title: 'Error', description: error?.message || 'Failed to update favorites.', variant: 'destructive' });
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleRegister = async () => {
        if (isGuestMode()) {
            router.push('/auth/login?redirect=' + window.location.pathname);
            return;
        }

        // Navigate to ticket booking flow instead of just registering
        router.push(`/event/tickets?eventId=${eventData!.id}`);
    };

    const handleBackClick = () => {
        router.push('/home');
    };

    // Show loading state with skeleton
    if (isLoading) {
        return <EventDetailSkeleton />;
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
            <div className="relative w-full bg-gray-900 overflow-hidden" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', maxHeight: '600px' }}>
                <img
                    src={eventData?.imageUrl || eventData?.image || "/event list/Rectangle 1.jpg"}
                    alt={eventData?.title || "Event"}
                    className="object-contain w-full h-full"
                    style={{ maxHeight: '600px', maxWidth: '100%' }}
                />

                {/* Gradient Overlay - darker version */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#021313] pointer-events-none" />

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
                            disabled={isFavoriteLoading}
                            className="w-[39px] h-[39px] bg-[#005D5C] rounded-full flex justify-center items-center active:scale-95 transition hover:bg-[#006B67] disabled:opacity-50"
                        >
                            {isFavoriteLoading ? (
                                <Loader2 size={20} className="text-[#14FFEC] animate-spin" />
                            ) : (
                                <Heart
                                    size={24}
                                    className={isLiked ? "text-[#FF3B3B] fill-[#FF3B3B]" : "text-[#14FFEC]"}
                                />
                            )}
                        </button>
                    </div>

                    {/* Date - Left Aligned */}
                    <div className="flex items-center gap-3 px-4 mb-6">
                        <Calendar size={20} className="text-[#14FFEC] flex-shrink-0" />
                        <p className="text-white font-['Manrope'] text-sm">{eventData?.formattedDate}</p>
                    </div>

                    {/* Club Logo with Name and Location */}
                    <div className="px-4 mb-6 flex gap-4">
                        {/* Club Logo */}
                        <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                                src={eventData?.club?.logo || "/common/avatar-default.png"}
                                alt={eventData?.club?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "/common/avatar-default.png")}
                            />
                        </div>

                        {/* Club Name and Location Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-['Manrope'] text-left text-base font-semibold mb-2">
                                {eventData?.club?.name || 'Club TBD'}
                            </p>
                            <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-[#14FFEC] flex-shrink-0" />
                                <p className="text-white font-['Manrope'] text-left text-xs">{eventData?.location || 'Location TBD'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Time and Duration - Separated Below Location */}
                    <div className="px-4 mb-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-[#14FFEC] flex-shrink-0" />
                            <p className="text-white font-['Manrope'] text-sm">
                                {(() => {
                                    // Check if start and end times are the same
                                    if (eventData?.startDateTime && eventData?.endDateTime) {
                                        const startDate = new Date(eventData.startDateTime);
                                        const endDate = new Date(eventData.endDateTime);
                                        if (startDate.getTime() === endDate.getTime()) {
                                            // Same time - show "onwards" format
                                            const timeMatch = eventData.formattedTime?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                                            if (timeMatch) {
                                                return `${timeMatch[1]} onwards`;
                                            }
                                        }
                                    }
                                    // Different times - show as is
                                    return eventData?.formattedTime || 'Time TBD';
                                })()}
                            </p>
                        </div>
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

                {/* Artist Section */}
                {eventData?.eventArtistName && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-lg font-['Manrope'] mb-3 font-bold">Artist</h2>
                        <div className="bg-[#0D1F1F] rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img
                                        src={eventData?.artistImage || "/common/avatar-default.png"}
                                        alt={eventData?.eventArtistName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "/common/avatar-default.png")}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-['Manrope'] font-bold">
                                        {eventData.eventArtistName}
                                    </h3>
                                </div>
                            </div>
                            {eventData?.aboutEventArtist && (
                                <div>
                                    <h4 className="text-[#14FFEC] text-sm font-semibold mb-2">Description</h4>
                                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                                        {eventData.aboutEventArtist}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Separator Line */}
                {eventData?.eventArtistName && (
                    <div className="flex justify-center my-4">
                        <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                    </div>
                )}

                {/* Organizer/Club Section */}
                {(eventData?.club || eventData?.organizer) && (
                    <>
                        <div className="px-6 mb-6">
                            <h2 className="text-white text-lg font-['Manrope'] mb-3 font-bold">Event Organised & Presented by</h2>

                            {/* Club - Always show if present */}
                            {eventData?.club && (
                                <Link href={`/club/${eventData?.club?.id}`} className="block mb-4">
                                    <div className="bg-[#0D1F1F] rounded-lg p-4 flex items-center gap-3 hover:bg-[#0F252D] transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={eventData?.club?.logo || "/common/avatar-default.png"}
                                                alt="Club"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = "/common/avatar-default.png")}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-['Manrope'] font-bold truncate">
                                                {eventData?.club?.name}
                                            </h3>
                                            <p className="text-[#14FFEC] text-xs">
                                                Visit Club
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Organizer - Only show if present */}
                            {eventData?.organizer && (
                                <div className="bg-[#0D1F1F] rounded-lg p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#005D5C] flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img
                                            src={eventData?.organizer?.avatar || "/common/avatar-default.png"}
                                            alt="Organizer"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = "/common/avatar-default.png")}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-['Manrope'] font-bold truncate">
                                            {eventData?.organizer?.displayName}
                                        </h3>
                                        <p className="text-[#14FFEC] text-xs">
                                            Organizer
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Ticket Pricing Section */}
                {eventData?.ticketTypes && eventData.ticketTypes.length > 0 && (
                    <div className="px-6 mb-6">
                        <h2 className="text-white text-lg font-['Manrope'] mb-3 font-bold">Ticket Pricing</h2>
                        <div className="space-y-2">
                            {eventData.ticketTypes.map((ticket: any, index: number) => (
                                <div key={index} className="bg-[#0D1F1F] rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-['Manrope'] font-semibold text-sm">{ticket.name}</h3>
                                        <p className="text-white/70 text-xs">Available: {ticket.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#14FFEC] font-bold text-sm">₹{ticket.price}</p>
                                        <span className="text-xs text-white/50">{ticket.currency}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[0.5px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent"></div>
                </div>

                {/* Leave a review */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '32px' }}>
                    <Link
                        href={`/review/write?eventId=${encodeURIComponent(eventData.id)}`}
                        className="w-full max-w-[398px] h-12 relative flex items-center bg-[#283c3d] px-4 rounded-2xl mx-auto hover:bg-[#2f4647] transition-colors"
                        aria-label="Write a review"
                    >
                        <span className="font-medium text-[16px] leading-[21px] text-white whitespace-nowrap">Leave a review</span>
                        <div className="absolute right-[14.25px] w-6 h-6 rounded-full bg-[#14ffec] flex items-center justify-center pointer-events-none">
                            <ArrowRight className="w-[19.500003814697266px] h-[19.500003814697266px] text-black" />
                        </div>
                    </Link>
                </div>

                {/* Bottom Action Button */}
                <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                    <button
                        onClick={handleRegister}
                        disabled={isActionLoading}
                        className="pointer-events-auto shadow-lg shadow-[#14FFEC]/20 w-full max-w-md h-[54px] rounded-[30px] flex justify-center items-center text-base font-bold font-['Manrope'] transition-all active:scale-95 bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white hover:brightness-110 disabled:opacity-50"
                    >
                        {isActionLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            'Book Now'
                        )}
                    </button>
                </div>

                <div className="h-24"></div> {/* Spacer for fixed button */}
            </div>
        </div>
    );
}

