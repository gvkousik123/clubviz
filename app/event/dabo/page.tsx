'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Share,
    Heart,
    MapPin,
    Star,
    Phone,
    Clock,
    Users,
    Wifi,
    Car,
    Wine,
    Music,
    Utensils,
    Calendar,
    Camera,
    ShieldCheck,
    Ticket,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type Offer = {
    icon: LucideIcon;
    title: string;
    description: string;
    accent?: 'teal' | 'purple';
};

type EntryOption = {
    label: string;
    price: string;
    cover: string;
    note: string;
};

type UpcomingEvent = {
    id: number;
    title: string;
    venue: string;
    date: string;
    month: string;
    category: string;
    image: string;
    slug: string;
};

type Review = {
    name: string;
    initial: string;
    rating: number;
    comment: string;
    timeAgo: string;
};

type AmenityGroup = {
    title: string;
    icon: LucideIcon;
    items: string[];
};

type FacilityChip = {
    icon: LucideIcon;
    label: string;
};

type QuickFact = {
    icon: LucideIcon;
    label: string;
};

const quickFacts: QuickFact[] = [
    { icon: MapPin, label: 'DABO Club & Kitchen • Airport Road' },
    { icon: Calendar, label: 'Friday • 04 Apr 2025' },
    { icon: Clock, label: '8:00 PM onwards' },
];

const vibeTags = ['Techno & Bollytech', 'Afrohouse Grooves', 'Live Percussion'];

const offers: Offer[] = [
    {
        icon: Wine,
        title: 'Buy 1 get 1 on premium IMFL',
        description: 'Available till 10:30 PM',
        accent: 'teal',
    },
    {
        icon: Clock,
        title: 'Free entry before 09:30 PM',
        description: 'Redeemable cover worth ₹1,000',
        accent: 'teal',
    },
    {
        icon: Sparkles,
        title: 'Ladies night perks',
        description: 'Complimentary welcome shots for first 50 guests',
        accent: 'purple',
    },
];

const entryOptions: EntryOption[] = [
    {
        label: 'Couple + group entry',
        price: '₹3,500',
        cover: 'Includes ₹2,000 cover',
        note: 'Redeem before 11:30 PM',
    },
    {
        label: 'Male stag entry',
        price: '₹2,200',
        cover: 'Includes ₹1,200 cover',
        note: 'Subject to profiling at door',
    },
    {
        label: 'Female stag entry',
        price: '₹1,200',
        cover: 'Complimentary welcome drink',
        note: 'Limited slots available',
    },
];

const upcomingEvents: UpcomingEvent[] = [
    {
        id: 1,
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO, Airport Road',
        date: '04',
        month: 'APR',
        category: 'Techno & Bollytech',
        image: '/event list/Rectangle 12249.jpg',
        slug: 'freaky-friday-with-dj-alexxx',
    },
    {
        id: 2,
        title: 'Wow Wednesday with DJ Shade',
        venue: 'DABO, Airport Road',
        date: '06',
        month: 'APR',
        category: 'Bollywood & Bollytech',
        image: '/event list/Rectangle 1.jpg',
        slug: 'wow-wednesday-with-dj-shade',
    },
    {
        id: 3,
        title: 'Sunset Sunday Rooftop',
        venue: 'DABO Terrace',
        date: '07',
        month: 'APR',
        category: 'Deep House & Chill',
        image: '/gallery/Frame 1000001128.jpg',
        slug: 'sunset-sunday-rooftop',
    },
];

const galleryImages: string[] = [
    '/dabo ambience main dabo page/Media.jpg',
    '/dabo ambience main dabo page/Media-1.jpg',
    '/dabo ambience main dabo page/Media-2.jpg',
    '/dabo ambience main dabo page/Media-3.jpg',
    '/event list/Rectangle 12249.jpg',
    '/event list/Rectangle 1.jpg',
];

const facilityChips: FacilityChip[] = [
    { icon: Wifi, label: 'Wi-Fi enabled' },
    { icon: Car, label: 'Valet parking' },
    { icon: Users, label: 'Private lounge' },
    { icon: ShieldCheck, label: 'Security check' },
];

const amenityGroups: AmenityGroup[] = [
    {
        title: 'Food',
        icon: Utensils,
        items: ['Asian fusion', 'Italian classics', 'North Indian staples', 'Gourmet bar snacks'],
    },
    {
        title: 'Music',
        icon: Music,
        items: ['DJ Martin live set', 'Techno & Bollytech mashups', 'Karaoke afterhours', 'Surprise guest acts'],
    },
    {
        title: 'Bar',
        icon: Wine,
        items: ['Signature cocktails', 'Premium spirits', 'Wine cellar', 'Craft beers'],
    },
];

const reviews: Review[] = [
    {
        name: 'Anjali Sharma',
        initial: 'A',
        rating: 5,
        comment:
            'Loved the energy! The lighting, music, and service were all on point. Highly recommend booking a table in advance.',
        timeAgo: '2 days ago',
    },
    {
        name: 'Rahul Verma',
        initial: 'R',
        rating: 4,
        comment:
            'Great vibe and crowd. Drinks menu is extensive and the DJ kept everyone on the floor all night.',
        timeAgo: '1 week ago',
    },
];

const eventTitle = 'Freaky Friday ft. DJ Martin';
const eventVenue = 'DABO Club & Kitchen';
const eventLocation = 'Dharampeth, Nagpur';
const heroImage = '/dabo ambience main dabo page/Media.jpg';

export default function DaboEventPage() {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const handleShare = async () => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return;
        }

        try {
            if (navigator.share) {
                await navigator.share({
                    title: eventTitle,
                    text: `Join ${eventTitle} at ${eventVenue}.`,
                    url: window.location.href,
                });
                return;
            }

            await navigator.clipboard?.writeText(window.location.href);
            toast({
                title: 'Link copied',
                description: 'Event link copied to your clipboard.',
            });
        } catch (error) {
            console.error('Share failed', error);
            toast({
                title: 'Unable to share automatically',
                description: 'Copy the link from your browser address bar instead.',
                variant: 'destructive',
            });
        }
    };

    const handleToggleLike = () => {
        setIsLiked((prev) => !prev);
    };

    const iconButtonClasses =
        'h-11 w-11 rounded-full border border-white/15 bg-black/40 backdrop-blur-md hover:bg-black/60';

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[428px] pb-28">
                <div
                    className="pointer-events-none absolute -top-48 right-[-180px] h-[360px] w-[360px] rounded-full bg-[#0891b2]/25 blur-[140px]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute top-[420px] left-[-220px] h-[320px] w-[320px] rounded-full bg-[#14b8a6]/20 blur-[140px]"
                    aria-hidden
                />

                <section className="relative overflow-hidden rounded-b-[40px]">
                    <div className="relative h-[360px]">
                        <img src={heroImage} alt={eventTitle} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-[#031313]/95" />

                        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6">
                            <Button
                                variant="secondary"
                                size="icon"
                                className={iconButtonClasses}
                                onClick={handleGoBack}
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-5 w-5 text-white" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className={iconButtonClasses}
                                    onClick={handleShare}
                                    aria-label="Share event"
                                >
                                    <Share className="h-5 w-5 text-white" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className={iconButtonClasses}
                                    onClick={handleToggleLike}
                                    aria-pressed={isLiked}
                                    aria-label="Add to favourites"
                                >
                                    <Heart
                                        className="h-5 w-5 text-white"
                                        fill={isLiked ? 'currentColor' : 'none'}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-5 right-5 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="badge-tag text-[10px] uppercase tracking-[0.35em]">Tonight</span>
                                <span className="rounded-full bg-white/15 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-white/80">
                                    Featured Event
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-[32px] font-extrabold leading-[1.1]">{eventTitle}</h1>
                                <p className="text-sm uppercase tracking-[0.35em] text-white/70">Hosted by {eventVenue}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{eventLocation}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>8:00 PM onwards</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="relative z-10 space-y-10 px-5 pt-12">
                    <section className="-mt-16">
                        <div className="surface-card rounded-[32px] border border-white/10 px-6 pb-8 pt-10 shadow-[0px_32px_80px_rgba(6,182,212,0.18)]">
                            <div className="space-y-6 text-center">
                                <div>
                                    <h2 className="text-[24px] font-semibold leading-tight">Experience the neon pulse</h2>
                                    <p className="mt-2 text-sm text-white/65">
                                        Dive into Nagpur&apos;s premium nightlife with curated beats, luxe ambiance, and signature cocktails.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3 text-sm text-white/75">
                                    {quickFacts.map((fact) => (
                                        <div
                                            key={fact.label}
                                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
                                        >
                                            <fact.icon className="h-4 w-4 text-cyan-300" />
                                            <span>{fact.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2">
                                        <Star className="h-4 w-4 text-amber-300" fill="currentColor" />
                                        <span className="text-sm font-semibold">4.2 · 2.4k reviews</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl bg-[#14b8a6]/15 px-4 py-2 text-sm text-[#5eead4]">
                                        <Users className="h-4 w-4" />
                                        <span>Premium crowd</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="primary"
                                        className="h-14 rounded-full text-sm uppercase tracking-[0.3em]"
                                    >
                                        Reserve your spot
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="h-14 rounded-full border border-white/20 bg-white/10 text-sm uppercase tracking-[0.3em]"
                                    >
                                        Book offline
                                    </Button>
                                </div>
                                <div className="mt-2 flex items-center justify-center gap-4">
                                    <a
                                        href="tel:+919876543210"
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                                        aria-label="Call the venue"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://maps.app.goo.gl/3xg4X7gY1pL5xpHq7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                                        aria-label="Open directions"
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                                        aria-label="Share event link"
                                    >
                                        <Share className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Now playing</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60">Live tonight</span>
                        </div>
                        <div className="surface-panel space-y-5 rounded-[28px] border border-white/10 px-6 py-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl header-gradient">
                                        <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1db584]">
                                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Headliner</p>
                                    <h4 className="text-xl font-semibold">DJ Martin Live</h4>
                                    <p className="mt-1 text-sm text-white/70">Spinning techno, bollytech, and afro beats all night.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {vibeTags.map((tag) => (
                                    <span key={tag} className="badge-tag" data-variant="primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div>
                                <div className="progress-track">
                                    <div className="progress-fill w-[68%]" />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-white/55">
                                    <span>Energy meter</span>
                                    <span>68% capacity</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Today&apos;s offers</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-3">
                            {offers.map((offer) => (
                                <div
                                    key={offer.title}
                                    className={`flex items-center justify-between gap-4 rounded-[24px] border border-white/10 px-5 py-4 backdrop-blur-md ${offer.accent === 'purple'
                                        ? 'bg-gradient-to-r from-[#8b5cf6]/20 via-[#ec4899]/15 to-transparent'
                                        : 'bg-gradient-to-r from-[#14b8a6]/20 via-[#0f766e]/10 to-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                            <offer.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{offer.title}</p>
                                            <p className="mt-1 text-xs text-white/70">{offer.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/60" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Entry · booking</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-3">
                            {entryOptions.map((option) => (
                                <div
                                    key={option.label}
                                    className="surface-panel rounded-[24px] border border-white/10 px-5 py-4 text-left"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                                                {option.label}
                                            </h4>
                                            <p className="mt-2 text-[22px] font-bold text-[#5eead4]">{option.price}</p>
                                            <p className="text-xs text-white/65">{option.cover}</p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                                            <Ticket className="h-4 w-4 text-white/80" />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-white/55">{option.note}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Upcoming at DABO</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <Link
                                href="/events"
                                className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="scrollbar-hide overflow-x-auto pb-1">
                            <div className="flex gap-5 pr-4" style={{ width: 'max-content' }}>
                                {upcomingEvents.map((event) => (
                                    <Link key={event.id} href={`/event/${event.slug}`}>
                                        <article
                                            className="relative w-[220px] overflow-hidden rounded-[26px] border border-white/10"
                                            style={{
                                                clipPath:
                                                    'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                                                background: 'rgba(14, 31, 31, 0.65)',
                                            }}
                                        >
                                            <div className="relative h-[200px] overflow-hidden">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-[#031313]/95" />
                                                <div className="absolute right-4 top-4 rounded-xl bg-gradient-to-b from-[#14b8a6] to-[#0891b2] px-3 py-2 text-center text-xs font-bold text-white">
                                                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">{event.month}</div>
                                                    <div className="text-base leading-none">{event.date}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-3 px-4 pb-5 pt-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-tight text-white">{event.title}</h4>
                                                    <p className="mt-2 text-xs text-white/60">{event.venue}</p>
                                                </div>
                                                <div className="badge-tag" data-variant="primary">
                                                    {event.category}
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Photo gallery</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                <Camera className="h-4 w-4" />
                                +7
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {galleryImages.map((image, index) => (
                                <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl">
                                    <img src={image} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                                    {index === galleryImages.length - 1 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Location</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="surface-panel space-y-4 rounded-[24px] border border-white/10 p-5">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 text-cyan-300" />
                                <p className="text-sm text-white/80">
                                    House 10/156/1, Yogeshwari CHS, Wardha Road, Nagpur — opposite Airport Metro station.
                                </p>
                            </div>
                            <div className="overflow-hidden rounded-[20px] border border-white/10">
                                <div className="h-36 bg-gradient-to-br from-[#14b8a6]/30 to-[#0ea5e9]/20">
                                    <div className="flex h-full items-center justify-center">
                                        <MapPin className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Facilities</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {facilityChips.map((item) => (
                                <span
                                    key={item.label}
                                    className="glassmorphism-light flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                                >
                                    <item.icon className="h-4 w-4 text-cyan-300" />
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Experience zones</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-3">
                            {amenityGroups.map((group) => (
                                <div key={group.title} className="surface-panel rounded-[24px] border border-white/10 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                            <group.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">
                                            {group.title}
                                        </h4>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                                        {group.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#5eead4]" aria-hidden />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-5 pb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold tracking-wide">Reviews</h3>
                                <div className="divider-line w-16" />
                            </div>
                            <button className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                View all
                            </button>
                        </div>
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.name} className="surface-panel rounded-[24px] border border-white/10 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] text-lg font-bold">
                                            {review.initial}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-white">{review.name}</span>
                                                <span className="text-xs uppercase tracking-[0.3em] text-white/45">{review.timeAgo}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className="h-3.5 w-3.5"
                                                        fill={index < review.rating ? 'currentColor' : 'none'}
                                                        color={index < review.rating ? '#facc15' : 'rgba(255,255,255,0.2)'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-white/75">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                className="h-12 rounded-full border border-white/20 bg-white/10 px-8 text-xs font-semibold uppercase tracking-[0.35em]"
                            >
                                Leave a review
                            </Button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}