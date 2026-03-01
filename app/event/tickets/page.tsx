'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    MapPin,
    Calendar,
    ChevronLeft,
    Minus,
    Plus,
    Loader2
} from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { EventService } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';
import { useEventDetail } from '@/lib/store';

function TicketsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Get eventId from URL params
    const eventId = searchParams.get('eventId') || '';

    // Use cached event data from the store
    const { event: cachedEventData, loading: eventLoading } = useEventDetail(eventId);

    const [activeTab, setActiveTab] = useState('early');
    const [tickets, setTickets] = useState({
        maleStag: 0,
        femaleStag: 0,
        couple: 0,
    });
    const [eventData, setEventData] = useState<any>(null);
    const [imageAllowed, setImageAllowed] = useState(false); // only render <img> when true
    const [ticketTypes, setTicketTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to get pricing for a specific ticket type
    const getTicketPrice = (type: 'maleStag' | 'femaleStag' | 'couple', category: 'early' | 'general') => {
        if (!ticketTypes || ticketTypes.length === 0) {
            // Fallback to default prices if no ticket types are available
            if (category === 'early') {
                return type === 'maleStag' ? { price: 1500, cover: 1000 } :
                    type === 'femaleStag' ? { price: 0, cover: 0, isFree: true } :
                        { price: 0, cover: 0, isFree: true };
            } else {
                return type === 'maleStag' ? { price: 2000, cover: 1000 } :
                    type === 'femaleStag' ? { price: 2000, cover: 1000 } :
                        { price: 2000, cover: 1000 };
            }
        }

        // Map type and category to ticket name
        const ticketNameMap: Record<string, string> = {
            'maleStag-early': 'Early Bird Male Stag',
            'femaleStag-early': 'Early Bird Female Stag',
            'couple-early': 'Early Bird Couple',
            'maleStag-general': 'General Male Stag',
            'femaleStag-general': 'General Female Stag',
            'couple-general': 'General Couple',
        };

        const ticketName = ticketNameMap[`${type}-${category}`];
        const ticketType = ticketTypes.find(t =>
            t.name && t.name.toLowerCase().includes(type.toLowerCase()) &&
            t.name.toLowerCase().includes(category)
        ) || ticketTypes.find(t => t.name === ticketName);

        if (ticketType) {
            return {
                price: ticketType.price || 0,
                cover: ticketType.coverCharge || 0,
                isFree: ticketType.price === 0 || ticketType.price === null
            };
        }

        // Fallback prices
        return category === 'early'
            ? (type === 'maleStag' ? { price: 1500, cover: 1000 } : { price: 0, cover: 0, isFree: true })
            : { price: 2000, cover: 1000 };
    };

    // Format price text
    const formatPriceText = (pricing: { price: number; cover?: number; isFree?: boolean }) => {
        if (pricing.isFree) return 'Free Entry';
        if (pricing.cover && pricing.cover > 0) {
            return `Rs ${pricing.price} (Cover - ${pricing.cover})`;
        }
        return `Rs ${pricing.price}`;
    };

    // Format and set event data when cached data is available
    useEffect(() => {
        if (cachedEventData) {
            // log raw payload so we can inspect exactly what the server returns
            console.log('raw cachedEventData for event', cachedEventData.id, cachedEventData);

            // Format the event data for display
            // helper to weed out colour codes, anchors, and other junk that may
            // come back in the imageUrl field from the API. The booking page has
            // historically shown a solid green rectangle whenever there was no
            // real photo – that green block is simply the placeholder image we
            // ship in `/public/event list/Rectangle 1.jpg`.
            // placeholder pattern used across the app; always reject these so
            // they don't cause a green block to render. Backend sometimes sends
            // this same string back as `imageUrl` which fooled previous logic.
            // detect our hard‑coded placeholder reference; it may appear
            // inside a full URL and the space can be encoded as %20.
            const placeholderPattern = /\/event(?:%20|\s)list\//i;

            const isValidUrl = (val: any) => {
                if (typeof val !== 'string' || !val) return false;
                const v = val.trim();
                if (!v) return false;
                if (placeholderPattern.test(v)) return false;
                if (v.startsWith('#')) return false;      // colour codes
                if (v.startsWith('data:')) return true;   // allow data URIs
                return v.includes('.') || v.startsWith('/') || v.startsWith('http');
            };

            let imgSrc = '';
            let usedFallback = false;

            if (isValidUrl(cachedEventData.imageUrl)) {
                imgSrc = cachedEventData.imageUrl.trim();
            } else {
                console.warn('event has invalid or missing imageUrl', cachedEventData.id, cachedEventData.imageUrl);
            }

            if (!imgSrc && Array.isArray(cachedEventData.images)) {
                const found = cachedEventData.images.find(isValidUrl);
                if (found) {
                    imgSrc = found.trim();
                } else {
                    console.warn('no valid image in images array', cachedEventData.id, cachedEventData.images);
                }
            }

            if (!imgSrc && isValidUrl(cachedEventData.club?.logo)) {
                imgSrc = (cachedEventData.club?.logo || '').trim();
            }

            // if we ended up accidentally picking a placeholder path earlier,
            // wipe it out and fall through to normal fallback.
            if (imgSrc && placeholderPattern.test(imgSrc)) {
                console.warn('discarding placeholder image from event data', cachedEventData.id, imgSrc);
                imgSrc = '';
            }

            if (!imgSrc) {
                console.warn('falling back to placeholder for event', cachedEventData.id);
                // we still set the fallback string because other parts of the code
                // might rely on eventData.imageUrl having *something*, but we'll
                // later use `usedFallbackImage` to avoid rendering an <img>.
                imgSrc = '/event list/Rectangle 1.jpg';
                usedFallback = true;
            }

            const formattedEventData = {
                id: cachedEventData.id,
                title: cachedEventData.title || 'Event',
                venue: cachedEventData.location || cachedEventData.club?.name || 'Venue',
                clubName: cachedEventData.club?.name || '',
                date: cachedEventData.formattedDate || cachedEventData.startDateTime || 'Date',
                time: cachedEventData.formattedTime || cachedEventData.startDateTime || 'Time',
                // if we're showing the dark fallback we don't want any image
                // fields pointing at the placeholder.
                image: usedFallback ? '' : imgSrc,
                imageUrl: usedFallback ? '' : imgSrc,
                usedFallbackImage: usedFallback,
                description: cachedEventData.description || '',
                startDateTime: cachedEventData.startDateTime,
                endDateTime: cachedEventData.endDateTime,
                club: cachedEventData.club,
                ticketTypes: cachedEventData.ticketTypes || []
            };

            console.log('formattedEventData for booking page', formattedEventData);
            setEventData(formattedEventData);
            setImageAllowed(false);
            // after setting, we'll run a content check below via another effect

            // Extract ticket types if available
            if (cachedEventData.ticketTypes && Array.isArray(cachedEventData.ticketTypes)) {
                setTicketTypes(cachedEventData.ticketTypes);
            }

            setLoading(false);
        }
    }, [cachedEventData]);

    useEffect(() => {
        if (!eventId) {
            toast({
                title: 'Error',
                description: 'Event ID is missing',
                variant: 'destructive',
            });
            router.push('/home');
        }
    }, [eventId]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    // check actual image contents for solid green or other placeholder colours
    const checkImageContent = (url: string): Promise<boolean> => {
        return new Promise(resolve => {
            const img = new Image();
            // crossOrigin allows pixel read on same‑origin or permissive CORS;
            // if it fails we simply won't be able to read pixels and we treat the
            // image as acceptable rather than rejecting it.
            img.crossOrigin = 'anonymous';
            img.src = url;
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        // can't draw – assume it's fine
                        resolve(false);
                        return;
                    }
                    ctx.drawImage(img, 0, 0);
                    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    let r = 0, g = 0, b = 0, count = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                    r /= count; g /= count; b /= count;
                    // if the average colour is largely green and very low red/blue,
                    // treat as placeholder
                    const greenish = g > 180 && r < 80 && b < 80;
                    resolve(greenish);
                } catch (e) {
                    // usually a CORS error – just consider the image usable
                    console.warn('image content check failed (maybe CORS)', e);
                    resolve(false);
                }
            };
            img.onerror = () => {
                // network load failed, but that's not a green placeholder – just
                // allow the image element to try and render (it will show broken
                // icon if actually missing)
                resolve(false);
            };
        });
    };

    useEffect(() => {
        if (eventData) {
            if (eventData.image && !eventData.usedFallbackImage) {
                checkImageContent(eventData.image).then(isGreen => {
                    console.log('checkImageContent result', eventData.id, eventData.image, isGreen);
                    if (isGreen) {
                        console.warn('detected green placeholder image content for', eventData.id);
                        setEventData(prev => prev ? { ...prev, usedFallbackImage: true, image: '', imageUrl: '' } : prev);
                        setImageAllowed(false);
                    } else {
                        setImageAllowed(true);
                    }
                });
            } else {
                setImageAllowed(false);
            }
        }
    }, [eventData]);

    const updateTicketCount = (type: 'maleStag' | 'femaleStag' | 'couple', action: 'increment' | 'decrement') => {
        setTickets(prev => {
            const currentValue = prev[type];
            if (action === 'decrement' && currentValue > 0) {
                return { ...prev, [type]: currentValue - 1 };
            } else if (action === 'increment') {
                return { ...prev, [type]: currentValue + 1 };
            }
            return prev;
        });
    };

    const handleProceedToPay = () => {
        // Calculate total tickets
        const totalTickets = tickets.maleStag + tickets.femaleStag + tickets.couple;

        if (totalTickets === 0) {
            toast({
                title: 'No tickets selected',
                description: 'Please select at least one ticket',
                variant: 'destructive',
            });
            return;
        }

        // Get user contact info from localStorage
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('clubviz-user') : null;
        let contactInfo = {
            maleName: 'Guest',
            phone: '',
            email: ''
        };

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                contactInfo = {
                    maleName: user.username || user.name || user.fullName || 'Guest',
                    phone: user.phoneNumber || user.mobileNumber || user.mobile || '',
                    email: user.email || ''
                };
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        // Store booking data directly with contact info from localStorage
        const bookingData = {
            eventId: eventId,
            ticketType: activeTab,
            maleStag: tickets.maleStag,
            femaleStag: tickets.femaleStag,
            couple: tickets.couple,
            maleName: contactInfo.maleName,
            femaleName: 'Sammy Simon',
            stagName: contactInfo.maleName,
            phone: contactInfo.phone,
            email: contactInfo.email,
            eventData: eventData
        };

        // Store in sessionStorage for review page
        sessionStorage.setItem('eventBookingData', JSON.stringify(bookingData));
        sessionStorage.setItem('currentEventData', JSON.stringify(eventData));

        // Go directly to review booking page
        router.push(`/event/review-booking`);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative">
            {/* Hero Section with Event Image */}
            <div className="relative h-[320px] w-full">
                {/* always draw a dark background, image sits on top */}
            <div className="absolute inset-0 bg-[#021313]" />
            {eventData && !eventData.usedFallbackImage && imageAllowed && (eventData.imageUrl || eventData.image) && (
                <img
                    src={eventData.imageUrl || eventData.image}
                    alt={eventData?.title || "Event"}
                    className="w-full h-full object-cover brightness-90"
                    onError={e => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                    }}
                />
            )}

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                </div>

            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-[#000000] rounded-t-[40px] -mt-20 relative z-10 pt-4 pb-8">
                <h1 className="text-center text-white text-2xl font-['Anton'] tracking-[2.4px] leading-8">
                    {eventData?.title || "Event"}
                </h1>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Event Details */}
                <div className="px-9 flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-3">
                        <MapPin size={24} className="text-[#14FFEC]" />
                        <p className="text-white font-['Manrope'] font-bold">
                            {eventData?.venue || 'Venue'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar size={24} className="text-[#14FFEC]" />
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">
                                {eventData?.date || 'Date'} | {eventData?.time || 'Time'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6"></div>
            </div>
            {/* Bottom Section with Ticket Selection */}
            <div className="w-full rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] z-20 -mt-8 pb-32">
                <div className="px-6 pt-8">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-3">SELECT YOUR ENTRY TICKETS</h2>

                    {/* Tab Selection */}
                    <div className="flex mb-3">
                        <button
                            onClick={() => handleTabChange('early')}
                            className={`flex-1 py-2 rounded-t-[45px] text-white font-['Manrope'] font-semibold text-center ${activeTab === 'early'
                                ? 'bg-[radial-gradient(ellipse_at_center_bottom,_var(--tw-gradient-stops))] from-[#003D3C] to-[#01807E]'
                                : 'bg-[#37484D]'
                                }`}
                        >
                            Early bird Tickets
                        </button>
                        <button
                            onClick={() => handleTabChange('general')}
                            className={`flex-1 py-2 rounded-t-[30px] text-white font-['Manrope'] font-semibold text-center ${activeTab === 'general'
                                ? 'bg-[radial-gradient(ellipse_at_center_bottom,_var(--tw-gradient-stops))] from-[#003D3C] to-[#01807E]'
                                : 'bg-[#37484D]'
                                }`}
                        >
                            General Tickets
                        </button>
                    </div>

                    {/* Ticket Selection - Early Bird Tab */}
                    <div className={activeTab === 'early' ? 'block' : 'hidden'}>
                        {/* Male Stag Entry */}
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Male Stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('maleStag', 'early'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.maleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Female stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('femaleStag', 'early'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.femaleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-medium">Couple Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('couple', 'early'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('couple', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.couple}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('couple', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-medium">Early birds couple entry</p>
                        </div>
                    </div>

                    {/* Ticket Selection - General Tab */}
                    <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                        {/* Male Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Male Stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('maleStag', 'general'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.maleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('maleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Female stag Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('femaleStag', 'general'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.femaleStag}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('femaleStag', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex flex-col gap-3 mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-['Manrope'] font-semibold">Couple Entry</p>
                                    <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('couple', 'general'))}</p>
                                </div>
                                <div className="bg-[#313131] rounded-[22px] px-3 py-1 flex items-center">
                                    <button
                                        onClick={() => updateTicketCount('couple', 'decrement')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Minus size={14} className="text-black" />
                                    </button>
                                    <div className="w-7 h-7 mx-2 bg-[#14FFEC] rounded-lg flex items-center justify-center">
                                        <span className="text-black font-medium">{tickets.couple}</span>
                                    </div>
                                    <button
                                        onClick={() => updateTicketCount('couple', 'increment')}
                                        className="w-6 h-6 bg-[#14FFEC] rounded-full flex items-center justify-center"
                                    >
                                        <Plus size={14} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-['Manrope'] font-semibold">Early birds couple entry</p>
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="mt-8">
                    <BottomContinueButton
                        text="Next"
                        onClick={handleProceedToPay}
                    />
                </div>
            </div>
        </div>
    );
}

export default function TicketsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <TicketsPageContent />
        </Suspense>
    );
}
