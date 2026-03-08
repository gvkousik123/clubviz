'use client';

import React, { useState, useEffect, Suspense } from 'react';

const slideStyles = `
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px) translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
  }
  @keyframes fadeSlideDown {
    from {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px) translateX(30px);
    }
  }
  .slide-in {
    will-change: transform, opacity;
    animation: fadeSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .slide-out {
    will-change: transform, opacity;
    animation: fadeSlideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  @keyframes tabSlideInFromRight {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes tabSlideInFromLeft {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .tab-slide-from-right {
    will-change: transform, opacity;
    animation: tabSlideInFromRight 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  .tab-slide-from-left {
    will-change: transform, opacity;
    animation: tabSlideInFromLeft 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;
import { useRouter, useSearchParams } from 'next/navigation';
import {
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
    const [tabDirection, setTabDirection] = useState<'left' | 'right'>('right');
    const [tabKey, setTabKey] = useState(0);
    const [tickets, setTickets] = useState({
        maleStag: 0,
        femaleStag: 0,
        couple: 0,
    });
    const [eventData, setEventData] = useState<any>(null);
    const [imageAllowed, setImageAllowed] = useState(false); // only render <img> when true
    const [ticketTypes, setTicketTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

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
        if (tab === activeTab) return;
        // early→general = slide left (from right); general→early = slide right (from left)
        setTabDirection(tab === 'general' ? 'right' : 'left');
        setTabKey(k => k + 1);
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

    const handleProceedToPay = async () => {
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

        setIsActionLoading(true);

        try {
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
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    return (
        <>
        <style>{slideStyles}</style>
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
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-4 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition z-10"
                >
                    <ChevronLeft className="h-5 w-5 text-white" />
                </button>

            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-black rounded-tl-[60px] rounded-tr-[60px] -mt-20 relative z-10 pt-4 pb-8">
                <h1 className="text-center text-white text-2xl font-['Anton_SC',sans-serif] tracking-[2.4px] leading-8">
                    {eventData?.title || "Event"}
                </h1>

                {/* Separator Line */}
                <div style={{ 
                    width: '316px', 
                    margin: '18.5px auto 0 auto',
                    borderTop: '2px solid #14FFEC'
                }}></div>

                {/* Event Details */}
                {/* Address line below icons */}
                <div
                    className="flex items-center"
                    style={{ paddingTop: '15px', paddingLeft: '43px' }}
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
                        {eventData?.venue || 'Location TBD'}
                    </span>
                </div>

                {/* Date/time card beside calendar icon, only date/time inside card */}
                <div className="flex items-center" style={{ marginTop: '23.5px', paddingLeft: '43px' }}>
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
                                : eventData?.date + ' | ' + eventData?.time
                            }
                        </span>
                    </div>
                </div>
            </div>
            {/* Bottom Section with Ticket Selection */}
            <div className="w-full overflow-hidden rounded-t-[60px] border border-[#0C898B] border-b-0 bg-gradient-to-b from-[#041d1d] via-[#031919] to-black z-20 pb-32">
                <div className="px-6 pt-8">
                    <div className="text-center mb-3">
                        <span className="font-bold text-[16px] leading-[20px] text-white tracking-[0.0625em] font-['Manrope']">SELECT YOUR ENTRY TICKETS</span>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex items-end justify-center mb-3 gap-0">
                        <button
                            onClick={() => handleTabChange('early')}
                            className={`flex items-center justify-center font-['Manrope'] font-semibold text-[16px] leading-[20px] text-white transition-all duration-200 ease-out ${activeTab === 'early'
                                ? 'w-[184px] h-10 rounded-tl-[45px] rounded-tr-[45px] bg-[radial-gradient(100%_100%_at_50%_100%,#003D3C_0%,#01807E_100%)]'
                                : 'w-[183px] h-[31.999998092651367px] rounded-tl-[30px] rounded-tr-[30px] bg-[#37484d]'
                                }`}
                        >
                            <span className="font-semibold text-[16px] leading-[20px] text-white">Early bird Tickets</span>
                        </button>
                        <button
                            onClick={() => handleTabChange('general')}
                            className={`flex items-center justify-center font-['Manrope'] font-semibold text-[16px] leading-[20px] text-white transition-all duration-200 ease-out ${activeTab === 'general'
                                ? 'w-[184px] h-10 rounded-tl-[45px] rounded-tr-[45px] bg-[radial-gradient(100%_100%_at_50%_100%,#003D3C_0%,#01807E_100%)]'
                                : 'w-[183px] h-[31.999998092651367px] rounded-tl-[30px] rounded-tr-[30px] bg-[#37484d]'
                                }`}
                        >
                            <span className="font-semibold text-[16px] leading-[20px] text-white">General Tickets</span>
                        </button>
                    </div>

                    {/* Ticket Selection - Early Bird Tab */}
                    <div
                        key={activeTab === 'early' ? `early-${tabKey}` : 'early-hidden'}
                        className={activeTab === 'early' ? (tabDirection === 'left' ? 'tab-slide-from-left' : 'tab-slide-from-right') : ''}
                        style={{ display: activeTab === 'early' ? 'block' : 'none', overflow: 'hidden' }}
                    >
                        {/* Male Stag Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-medium">Male Stag Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('maleStag', 'early'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-medium">Female stag Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('femaleStag', 'early'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-medium">Couple Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-medium">{formatPriceText(getTicketPrice('couple', 'early'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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
                    </div>

                    {/* Ticket Selection - General Tab */}
                    <div
                        key={activeTab === 'general' ? `general-${tabKey}` : 'general-hidden'}
                        className={activeTab === 'general' ? (tabDirection === 'right' ? 'tab-slide-from-right' : 'tab-slide-from-left') : ''}
                        style={{ display: activeTab === 'general' ? 'block' : 'none', overflow: 'hidden' }}
                    >
                        {/* Male Stag Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-semibold">Male Stag Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('maleStag', 'general'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Female Stag Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-semibold">Female stag Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('femaleStag', 'general'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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

                        {/* Separator Line */}
                        <div className="flex justify-center my-3">
                            <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                        </div>

                        {/* Couple Entry */}
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-white font-['Manrope'] font-semibold">Couple Entry</p>
                                <p className="text-[#14FFEC] font-['Manrope'] font-semibold">{formatPriceText(getTicketPrice('couple', 'general'))}</p>
                                <p className="text-white/60 font-['Manrope'] text-sm mt-0.5">Early birds couple entry</p>
                            </div>
                            <div className="bg-[#313131] rounded-[22px] px-4 py-2 flex items-center">
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
                    </div>
                </div>

                {/* Spacer for fixed button */}
                <div className="h-2"></div>
            </div>

            {/* Fixed Next Button at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none py-0 px-0 bg-gradient-to-t from-black via-black/95 to-transparent">
                <button
                    onClick={handleProceedToPay}
                    disabled={isActionLoading}
                    className="pointer-events-auto shadow-lg shadow-[#14FFEC]/20 w-[430px] h-[56px] rounded-tl-[45px] rounded-tr-[45px] flex justify-center items-center text-[24px] leading-[21px] font-bold text-white transition-all active:scale-95 bg-gradient-to-r from-[#005D5C] to-[#14FFEC] bg-center bg-no-repeat bg-[length:200%_100%] hover:brightness-110 disabled:opacity-50 mb-0"
                >
                    {isActionLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        'Proceed To Pay'
                    )}
                </button>
            </div>
        </div>
        </>
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
