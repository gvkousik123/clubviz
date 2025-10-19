'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    Calendar,
    Wine,
    Sparkles,
    Users,
    Car,
    Wifi,
    ShieldCheck,
    Utensils,
    Music,
    Camera,
    ChevronLeft,
    ChevronRight,
    Star,
    Play,
    Pause,
    Heart,
    MapPin,
} from 'lucide-react'; import { useToast } from '@/hooks/use-toast';

// Types
interface VenueInfo {
    name: string;
    address: string;
    rating: number;
}

interface OfferCard {
    title: string;
    isActive?: boolean;
}

interface EntryTab {
    label: string;
    price: string;
    cover: string;
    isActive?: boolean;
}

interface EventCard {
    id: number;
    title: string;
    venue: string;
    date: string;
    month: string;
    category: string;
    image: string;
}

interface FacilityChip {
    icon: string;
    label: string;
}

interface AmenitySection {
    title: string;
    items: string[];
}

interface ReviewCard {
    name: string;
    initial: string;
    rating: number;
    comment: string;
    timeAgo: string;
}

// Data
const venueInfo: VenueInfo = {
    name: 'DABO CLUB & KITCHEN',
    address: 'House 1913/B/1, Yogesham CHS, Wardha Road, Nagpur',
    rating: 4.2,
};

const offers: OfferCard[] = [
    { title: 'Buy 1 get 1 on IFML Drinks', isActive: true },
    { title: 'Free Entry for all before 09:00 PM', isActive: true },
];

const entryTabs: EntryTab[] = [
    { label: 'Couple & Group\\nEntry', price: 'Rs 1500 (Cover - 1000)', cover: 'Redeem cover before 12:00 AM', isActive: true },
    { label: 'Male stag\\n Entry', price: '', cover: '', isActive: false },
    { label: 'Female stag\\n Entry', price: '', cover: '', isActive: false },
];

const upcomingEvents: EventCard[] = [
    {
        id: 1,
        title: 'Freaky Friday \nwith DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: '04',
        month: 'APR',
        category: 'Techno & Bollytech',
        image: '/event list/Rectangle 12249.jpg',
    },
    {
        id: 2,
        title: 'Wow Wednesday \nwith DJ Shade',
        venue: 'DABO , Airport Road',
        date: '04',
        month: 'APR',
        category: 'Bollywood & Bollytech',
        image: '/event list/Rectangle 1.jpg',
    },
];

const facilities: FacilityChip[] = [
    { icon: '🕐', label: 'Open till midnight' },
    { icon: '♿', label: 'Disabled Access' },
    { icon: '🚗', label: 'Car Parking' },
    { icon: '🏠', label: 'Private dining space' },
    { icon: '🪑', label: 'Indoor Seating' },
    { icon: '📋', label: 'Table booking' },
];

const amenities: AmenitySection[] = [
    {
        title: 'Food',
        items: ['Gluten free options', 'Bar Snacks', 'Asian', 'Continental', 'North Indian'],
    },
    {
        title: 'Music',
        items: ['DJ Martin live set', 'Techno & Bollytech', 'Karaoke afterhours'],
    },
    {
        title: 'Bar',
        items: ['Craft beers', 'Wine cellar', 'Cocktails', 'Premium spirits'],
    },
];

const reviews: ReviewCard[] = [
    {
        name: 'Anjali Sharma',
        initial: 'A',
        rating: 5,
        comment: 'Loved the energy! The lighting, music, and service were all on point. Highly recommend booking a table in advance.',
        timeAgo: '2 days ago',
    },
    {
        name: 'Rahul Verma',
        initial: 'R',
        rating: 4,
        comment: 'Great vibe and crowd. Drinks menu is extensive and the DJ kept everyone on the floor all night.',
        timeAgo: '1 week ago',
    },
];

const heroImages = [
    '/dabo ambience main dabo page/Media.jpg',
    '/dabo ambience main dabo page/Media-1.jpg',
    '/dabo ambience main dabo page/Media-2.jpg',
    '/dabo ambience main dabo page/Media-3.jpg',
];

export default function ClubDaboPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nowPlaying, setNowPlaying] = useState({
        title: "Timeless Tuesday with DJ Xpensive",
        genres: ["Bolly tech", "Progressive tech"]
    });

    const handleGoBack = () => {
        router.back();
    };

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: 'DABO Club & Kitchen',
                    text: 'Check out this amazing club!',
                    url: window.location.href,
                });
                return;
            }

            await navigator.clipboard?.writeText(window.location.href);
            toast({
                title: 'Link copied',
                description: 'Club link copied to your clipboard.',
            });
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleToggleLike = () => {
        setIsLiked((prev) => !prev);
        toast({
            title: isLiked ? 'Removed from favorites' : 'Added to favorites',
            description: isLiked ? 'Club removed from your favorites' : 'Club added to your favorites',
        });
    };

    const handleLike = () => {
        toast({
            title: 'Thanks for the feedback!',
            description: 'You liked this club',
        });
    };

    const handleDislike = () => {
        toast({
            title: 'Thanks for the feedback!',
            description: 'You disliked this club',
        });
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-[391px] overflow-hidden">
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={index}
                            className="min-w-full h-full object-cover transition-transform duration-300"
                            src={image}
                            alt={`Hero ${index + 1}`}
                            style={{
                                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                            }}
                        />
                    ))}
                </div>

                {/* Navigation arrows */}
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 flex justify-between items-center w-[calc(100%-28px)]">
                    <button
                        onClick={prevImage}
                        className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center"
                    >
                        <ChevronLeft className="w-4 h-4 text-black" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center"
                    >
                        <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                </div>

                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Floating rating badge */}
            <div className="absolute left-1/2 top-[370px] transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-radial from-[#08C2B3] via-[#08C2B3] to-[#01756C] flex items-center justify-center shadow-lg z-10">
                    <div className="text-white text-2xl font-bold">{venueInfo.rating}</div>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-[#021313] mt-[-60px] rounded-t-[40px] relative z-0 pt-16 px-4">
                <div className="flex flex-col items-center gap-6">
                    {/* Title */}
                    <h1 className="text-white text-[28px] font-bold tracking-normal text-center">
                        {venueInfo.name}
                    </h1>

                    {/* Social buttons and Action buttons */}
                    <div style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "flex-end", gap: "8px", display: "inline-flex", flexWrap: "wrap", alignContent: "flex-end" }}>
                        <div style={{ justifyContent: "flex-start", alignItems: "center", gap: "12px", display: "flex" }}>
                            <div
                                style={{ width: "40px", height: "40px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex" }}
                                onClick={handleLike}
                                role="button"
                                tabIndex={0}
                            >
                                <img src="/club/ThumbsUp (1).svg" alt="Like" style={{ width: "20px", height: "20px" }} />
                            </div>
                            <div
                                style={{ width: "40px", height: "40px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex" }}
                                onClick={handleDislike}
                                role="button"
                                tabIndex={0}
                            >
                                <img src="/club/ThumbsDown (1).svg" alt="Dislike" style={{ width: "20px", height: "20px" }} />
                            </div>
                            <div
                                style={{ width: "40px", height: "40px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex" }}
                                onClick={handleShare}
                                role="button"
                                tabIndex={0}
                            >
                                <img src="/club/ShareNetwork (1).svg" alt="Share" style={{ width: "20px", height: "20px" }} />
                            </div>
                            <div
                                style={{ width: "40px", height: "40px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex" }}
                                onClick={handleToggleLike}
                                role="button"
                                tabIndex={0}
                            >
                                <img src="/club/BookmarkSimple (1).svg" alt="Bookmark" style={{ width: "20px", height: "20px" }} />
                            </div>
                        </div>
                        <div style={{ width: "100%", justifyContent: "center", alignItems: "center", gap: "12px", display: "flex", marginTop: "8px" }}>
                            <Link
                                href="/booking/form"
                                style={{ minWidth: "160px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "12px", paddingBottom: "12px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex", textDecoration: "none", flexShrink: 0 }}
                            >
                                <div style={{ color: "white", fontSize: "14px", fontFamily: "Manrope", fontWeight: "700", lineHeight: "16px", letterSpacing: "0.30px", wordWrap: "break-word", textAlign: "center", whiteSpace: "nowrap" }}>Reserve your spot</div>
                            </Link>
                            <Link
                                href="/booking/form"
                                style={{ minWidth: "120px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "12px", paddingBottom: "12px", background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", overflow: "hidden", borderRadius: "25px", justifyContent: "center", alignItems: "center", gap: "10px", display: "flex", textDecoration: "none", flexShrink: 0 }}
                            >
                                <div style={{ color: "white", fontSize: "14px", fontFamily: "Manrope", fontWeight: "700", lineHeight: "16px", letterSpacing: "0.30px", wordWrap: "break-word", textAlign: "center", whiteSpace: "nowrap" }}>Book offline</div>
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Container */}
                    <div className="w-full p-[15px] bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col gap-[11px]">
                        {/* Now Playing Section */}
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex items-center gap-[10px]">
                                    <h3 className="text-[#FFFEFF] text-[16px] font-[600] leading-[16px] tracking-[0.5px]">Now Playing</h3>
                                </div>
                            </div>

                            <div className="relative h-[93px] w-full">
                                <div className="absolute left-[60px] top-[7px] text-white text-[13px] font-[400] leading-[15.6px]">
                                    Club Music
                                </div>
                                <div className="w-[110px] h-[20px] absolute left-[39px] top-[4px] bg-gradient-to-b from-[rgba(20,255,236,0.31)] to-[rgba(217,217,217,0)] rounded-t-[15px]"></div>
                                <div className="absolute left-[81px] top-[34px] text-white text-[13px] font-[400] leading-[15.6px]">
                                    Now playing
                                </div>
                                <div className="absolute left-[81px] top-[56px] px-[10px] py-[5px] bg-[rgba(32,43,43,0.60)] rounded-[25px] border border-[#28D2DB] flex items-center gap-[4px]">
                                    <span className="text-white text-[13px] font-[400] leading-[15.6px]">Chill House Mix</span>
                                    <div className="w-[7px] h-[7px] bg-[#C50000] rounded-full"></div>
                                </div>
                                <div className="absolute left-[211px] top-[56px] px-[10px] py-[5px] bg-[rgba(32,43,43,0.60)] rounded-[25px] border border-[#28D2DB] flex items-center gap-[6px]">
                                    <span className="text-white text-[13px] font-[400] leading-[15.6px]">Techno Vibes</span>
                                    <div className="w-[7px] h-[7px] bg-[#C50000] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Offers */}
                        <div className="flex flex-col gap-[12px]">
                            <h3 className="text-[#FFFEFF] text-[16px] font-[600] leading-[16px] tracking-[0.5px]">Today's Offers</h3>

                            <div className="relative h-[123px] bg-[rgba(31.93,42.75,43.32,0.60)] rounded-[15px] overflow-hidden">
                                <div className="absolute left-[10px] top-[10px] w-[344px] h-[45px] bg-[#263438] rounded-[10px] border border-[#14FFEC] overflow-hidden">
                                    <div className="absolute right-[45px] top-[-23px] w-[86.81px] h-[86.47px] bg-[#1B726B] transform rotate-[8deg]"></div>
                                    <div className="absolute left-[19.06px] top-[15px] text-white text-[13px] font-[800] leading-[16px] tracking-[0.5px]">
                                        Buy 1 get 1 on IFML Drinks
                                    </div>
                                </div>

                                <div className="absolute left-[10px] top-[68px] w-[344px] h-[45px] bg-[#263438] rounded-[10px] border border-[#14FFEC] overflow-hidden">
                                    <div className="absolute right-[45px] top-[-23px] w-[88.45px] h-[86.39px] bg-[#1B726B] transform rotate-[8deg]"></div>
                                    <div className="absolute left-[19.34px] top-[15px] text-white text-[13px] font-[800] leading-[16px] tracking-[0.5px]">
                                        Free Entry for all before 09:00 PM
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry/Booking */}
                        <div className="flex flex-col gap-[12px]">
                            <h3 className="text-[#FFFEFF] text-[16px] font-[600] leading-[16px] tracking-[0.5px]">Entry/Booking</h3>

                            <div className="relative h-[134px] bg-[rgba(31.93,42.75,43.32,0.60)] rounded-[15px] overflow-hidden">
                                <div className="absolute left-[10px] top-[10px] w-[344px] h-[114px] bg-[#263438] rounded-[15px] flex flex-wrap items-start justify-center">
                                    {/* Tab 1 - Couple & Group Entry */}
                                    <div className="w-[144px] h-[57px] flex flex-col justify-end items-center gap-[5px]">
                                        <div className="text-white text-[13px] font-[600] leading-[20px] tracking-[0.13px] text-center">
                                            Couple & Group<br />Entry
                                        </div>
                                        <div className="w-[144px] h-[4px] bg-[#1AFFEC] rounded-t-[6px]"></div>
                                    </div>

                                    {/* Tab 2 - Male stag Entry */}
                                    <div className="w-[100px] h-[57px] flex flex-col justify-end items-center gap-[5px]">
                                        <div className="text-white text-[13px] font-[600] leading-[20px] tracking-[0.13px] text-center">
                                            Male stag<br />Entry
                                        </div>
                                        <div className="w-[100px] h-[1px] bg-[#5F5F5F]"></div>
                                    </div>

                                    {/* Tab 3 - Female stag Entry */}
                                    <div className="w-[100px] h-[57px] flex flex-col justify-end items-center gap-[5px]">
                                        <div className="text-white text-[13px] font-[600] leading-[20px] tracking-[0.13px] text-center">
                                            Female stag<br />Entry
                                        </div>
                                        <div className="w-[100px] h-[1px] bg-[#5F5F5F]"></div>
                                    </div>

                                    {/* Price & Cover */}
                                    <div className="w-[269px] h-[27px] text-center">
                                        <span className="text-[#14FFEC] text-[16px] font-[500] leading-[20px] tracking-[0.16px]">
                                            Rs 1500 (Cover - 1000)
                                        </span><br />
                                        <span className="text-[#D9D9D9] text-[13px] font-[500] leading-[20px] tracking-[0.13px]">
                                            Redeem cover before 12:00 AM
                                        </span>
                                    </div>

                                    {/* Right Arrow Button */}
                                    <div className="absolute right-[10px] bottom-[10px] w-[30px] h-[30px] bg-[#0D7377] rounded-[18px] flex items-center justify-center">
                                        <ChevronRight className="w-[15px] h-[15px] text-[#14FFEC]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events in Dabo */}
                    <div className="w-full">
                        <h3 className="text-[#FFFEFF] text-[16px] font-[600] leading-[16px] tracking-[0.5px] mb-4">Events in Dabo</h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                            {upcomingEvents.map((event) => (
                                <Link
                                    href="/event/timeless-tuesday"
                                    key={event.id}
                                    className="min-w-[222px] h-[320px] relative flex-shrink-0 cursor-pointer"
                                >
                                    <div className="w-full h-full bg-gradient-radial from-black at-22% to-[#014A4B] at-70% rounded-[20px]">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-[180px] object-cover rounded-t-[20px]"
                                        />

                                        {/* Date badge */}
                                        <div className="absolute right-4 top-0 w-9 h-[45px] px-1 py-1 bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] flex flex-col items-center justify-center text-white text-center font-semibold border-l border-r border-b border-[#CDCDCD]">
                                            <span className="text-[10px] uppercase">{event.month}</span>
                                            <span className="text-base">{event.date}</span>
                                        </div>

                                        {/* Event details */}
                                        <div className="p-4">
                                            <h4 className="text-white text-base font-bold leading-tight mb-1 whitespace-pre-line">
                                                {event.title}
                                            </h4>
                                            <p className="text-[#C3C3C3] text-xs font-medium">
                                                {event.venue}
                                            </p>
                                        </div>

                                        {/* Heart icon */}
                                        <button
                                            className="absolute right-4 bottom-16 w-6 h-6 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Heart className="w-5 h-5 text-[#28D2DB]" />
                                        </button>

                                        {/* Category badge */}
                                        <div className="absolute bottom-0 left-0 w-full h-[34px] bg-gradient-to-r from-[#005F57] to-[#14FFEC] rounded-b-[20px] flex items-center justify-center text-white font-bold text-sm">
                                            {event.category}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Photos</h3>
                        <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 flex flex-wrap gap-2 justify-center">
                            <div className="w-[48%] h-44 bg-gray-700 rounded-[15px]">
                                <img src="/dabo ambience main dabo page/Media.jpg" alt="Gallery 1" className="w-full h-full object-cover rounded-[15px]" />
                            </div>
                            <div className="w-[48%] h-44 bg-gray-700 rounded-[15px]">
                                <img src="/dabo ambience main dabo page/Media-1.jpg" alt="Gallery 2" className="w-full h-full object-cover rounded-[15px]" />
                            </div>
                            <div className="w-[31%] h-28 bg-gray-700 rounded-[15px]">
                                <img src="/dabo ambience main dabo page/Media-2.jpg" alt="Gallery 3" className="w-full h-full object-cover rounded-[15px]" />
                            </div>
                            <div className="w-[31%] h-28 bg-gray-700 rounded-[15px]">
                                <img src="/dabo ambience main dabo page/Media-3.jpg" alt="Gallery 4" className="w-full h-full object-cover rounded-[15px]" />
                            </div>
                            <div className="w-[31%] h-28 bg-gray-700 rounded-[15px] relative">
                                <img src="/dabo ambience main dabo page/Media.jpg" alt="Gallery 5" className="w-full h-full object-cover rounded-[15px] opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[15px]">
                                    <span className="text-white text-xl font-bold">+7</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Location</h3>
                        <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                <p className="text-white text-sm">{venueInfo.address}</p>
                            </div>
                            <div className="w-full h-[100px] bg-gray-700 rounded-[10px]">
                                <img
                                    src="https://maps.googleapis.com/maps/api/staticmap?center=Nagpur,India&zoom=13&size=400x100&key=YOUR_API_KEY"
                                    alt="Location map"
                                    className="w-full h-full object-cover rounded-[10px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Facilities Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Facilities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">🕐</span>
                                </div>
                                <span className="text-white text-sm">Open till midnight</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">♿</span>
                                </div>
                                <span className="text-white text-sm">Disabled Access</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">🚗</span>
                                </div>
                                <span className="text-white text-sm">Car Parking</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">🍽️</span>
                                </div>
                                <span className="text-white text-sm">Private dining space</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">🪑</span>
                                </div>
                                <span className="text-white text-sm">Indoor Seating</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#02A1A1]/30 flex items-center justify-center">
                                    <span className="text-[#14FFEC]">📋</span>
                                </div>
                                <span className="text-white text-sm">Table booking</span>
                            </div>
                        </div>
                    </div>

                    {/* Food Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Food</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🥗</span>
                                <span className="text-white text-sm">Gluten free options</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍸</span>
                                <span className="text-white text-sm">Bar Snacks</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🥢</span>
                                <span className="text-white text-sm">Asian</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍕</span>
                                <span className="text-white text-sm">Italian</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🌎</span>
                                <span className="text-white text-sm">Continental</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍲</span>
                                <span className="text-white text-sm">North Indian</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍔</span>
                                <span className="text-white text-sm">Burgers & Sandwich</span>
                            </div>
                        </div>
                    </div>

                    {/* Music Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Music</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🎤</span>
                                <span className="text-white text-sm">Karaoke</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🎧</span>
                                <span className="text-white text-sm">DJs</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🎵</span>
                                <span className="text-white text-sm">Live Music</span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Section */}
                    <div className="w-full">
                        <h3 className="text-white text-base font-semibold mb-4">Bar</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🥃</span>
                                <span className="text-white text-sm">Spirits</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍷</span>
                                <span className="text-white text-sm">Wine</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍺</span>
                                <span className="text-white text-sm">Draught</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🍹</span>
                                <span className="text-white text-sm">Cocktail</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex items-center gap-2">
                                <span className="text-[#14FFEC]">🧃</span>
                                <span className="text-white text-sm">Non Alcoholic</span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="w-full flex justify-between items-center">
                        <h3 className="text-white text-base font-semibold">Reviews</h3>
                        <Link href="/review/page" className="text-[#14FFEC] text-xs font-semibold">
                            View All
                        </Link>
                    </div>

                    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex gap-4">
                            <div className="min-w-[300px] bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src="/profile/profile-1.jpg"
                                        alt="Anjali Sharma"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="text-white text-base font-medium">Anjali Sharma</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[#14FFEC] text-sm font-medium">4.5</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={`${i < 4 ? 'text-[#14FFEC] fill-[#14FFEC]' :
                                                            i === 4 ? 'text-[#14FFEC]' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <span className="text-white/70 text-sm">25/07/2024</span>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed mb-2">
                                    I recently ate at Dabo and had a great time. The food tasted good, and Rakesh's suggestions were perfect. The service was excellent. I'm very happy with my visit. Decor and interiors can be improved a bit.
                                </p>
                                <div className="text-right">
                                    <span className="text-white/50 text-xs">3 Days ago</span>
                                </div>
                            </div>

                            <div className="min-w-[300px] bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src="/profile/profile-2.jpg"
                                        alt="Ankit Trivedi"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="text-white text-base font-medium">Ankit Trivedi</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[#14FFEC] text-sm font-medium">4.5</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={`${i < 4 ? 'text-[#14FFEC] fill-[#14FFEC]' :
                                                            i === 4 ? 'text-[#14FFEC]' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <span className="text-white/70 text-sm">02/07/2024</span>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed mb-2">
                                    Generally any pub strikes one of the two cords, ambiance or tasty food. The food here is simply amazing and combine it with the perfect and soothing ambiance you will have a time of your life.
                                </p>
                                <div className="text-right">
                                    <span className="text-white/50 text-xs">6 Days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leave Review Button */}
                    <Link href="/review/write" className="w-full bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 flex items-center justify-between mb-16">
                        <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                        <span className="text-white text-base">Leave a review</span>
                        <div className="w-5 h-5 bg-[#14FFEC]"></div>
                    </Link>
                </div>
            </div>
        </div>
    );
}