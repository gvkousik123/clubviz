'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Menu,
    MapPin,
    User,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Heart,
    Bookmark,
    Phone,
    MessageCircle,
    Instagram,
    Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SidebarMenu from '@/components/ui/sidebar-menu';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { ClubVizLogo } from '@/components/auth/logo';
import { ClubService } from '@/lib/services/club.service';
import { EventService } from '@/lib/services/event.service';
import { Club, Event } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';
import { resolveLocation } from '@/lib/location';

const heroSlides = [
    {
        id: 1,
        image: '/event list/Rectangle 1.jpg',
        musicBy: 'DJ MARTIN',
        hostedBy: 'DJ AMIL',
        sponsor: 'SPONSORED',
        bookingLink: '/booking',
    },
    {
        id: 2,
        image: '/event list/Rectangle 2.jpg',
        musicBy: 'DJ ALEXXX',
        hostedBy: 'CLUB ELITE',
        sponsor: 'FEATURED',
        bookingLink: '/booking',
    },
    {
        id: 3,
        image: '/event list/Rectangle 3.jpg',
        musicBy: 'DJ SHADE',
        hostedBy: 'GARAGE CLUB',
        sponsor: 'TRENDING',
        bookingLink: '/booking',
    },
];

type HeroSlide = (typeof heroSlides)[number];

const vibeMeterFallback = [
    { id: 'dabo', name: 'DABO', image: '/dabo ambience main dabo page/Media.jpg' },
    { id: 'elite', name: 'Elite', image: '/gallery/Frame 1000001117.jpg' },
    { id: 'escape', name: 'Escape', image: '/gallery/Frame 1000001119.jpg' },
    { id: 'nitro', name: 'Nitro', image: '/gallery/Frame 1000001120.jpg' },
    { id: 'garage', name: 'Garage', image: '/gallery/Frame 1000001121.jpg' },
];

const venueFallback = [
    {
        id: 'venue-1',
        name: 'DABO',
        openTime: 'Open until 1:30 am',
        rating: 4.2,
        image: '/dabo ambience main dabo page/Media-1.jpg',
    },
    {
        id: 'venue-2',
        name: 'Garage',
        openTime: 'Open until 2:00 am',
        rating: 4.5,
        image: '/gallery/Frame 1000001123.jpg',
    },
    {
        id: 'venue-3',
        name: 'Escape',
        openTime: 'Open until 12:30 am',
        rating: 4.3,
        image: '/gallery/Frame 1000001120.jpg',
    },
];

const eventFallback = [
    {
        id: 'event-1',
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO, Airport Road',
        startDateTime: new Date('2025-04-04T19:30:00Z').toISOString(),
        category: 'Techno & Bollytech',
        image: '/event list/Rectangle 12249.jpg',
    },
    {
        id: 'event-2',
        title: 'Wow Wednesday with DJ Shade',
        venue: 'DABO, Airport Road',
        startDateTime: new Date('2025-04-06T19:30:00Z').toISOString(),
        category: 'Bollywood & Bollytech',
        image: '/event list/Rectangle 1.jpg',
    },
];

type DisplayClub = Club | (typeof venueFallback)[number];
type DisplayEvent = Event | (typeof eventFallback)[number];

const getClubImage = (club: DisplayClub) => {
    if ('images' in club && Array.isArray(club.images) && club.images.length > 0) {
        return club.images[0];
    }
    if ('image' in club) {
        return club.image;
    }
    return '/gallery/Frame 1000001117.jpg';
};

const getClubOpenInfo = (club: DisplayClub) => {
    if ('openingHours' in club && Array.isArray(club.openingHours) && club.openingHours.length > 0) {
        const closing = club.openingHours[0]?.closeTime;
        if (closing) {
            return `Open until ${closing}`;
        }
    }
    if ('openTime' in club) {
        return club.openTime;
    }
    return 'Open till late';
};

const getClubRating = (club: DisplayClub) => {
    if ('rating' in club && typeof club.rating === 'number') {
        return club.rating;
    }
    return 4.2;
};

const getEventImage = (event: DisplayEvent) => {
    if ('images' in event && Array.isArray(event.images) && event.images.length > 0) {
        return event.images[0];
    }
    if ('coverImage' in event && event.coverImage) {
        return event.coverImage;
    }
    if ('image' in event) {
        return event.image;
    }
    return '/gallery/Frame 1000001120.jpg';
};

const getEventVenue = (event: DisplayEvent) => {
    if ('club' in event && event.club) {
        return event.club.name;
    }
    if ('venue' in event) {
        return event.venue;
    }
    return 'Club Venue';
};

const getEventGenres = (event: DisplayEvent) => {
    if ('musicGenres' in event && Array.isArray(event.musicGenres) && event.musicGenres.length > 0) {
        return event.musicGenres.join(', ');
    }
    if ('category' in event && event.category) {
        return event.category;
    }
    return 'Club Night';
};

const getEventMonth = (date: string | undefined) => {
    if (!date) return 'APR';
    try {
        return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    } catch (error) {
        return 'APR';
    }
};

const getEventDay = (date: string | undefined) => {
    if (!date) return '04';
    try {
        return new Date(date).getDate().toString().padStart(2, '0');
    } catch (error) {
        return '04';
    }
};

const HomePage: React.FC = () => {
    const router = useRouter();
    const transitionDuration = 500;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const slides = useMemo<Array<HeroSlide & { key: string }>>(() => {
        if (heroSlides.length <= 1) {
            return heroSlides.map((slide) => ({ ...slide, key: `slide-${slide.id}` }));
        }

        const firstSlide = heroSlides[0];
        const lastSlide = heroSlides[heroSlides.length - 1];

        return [
            { ...lastSlide, key: `clone-start-${lastSlide.id}` },
            ...heroSlides.map((slide) => ({ ...slide, key: `slide-${slide.id}` })),
            { ...firstSlide, key: `clone-end-${firstSlide.id}` },
        ];
    }, []);

    const hasMultipleSlides = heroSlides.length > 1;

    const [currentSlide, setCurrentSlide] = useState(hasMultipleSlides ? 1 : 0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
    const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const venueScrollRef = useDragScroll();
    const eventScrollRef = useDragScroll();

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const location = resolveLocation();
                const clubsPromise = ClubService.getClubs({
                    page: 1,
                    limit: 20,
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        radius: location.radius ?? 15,
                    },
                });

                const eventsPromise = EventService.getEvents({
                    page: 1,
                    size: 20,
                });

                const [featuredClubsResponse, featuredEventsResponse, clubsResponse, eventsResponse] = await Promise.all([
                    ClubService.getFeaturedClubs(10),
                    EventService.getFeaturedEvents(10),
                    clubsPromise,
                    eventsPromise,
                ]);

                if (featuredClubsResponse.success && featuredClubsResponse.data) {
                    setFeaturedClubs(featuredClubsResponse.data);
                }

                if (clubsResponse.success && clubsResponse.data) {
                    setClubs(clubsResponse.data.clubs);
                }

                if (featuredEventsResponse.success && featuredEventsResponse.data) {
                    setEvents(featuredEventsResponse.data);
                } else if (eventsResponse.success && eventsResponse.data) {
                    setEvents(eventsResponse.data.events);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load home data. Please refresh the page.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    useEffect(() => {
        if (!hasMultipleSlides || isAutoScrollPaused) {
            return;
        }

        const interval = setInterval(() => {
            setIsTransitionEnabled(true);
            setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
        }, 4500);

        return () => clearInterval(interval);
    }, [hasMultipleSlides, isAutoScrollPaused, slides.length]);

    const clearPauseTimeout = useCallback(() => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
            pauseTimeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearPauseTimeout();
    }, [clearPauseTimeout]);

    const triggerAutoPause = useCallback(() => {
        if (!hasMultipleSlides) {
            return;
        }
        clearPauseTimeout();
        setIsAutoScrollPaused(true);
        pauseTimeoutRef.current = setTimeout(() => {
            setIsAutoScrollPaused(false);
            pauseTimeoutRef.current = null;
        }, 6000);
    }, [clearPauseTimeout, hasMultipleSlides]);

    const handlePrevSlide = useCallback(() => {
        if (!hasMultipleSlides) {
            return;
        }
        triggerAutoPause();
        setIsTransitionEnabled(true);
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }, [hasMultipleSlides, triggerAutoPause]);

    const handleNextSlide = useCallback(() => {
        if (!hasMultipleSlides) {
            return;
        }
        triggerAutoPause();
        setIsTransitionEnabled(true);
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    }, [hasMultipleSlides, triggerAutoPause, slides.length]);

    const handleHeroPause = useCallback(() => {
        triggerAutoPause();
    }, [triggerAutoPause]);

    const resumeAutoScroll = useCallback(() => {
        clearPauseTimeout();
        setIsAutoScrollPaused(false);
    }, [clearPauseTimeout]);

    const handleIndicatorClick = useCallback(
        (index: number) => {
            if (hasMultipleSlides) {
                triggerAutoPause();
                setIsTransitionEnabled(true);
                setCurrentSlide(index + 1);
            } else {
                setCurrentSlide(index);
            }
        },
        [hasMultipleSlides, triggerAutoPause]
    );

    useEffect(() => {
        if (!hasMultipleSlides) {
            return;
        }

        if (currentSlide === slides.length - 1) {
            const timeout = setTimeout(() => {
                setIsTransitionEnabled(false);
                setCurrentSlide(1);
            }, transitionDuration);
            return () => clearTimeout(timeout);
        }

        if (currentSlide === 0) {
            const timeout = setTimeout(() => {
                setIsTransitionEnabled(false);
                setCurrentSlide(slides.length - 2);
            }, transitionDuration);
            return () => clearTimeout(timeout);
        }

        if (!isTransitionEnabled) {
            const frame = requestAnimationFrame(() => setIsTransitionEnabled(true));
            return () => cancelAnimationFrame(frame);
        }
    }, [currentSlide, hasMultipleSlides, slides.length, transitionDuration, isTransitionEnabled]);

    const handleVibeMeterClick = (clubId: string) => {
        router.push(`/story?clubId=${clubId}`);
    };

    const displayClubs = clubs.length ? clubs : venueFallback;
    const displayEvents = events.length ? events : eventFallback;
    const displayVibeMeter = (featuredClubs.length ? featuredClubs : vibeMeterFallback).slice(0, 6);

    const activeIndicatorIndex = useMemo(() => {
        if (!hasMultipleSlides) {
            return currentSlide;
        }
        const total = heroSlides.length;
        return ((currentSlide - 1 + total) % total + total) % total;
    }, [currentSlide, hasMultipleSlides]);

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[428px] pb-24">
                <div className="pointer-events-none absolute -top-48 right-[-180px] h-[360px] w-[360px] rounded-full bg-[#0891b2]/25 blur-[140px]" aria-hidden />
                <div className="pointer-events-none absolute top-[420px] left-[-220px] h-[320px] w-[320px] rounded-full bg-[#14b8a6]/20 blur-[140px]" aria-hidden />

                <header className="relative header-gradient rounded-b-[36px] px-5 pb-10 pt-12 shadow-[0px_32px_80px_rgba(6,182,212,0.35)]">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/location/select"
                            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white"
                        >
                            <MapPin className="h-4 w-4" />
                            Dharampeth, Nagpur
                            <ChevronDown className="h-4 w-4 text-white/70" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-11 w-11 rounded-full border border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/20"
                                onClick={() => router.push('/account')}
                            >
                                <User className="h-5 w-5 text-white" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-11 w-11 rounded-full border border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/20"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                            <Input
                                placeholder="Search events, clubs, vibes..."
                                className="pill-input w-full pl-14 pr-6 text-base"
                            />
                        </div>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-11 w-11 rounded-full border border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/20"
                        >
                            <SlidersHorizontal className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </header>

                <main className="relative z-10 space-y-10 px-5 pt-10">
                    <section
                        className="relative overflow-hidden rounded-[30px] surface-card"
                        onMouseEnter={handleHeroPause}
                        onTouchStart={handleHeroPause}
                        onTouchEnd={resumeAutoScroll}
                        onTouchCancel={resumeAutoScroll}
                        onMouseLeave={resumeAutoScroll}
                    >
                        <div
                            className={`flex ${isTransitionEnabled ? 'transition-transform duration-500 ease-in-out' : ''}`}
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {slides.map((slide) => (
                                <article key={slide.key} className="relative h-[280px] w-full flex-shrink-0">
                                    <img
                                        src={slide.image}
                                        alt={slide.musicBy}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-[#031313]/95" />

                                    <div className="absolute left-5 top-5 flex items-center gap-2">
                                        <span className="badge-tag text-[10px] uppercase tracking-[0.3em]">{slide.sponsor}</span>
                                    </div>

                                    <div className="absolute bottom-8 left-6 right-6 space-y-4">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="space-y-2">
                                                <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Music by</p>
                                                <h2 className="text-[32px] font-extrabold leading-[1.1]">{slide.musicBy}</h2>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Hosted by</p>
                                                <h3 className="text-lg font-semibold">{slide.hostedBy}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Link href={slide.bookingLink}>
                                                <Button size="default" variant="primary" className="px-7 py-3 text-sm uppercase tracking-[0.2em]">
                                                    Book Now
                                                </Button>
                                            </Link>
                                            <div className="flex items-center gap-2 text-sm text-white/70">
                                                <div className="h-2 w-2 rounded-full bg-[#1db584]" />
                                                Live tonight
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-5">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full border border-white/15 bg-black/40 hover:bg-black/60"
                                onClick={handlePrevSlide}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                {heroSlides.map((slide, index) => (
                                    <button
                                        key={slide.id}
                                        className={`h-[6px] rounded-full transition-all duration-300 ${index === activeIndicatorIndex ? 'w-8 bg-white' : 'w-3 bg-white/40'
                                            }`}
                                        onClick={() => handleIndicatorClick(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full border border-white/15 bg-black/40 hover:bg-black/60"
                                onClick={handleNextSlide}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Vibe Meter</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <Link href="/story" className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                                View All
                            </Link>
                        </div>
                        <div className="mt-6 flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                            {displayVibeMeter.map((club, index) => (
                                <button
                                    key={club.id ?? `vibe-${index}`}
                                    onClick={() => handleVibeMeterClick(String(club.id ?? club.name))}
                                    className="group flex flex-col items-center"
                                >
                                    <div className="circle-glow mb-3 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-black/70 p-1">
                                        <div className="h-full w-full overflow-hidden rounded-full border border-[#14b8a6]">
                                            <img
                                                src={(club as Club).images?.[0] ?? (club as any).image}
                                                alt={club.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/60 group-hover:text-white">
                                        {club.name.length > 10 ? `${club.name.substring(0, 10)}…` : club.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Venue List</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <Link href="/clubs" className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                                View All
                            </Link>
                        </div>
                        <div ref={venueScrollRef} className="scrollbar-hide overflow-x-auto pb-1">
                            <div className="flex gap-5 pr-4" style={{ width: 'max-content' }}>
                                {loading
                                    ? Array.from({ length: 3 }).map((_, index) => (
                                        <div key={`venue-skeleton-${index}`} className="h-[260px] w-[300px] animate-pulse rounded-[28px] bg-white/5" />
                                    ))
                                    : displayClubs.slice(0, 6).map((club, index) => (
                                        <Link key={club.id ?? `venue-${index}`} href={`/club/${club.id ?? 'dabo'}`}>
                                            <article className="surface-panel relative h-[280px] w-[300px] overflow-hidden rounded-[28px] border border-white/10">
                                                <div className="relative h-[180px] overflow-hidden">
                                                    <img
                                                        src={getClubImage(club)}
                                                        alt={club.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-[#031313]/95" />
                                                    <div className="absolute left-4 top-4 flex items-center gap-2">
                                                        <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                                                            <Heart className="h-3 w-3" /> Live
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute right-4 top-4 h-10 w-10 rounded-full border border-white/10 bg-black/40 hover:bg-black/60"
                                                    >
                                                        <Bookmark className="h-4 w-4" />
                                                    </Button>
                                                    <div className="absolute -bottom-8 right-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/80 text-lg font-bold text-[#1db584] shadow-[0_16px_24px_rgba(3,19,19,0.6)]">
                                                        {getClubRating(club).toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="mt-10 space-y-1 px-5 pb-5">
                                                    <h4 className="text-xl font-semibold truncate">{club.name}</h4>
                                                    <p className="text-sm text-white/70 truncate">{getClubOpenInfo(club)}</p>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Event List</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <Link href="/events" className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                                View All
                            </Link>
                        </div>
                        <div ref={eventScrollRef} className="scrollbar-hide overflow-x-auto pb-1">
                            <div className="flex gap-5 pr-4" style={{ width: 'max-content' }}>
                                {loading
                                    ? Array.from({ length: 3 }).map((_, index) => (
                                        <div key={`event-skeleton-${index}`} className="h-[270px] w-[220px] animate-pulse rounded-[24px] bg-white/5" />
                                    ))
                                    : displayEvents.slice(0, 8).map((event, index) => (
                                        <Link key={event.id ?? `event-${index}`} href={`/event/${event.id ?? 'dabo'}`}>
                                            <article
                                                className="relative w-[220px] overflow-hidden rounded-[26px] border border-white/10"
                                                style={{
                                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                                                    background: 'rgba(14, 31, 31, 0.65)',
                                                }}
                                            >
                                                <div className="relative h-[200px] overflow-hidden">
                                                    <img
                                                        src={getEventImage(event)}
                                                        alt={event.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-[#031313]/95" />
                                                    <div className="absolute right-4 top-4 rounded-xl bg-gradient-to-b from-[#14b8a6] to-[#0891b2] px-3 py-2 text-center text-xs font-bold text-white">
                                                        <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">
                                                            {getEventMonth(event.startDateTime)}
                                                        </div>
                                                        <div className="text-base leading-none">{getEventDay(event.startDateTime)}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 px-4 pb-5 pt-4">
                                                    <div>
                                                        <h4 className="text-sm font-semibold leading-tight text-white">
                                                            {event.title}
                                                        </h4>
                                                        <p className="mt-2 text-xs text-white/60">{getEventVenue(event)}</p>
                                                    </div>
                                                    <div className="badge-tag" data-variant="primary">
                                                        {getEventGenres(event)}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white hover:bg-black/60"
                                                >
                                                    <Bookmark className="h-4 w-4" />
                                                </Button>
                                            </article>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="px-5 pb-16 pt-12">
                    <div className="text-center">
                        <ClubVizLogo size="sm" variant="full" />
                        <p className="mt-4 text-sm text-white/70">
                            Dive into the ultimate party scene. Discover lit club nights, epic events, and non-stop vibes all in one place!
                        </p>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                            <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                            <Instagram className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                            <Mail className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div className="mt-8 space-y-3 rounded-[26px] border border-white/10 bg-gradient-to-br from-[#0d9488]/30 to-[#0891b2]/20 p-6">
                        <div className="flex items-center gap-3 text-sm text-white/85">
                            <Phone className="h-4 w-4 text-cyan-300" />
                            contact@clubwiz.com
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/85">
                            <MapPin className="h-4 w-4 text-cyan-300" />
                            Location Details
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/85">
                            <MessageCircle className="h-4 w-4 text-cyan-300" />
                            Terms &amp; Conditions
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/85">
                            <Mail className="h-4 w-4 text-cyan-300" />
                            Privacy Policy
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-white/50">
                        Copyrights reserved with clubwiz.com
                    </p>
                </footer>

                <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
        </div>
    );
};

export default HomePage;
