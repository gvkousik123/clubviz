'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Share2,
    Heart,
    Calendar,
    Clock,
    Users,
    ChevronLeft,
    Loader2,
    Building2
} from 'lucide-react';
import { ShareNetwork, CalendarBlank, CaretDown, CaretUp, InstagramLogo, SpotifyLogo } from '@phosphor-icons/react';
// reusable component for artist genres
import { GenreTags } from '@/components/event/GenreTags';
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
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
    const [indicatorLeft, setIndicatorLeft] = useState(0);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const updateIndicator = (idx: number) => {
        const el = iconRefs.current[idx];
        if (el) {
            const left = el.offsetLeft + el.offsetWidth / 2;
            setIndicatorLeft(left);
        }
    };

    useEffect(() => {
        updateIndicator(selectedArtistIndex);
    }, [selectedArtistIndex]);

    useEffect(() => {
        if (isExpanded) updateIndicator(selectedArtistIndex);
    }, [isExpanded]);

    // no scroll listener needed; indicator lives inside scroll container

    const artistScrollRef = useRef<HTMLDivElement | null>(null);
    const artistIconRefs = useRef<Array<HTMLDivElement | null>>([]);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const iconRefs = useRef<Array<HTMLDivElement | null>>([]);

    // ==================== OPTIMIZED: Use cached event data ====================
    // This prevents duplicate API calls when navigating back and forth
    const { event: eventData, loading: isLoading, error, refetch } = useEventDetail(eventId);

    // Artist model used for local demo data
    type Artist = {
        id: number;
        name: string;
        img: string;
        description: string;
        genres: string[];
    };

    // Static artists (temporary) to display under Artists heading
    // each artist has a description and a set of genres used on expand.
    const artists: Artist[] = [
        {
            id: 1,
            name: 'DJ Edward',
            img: 'https://i.pravatar.cc/52?img=3',
            description: 'DJ Edward is an African DJ/producer making waves in the EDM and Techno scene. He started at small parties and now plays at prestigious clubs in the city.',
            genres: ['Techno', 'Mellow Tech', 'Bolly Tech', 'Bollywood']
        }
    ];

    // Update liked state when event data changes
    useEffect(() => {
        if (eventData) {
            setIsLiked(eventData.isRegistered || false);
        }
    }, [eventData]);

    // center indicator under selected icon whenever index changes
    useEffect(() => {
        const iconEl = artistIconRefs.current[selectedArtistIndex];
        if (iconEl) {
            const leftPos = (iconEl.offsetLeft ?? 0) + (iconEl.offsetWidth / 2) - 46.5;
            setIndicatorLeft(leftPos);
        }
    }, [selectedArtistIndex]);

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

        // Navigate to ticket booking flow instead of just registering
        router.push(`/event/tickets?eventId=${eventData.id}`);
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


        <div className="min-h-screen bg-[#021313] text-white relative w-full max-w-[430px] mx-auto">
            {/* Hero Section with Event Image */}
            <div className="relative w-full max-w-[430px] bg-gray-900 overflow-hidden flex justify-center items-center mx-auto" style={{ minHeight: '562px', maxHeight: '562px' }}>
                <img
                    src={eventData?.imageUrl || eventData?.image || "/event list/Rectangle 1.jpg"}
                    alt={eventData?.title || "Event"}
                    style={{ width: '430px', height: '562px', objectFit: 'cover', borderRadius: 0 }}
                />

                {/* Gradient Overlay - darker version */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#021313] pointer-events-none" />

                {/* Back Button - match club details */}
                <button
                    onClick={handleBackClick}
                    className="absolute left-4 top-4 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition z-10"
                >
                    <ChevronLeft className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Event Details Section - match club details */}
            <div
                className="w-full bg-[#021313] rounded-tl-[40px] rounded-tr-[40px] pb-8 relative"
                style={{ marginTop: '0px', position: 'relative', zIndex: 10 }}
            >
                <div className="px-4 pt-8">
                    {/* Event Title */}
                    <div className="flex justify-center items-center mb-7">
                        <h1
                            className="text-white text-center font-['Anton_SC',sans-serif]"
                            style={{
                                fontWeight: 400,
                                fontSize: '24px',
                                letterSpacing: '0.0625em',
                                lineHeight: '32px',
                                textAlign: 'center',
                                color: '#ffffff'
                            }}
                        >
                            {eventData?.title || ''}
                        </h1>
                    </div>

                    {/* Share and Save Buttons (match club details) */}
                    <div 
                        className="flex justify-center items-center gap-3 w-full"
                        style={{ paddingTop: '6px', paddingBottom: '6px' }}
                    >
                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(20,255,236,0.15)] hover:bg-[rgba(20,255,236,0.25)] transition"
                        >
                            <ShareNetwork size={20} className="text-[#14ffec]" weight="fill" />
                        </button>

                        {/* Save Button (heart icon) */}
                        <button
                            onClick={() => {
                                setIsBookmarked(!isBookmarked);
                                toast({
                                    title: isBookmarked ? 'Removed' : 'Saved',
                                    description: `${eventData?.title || 'Event'} has been ${isBookmarked ? 'removed from' : 'added to'} your favorites.`,
                                });
                            }}
                            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(20,255,236,0.15)] hover:bg-[rgba(20,255,236,0.25)] transition"
                        >
                            <Heart size={20} className={isBookmarked ? 'text-[#FF3B3B] fill-[#FF3B3B]' : 'text-[#14ffec]'} />
                        </button>
                    </div>

                    {/* Address line below icons */}
                    <div
                        className="flex items-center"
                        style={{ paddingTop: '20.5px', paddingLeft: '29.75px' }}
                    >
                        <svg
                            className="w-[16.5px] h-[20.99979019165039px] text-[#14ffec] flex-shrink-0"
                            viewBox="0 0 16.5 21"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: '1.5px' }}
                        >
                            <path d="M8.25 0C3.694 0 0 3.694 0 8.25c0 6.188 7.13 12.23 7.43 12.48a1.25 1.25 0 0 0 1.64 0c.3-.25 7.43-6.292 7.43-12.48C16.5 3.694 12.806 0 8.25 0zm0 11.25A3 3 0 1 1 8.25 5.25a3 3 0 0 1 0 6z" />
                        </svg>
                        <span className="ml-2 text-white text-base font-['Manrope'] truncate">
                            {eventData?.location || 'Location TBD'}
                        </span>
                    </div>

                    {/* Date/time card beside calendar icon, only date/time inside card */}
                    <div className="flex items-center" style={{ marginTop: '25.5px', paddingLeft: '29.75px' }}>
                        <svg
                            className="flex-shrink-0"
                            width="18"
                            height="19.5"
                            viewBox="0 0 18 19.5"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ color: '#14ffec', marginRight: '8px' }}
                        >
                            <path d="M14.25 2.25h-1.125V1.125a1.125 1.125 0 1 0-2.25 0V2.25H7.125V1.125a1.125 1.125 0 1 0-2.25 0V2.25H3.75A2.25 2.25 0 0 0 1.5 4.5v12.75A2.25 2.25 0 0 0 3.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25zm0 15.75H3.75a.75.75 0 0 1-.75-.75V7.5h12v9.75a.75.75 0 0 1-.75.75zm.75-13.5v1.5h-12V4.5a.75.75 0 0 1 .75-.75h1.125v1.125a1.125 1.125 0 1 0 2.25 0V3.75h3.75v1.125a1.125 1.125 0 1 0 2.25 0V3.75h1.125a.75.75 0 0 1 .75.75z" />
                        </svg>
                        <div
                            className="flex justify-center items-center bg-[#202b2b] py-[6px] rounded-[30px]"
                            style={{ paddingLeft: '12.5px', paddingRight: '12.5px', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 'fit-content', maxWidth: '100%' }}
                        >
                            <span
                                className="font-bold text-[15px] leading-[20px] text-white"
                                style={{
                                    fontFamily: 'Manrope',
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    letterSpacing: '0.0625em',
                                    lineHeight: '20px',
                                    color: '#ffffff',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {/* Format: 24 Dec | 7:00 pm */}
                                {eventData?.startDateTime
                                    ? (() => {
                                        const dateObj = new Date(eventData.startDateTime);
                                        const day = dateObj.getDate();
                                        const month = dateObj.toLocaleString('en-US', { month: 'short' });
                                        const hours = dateObj.getHours();
                                        const mins = dateObj.getMinutes();
                                        const ampm = hours >= 12 ? 'pm' : 'am';
                                        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
                                        const time = `${hour12}:${mins.toString().padStart(2, '0')} ${ampm}`;
                                        return `${day} ${month} | ${time}`;
                                    })()
                                    : 'Date TBD'}
                            </span>
                        </div>
                    </div>

                    {/* Thin line border below calendar part, 398px long */}
                    <div className="flex justify-center" style={{ paddingTop: '24px' }}>
                        <div className="h-[1px] w-[398px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                    </div>

                    {/* Genre tabs section */}
                    <div className="flex items-center" style={{ paddingTop: '24px', paddingLeft: '15px' }}>
                        <div className="flex justify-center items-center gap-[10px]">
                            {/* Electronic Tab */}
                            <div className="flex justify-center items-center gap-1.5 bg-[#0d7377] px-[15px] py-2 rounded-[25px] border border-solid border-[#14ffec]">
                                <span
                                    className="font-semibold text-[16px] leading-[16px] text-white"
                                    style={{
                                        fontFamily: 'Manrope',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        letterSpacing: '0.5px',
                                        lineHeight: '16px',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                    }}
                                >
                                    Electronic
                                </span>
                            </div>
                            {/* Hip Hop Tab */}
                            <div className="flex justify-center items-center gap-1.5 bg-[#0d7377] px-[15px] py-2 rounded-[25px] border border-solid border-[#14ffec]">
                                <span
                                    className="font-semibold text-[16px] leading-[16px] text-white"
                                    style={{
                                        fontFamily: 'Manrope',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        letterSpacing: '0.5px',
                                        lineHeight: '16px',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                    }}
                                >
                                    Hip Hop
                                </span>
                            </div>
                            {/* Techno Tab */}
                            <div className="flex justify-center items-center gap-1.5 bg-[#0d7377] px-[15px] py-2 rounded-[25px] border border-solid border-[#14ffec]">
                                <span
                                    className="font-semibold text-[16px] leading-[16px] text-white"
                                    style={{
                                        fontFamily: 'Manrope',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        letterSpacing: '0.5px',
                                        lineHeight: '16px',
                                        color: '#ffffff',
                                        textAlign: 'center',
                                    }}
                                >
                                    Techno
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Thin line border below tabs */}
                    <div className="flex justify-center" style={{ paddingTop: '20px' }}>
                        <div className="h-[1px] w-[398px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                    </div>

                    {/* Attendee avatars row */}
                    <div className="flex items-center" style={{ paddingTop: '20px' }}>
                        <div style={{ paddingLeft: '22px', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={eventData?.attendees?.[0]?.avatar || 'https://i.pravatar.cc/31?img=1'}
                                alt="attendee-1"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ zIndex: 1 }}
                            />
                            <img
                                src={eventData?.attendees?.[1]?.avatar || 'https://i.pravatar.cc/31?img=2'}
                                alt="attendee-2"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ marginLeft: '-15.5px', zIndex: 2 }}
                            />
                            <img
                                src={eventData?.attendees?.[2]?.avatar || 'https://i.pravatar.cc/31?img=3'}
                                alt="attendee-3"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ marginLeft: '-15.5px', zIndex: 3 }}
                            />
                            <img
                                src={eventData?.attendees?.[3]?.avatar || 'https://i.pravatar.cc/31?img=4'}
                                alt="attendee-4"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ marginLeft: '-15.5px', zIndex: 4 }}
                            />
                            <img
                                src={eventData?.attendees?.[4]?.avatar || 'https://i.pravatar.cc/31?img=5'}
                                alt="attendee-5"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ marginLeft: '-15.5px', zIndex: 5 }}
                            />
                            <img
                                src={eventData?.attendees?.[5]?.avatar || 'https://i.pravatar.cc/31?img=6'}
                                alt="attendee-6"
                                className="w-[31px] h-[31px] rounded-full border-2 border-[#021313]"
                                style={{ marginLeft: '-15.5px', zIndex: 6 }}
                            />
                            <span className="ml-3 font-medium text-sm text-[#c8c7c7]" style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: '14px', letterSpacing: '0.0625em', lineHeight: '20px' }}>
                                {eventData?.attendeeCount ? `${eventData.attendeeCount} going in this event` : '61+ going in this event'}
                            </span>
                        </div>
                    </div>

                    {/* Divider below attendees */}
                    <div className="flex justify-center" style={{ paddingTop: '20px' }}>
                        <div className="h-[1px] w-[398px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                    </div>

                    {/* Date removed as per request */}

                    {/* Artists heading */}
                    <div style={{ paddingTop: '22.5px', paddingLeft: '15px' }}>
                        <span
                            className="font-semibold text-[16px] leading-[20px] text-white"
                            style={{
                                fontFamily: 'Manrope',
                                fontWeight: 600,
                                fontSize: '16px',
                                letterSpacing: '0.0625em',
                                lineHeight: '20px',
                                color: '#ffffff',
                            }}
                        >
                            Artists
                        </span>
                    </div>

                    {/* Artists tab container */}
                                    <div className={`flex flex-col gap-3 self-stretch w-full max-w-[398px] bg-[#0d1f1f] pl-0 pr-[15px] pt-[15px] pb-2.5 rounded-[20px] border border-solid ${isExpanded ? 'h-auto' : 'h-[112px]'}`} style={{ alignSelf: 'stretch', marginTop: '22.5px' }}>
                                        <div className="flex justify-between items-center h-[86px] w-full relative">
                                            {/* Scrollable icons area - exact width to show 3 icons */}
                                            <div style={{ width: '331px', position: 'relative' }}>
                                                <div ref={scrollRef} className="relative flex overflow-x-auto items-center gap-6 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', paddingRight: '56px', width: '289px' }}>
                                                    {artists.map((artist, idx) => (
                                                        <div
                                                            key={artist.id}
                                                            ref={el => (iconRefs.current[idx] = el)}
                                                            onClick={() => {
                                                                setSelectedArtistIndex(idx);
                                                                iconRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                                                                updateIndicator(idx);
                                                            }}
                                                            className="flex flex-col items-center justify-center cursor-pointer"
                                                            style={{ minWidth: '84px', height: '86px', position: 'relative', marginLeft: idx===0 ? '25px' : '0' }}>
                                                            <div className="h-[52px] w-[52px] rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
                                                                <img src={artist.img} alt={artist.name} className="h-full w-full object-cover" />
                                                            </div>

                                                            <div style={{ marginTop: '8px', marginBottom: '15.5px', width: '84px' }}>
                                                                <span className="text-[16px] leading-[20px] text-center text-white block whitespace-nowrap" style={{ fontFamily: 'Manrope', fontWeight: 500, letterSpacing: '0.0625em' }}>
                                                                    {artist.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {isExpanded && (
                                                        <div className="absolute bottom-0 transition-all duration-300" style={{ left: indicatorLeft, transform: 'translateX(-50%)', width: '93px', height: '4px', backgroundColor: '#1affec' }} />
                                                    )}
                                                </div>

                                            </div>
                                            {isExpanded && (
                                            <div className="absolute bottom-0" style={{ left: 25, width: 289, height: '1px', backgroundColor: '#1affec', opacity: 0.3 }} />
                                        )}

                                            {/* Static dropdown circle button - outside scroll area */}
                                            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div onClick={() => setIsExpanded(!isExpanded)} className="h-[32px] w-[32px] flex flex-col justify-center items-center bg-[#0d7377] rounded-full">
                                                    {isExpanded ? <CaretUp size={24} weight="bold" color="#14ffec"/> : <CaretDown size={24} weight="bold" color="#14ffec"/>}
                                                </div>
                                            </div>
                                        </div>
                                    {isExpanded && (
                                        <>
                                        <div className="flex justify-between items-center" style={{ paddingLeft: '25px' }}>
                                            <div className="flex justify-center items-center gap-1.5 bg-[#0d7377] px-[15px] py-2 rounded-[25px] border border-solid border-[#14ffec]">
                                                <span className="font-semibold text-[16px] leading-[16px] text-white">About Artist</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <InstagramLogo size={36} weight="fill" color="#0d7377" />
                                                <SpotifyLogo size={36} weight="fill" color="#0d7377" />
                                            </div>
                                        </div>
                                        <div style={{ paddingLeft: '25px', paddingRight: '25px', paddingTop: '14px' }}>
                                            <span className="font-normal text-[16px] leading-[20px] text-white" style={{ fontFamily: 'Manrope' }}>
                                                {artists[selectedArtistIndex].description}
                                            </span>
                                        </div>
                                        <GenreTags genres={artists[selectedArtistIndex].genres} />
                                        </>
                                    )}
                                    </div>

                    {/* Divider below artist tab */}
                    <div className="flex justify-center" style={{ paddingTop: '20px' }}>
                        <div className="h-[1px] w-[398px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                    </div>

                    {/* Event Details heading */}
                    <div style={{ paddingTop: '25px', paddingLeft: '15px' }}>
                        <span
                            className="font-semibold text-[16px] leading-[20px] text-white"
                            style={{
                                fontFamily: 'Manrope',
                                fontWeight: 600,
                                fontSize: '16px',
                                letterSpacing: '0.0625em',
                                lineHeight: '20px',
                                color: '#ffffff',
                            }}
                        >
                            Event Details
                        </span>
                    </div>

                    {/* Description toggle tab */}
                    <div className="flex justify-center" style={{ paddingTop: '20px' }}>
                        <div
                            className={`flex flex-col self-stretch w-full max-w-[398px] bg-[#0d1f1f] rounded-[20px] ${isDescExpanded ? '' : 'h-[76px]'}`}
                            style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '23px', paddingBottom: isDescExpanded ? '10px' : '0' }}
                        >
                            <div className="w-full flex items-center justify-between pl-[15px] pr-[15px]">
                                <span className="font-medium text-[16px] leading-[20px] text-white" style={{ fontFamily: 'Manrope', fontWeight: 500, letterSpacing: '0.0625em' }}>
                                    About this Event
                                </span>
                                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div onClick={() => setIsDescExpanded(!isDescExpanded)} className="h-[32px] w-[32px] flex flex-col justify-center items-center bg-[#0d7377] rounded-full">
                                        {isDescExpanded ? <CaretUp size={24} weight="bold" color="#14ffec"/> : <CaretDown size={24} weight="bold" color="#14ffec"/>}
                                    </div>
                                </div>
                            </div>

                            {isDescExpanded && (
                                <>
                                    {/* horizontal line spanning between text and button, keeping 15px side padding */}
                                    <div className="mt-[12px] relative">
                                        <div className="absolute left-[15px] right-[15px] h-[1px] bg-[#14ffec]" />
                                    </div>

                                    {/* paragraph container */}
                                    <div className="flex flex-col justify-center items-center gap-2.5 self-stretch" style={{ padding: '12px 15px 22px 15px' }}>
                                        <span className="font-normal text-[16px] leading-[20px] text-white">
                                            {eventData?.description || "Get ready for an electrifying night as Edward takes over DABO Nagpur on 15th February! Experience an exclusive sunset-to-sunrise techno journey in a breathtaking location.🎊\n\n\nLimited guests only! Secure your tickets now before they're gone!🎉🥂🍾🎊\n\n\n#TechnoVibes #DABO #Nagpurnightlife #SunsetToSunrise"}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Divider below description tab */}
                    <div className="flex justify-center" style={{ paddingTop: '20px' }}>
                        <div className="h-[1px] w-[398px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                    </div>

                    {/* Events organised heading */}
                    <div style={{ paddingTop: '25px', paddingLeft: '15px' }}>
                        <span
                            className="font-semibold text-[16px] leading-[20px] text-white"
                            style={{
                                fontFamily: 'Manrope',
                                fontWeight: 600,
                                fontSize: '16px',
                                letterSpacing: '0.0625em',
                                lineHeight: '20px',
                                color: '#ffffff',
                            }}
                        >
                            Events Organised & Presented by
                        </span>
                    </div>

                    {/* Organisers tab */}
                    <div className="flex justify-center pt-5 mb-[67px]">
                        <div className="flex items-center justify-around w-full max-w-[398px] bg-[#0d1f1f] rounded-[20px] border border-white/10 px-6 py-4">
                            {/* first organiser */}
                            <div className="flex items-center gap-3">
                                <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-white flex-shrink-0">
                                    <img src="/placeholder/image.png" alt="Team Events" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-medium text-[16px] leading-[20px] text-white max-w-[64px]" style={{ fontFamily: 'Manrope', letterSpacing: '0.02em' }}>
                                    Team Events
                                </span>
                            </div>
                            {/* second organiser */}
                            <div className="flex items-center gap-3">
                                <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-[#4a7c3f] flex-shrink-0">
                                    <img src="/placeholder/image.png" alt="Ark Events" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-medium text-[16px] leading-[20px] text-white max-w-[64px]" style={{ fontFamily: 'Manrope', letterSpacing: '0.02em' }}>
                                    Ark Events
                                </span>
                            </div>
                        </div>
                    </div>

                        {/* ...existing code... */}

                        {/* ...existing code... */}

                    {/* Registration Status Badge */}
                    {(eventData?.isRegistered || eventData?.rsvpStatus === 'REGISTERED') && (
                        <div className="flex justify-center mb-4">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs border border-green-500/30">
                                ✓ You are registered
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Action Button */}
                <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    <button
                        onClick={handleRegister}
                        disabled={isActionLoading}
                        className="pointer-events-auto shadow-lg shadow-[#14FFEC]/20 w-[430px] h-[56px] rounded-tl-[45px] rounded-tr-[45px] flex justify-center items-center text-[24px] leading-[21px] font-bold text-white transition-all active:scale-95 bg-gradient-to-r from-[#005D5C] to-[#14FFEC] bg-center bg-no-repeat bg-[length:200%_100%] hover:brightness-110 disabled:opacity-50"
                    >
                        {isActionLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            'Book Now'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

