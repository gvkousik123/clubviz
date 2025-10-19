'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Share,
    Heart,
    MapPin,
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
    Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
    { label: 'Couple & Group\nEntry', price: 'Rs 1500 (Cover - 1000)', cover: 'Redeem cover before 12:00 AM', isActive: true },
    { label: 'Male stag\n Entry', price: '', cover: '', isActive: false },
    { label: 'Female stag\n Entry', price: '', cover: '', isActive: false },
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
        title: 'Freaky Friday \nwith DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: '04',
        month: 'APR',
        category: 'Deep house & Mellow Tech',
        image: '/event list/Rectangle 1.jpg',
    },
    {
        id: 3,
        title: 'Freaky Friday \nwith DJ Alexxx',
        venue: 'DABO , Airport Road',
        date: '04',
        month: 'APR',
        category: 'Techno & Bollytech',
        image: '/gallery/Frame 1000001128.jpg',
    },
];

const galleryImages: string[] = [
    'https://placehold.co/178x178',
    'https://placehold.co/175x178',
    'https://placehold.co/112x112',
    'https://placehold.co/115x112',
    'https://placehold.co/114x112',
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

export default function DaboEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                description: 'Event link copied to your clipboard.',
            });
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleToggleLike = () => {
        setIsLiked((prev) => !prev);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    return (
        <div className="min-h-screen bg-[rgba(255,255,255,0.07)] relative w-full max-w-[430px] mx-auto rounded-[20px]">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-[391px] overflow-hidden">
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={index}
                            className="min-w-full h-full object-cover p-2.5 transition-transform duration-300"
                            src={image}
                            alt={`Hero ${index + 1}`}
                            style={{
                                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                            }}
                        />
                    ))}
                </div>

                {/* Navigation arrows */}
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 flex justify-between items-center w-[402px]">
                    <button
                        onClick={prevImage}
                        className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center overflow-hidden"
                    >
                        <div className="w-[24.38px] h-[24.38px] bg-white flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4 text-black" />
                        </div>
                    </button>
                    <button
                        onClick={nextImage}
                        className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center overflow-hidden"
                    >
                        <div className="w-[24.38px] h-[24.38px] bg-white flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-black" />
                        </div>
                    </button>
                </div>

                {/* Header overlay */}
                <div className="absolute top-0 left-0 w-full h-[194px] bg-gradient-to-b from-black to-transparent rounded-t-[20px] overflow-hidden">
                    {/* Status bar */}
                    <div className="flex justify-between items-center w-[355px] mx-auto pt-[18px]">
                        <div className="text-[#FFFCFC] text-[15px] font-manrope font-semibold leading-[21px]">9:41</div>
                        <div className="flex items-start gap-0.5">
                            <div className="w-5 h-4"></div>
                            <div className="w-4 h-4"></div>
                            <div className="w-[25px] h-4 relative overflow-hidden">
                                <div className="w-[22px] h-[11.33px] absolute top-0.5 left-0.25 opacity-35 rounded-[2.67px] border border-white"></div>
                                <div className="w-[1.33px] h-1 absolute top-[5.67px] left-6 opacity-40 bg-white"></div>
                                <div className="w-[18px] h-[7.33px] absolute top-1 left-[3px] bg-white rounded-[1.33px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={handleGoBack}
                        className="absolute left-4 top-24 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center transform -rotate-90 overflow-hidden"
                    >
                        <div className="w-4 h-2 transform rotate-90 border-2 border-white outline-white outline-[-1px]"></div>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="absolute top-[359px] left-0 w-full bg-[#021313] rounded-t-[40px] rounded-b-[20px] overflow-hidden min-h-[2703px]">
                {/* Header section with venue info */}
                <div className="absolute top-0 left-0 w-full h-[253px] px-[29px] pt-3 pb-[18px] bg-gradient-to-b from-[#021313] to-transparent rounded-t-[40px] overflow-hidden flex flex-col justify-end items-center gap-[25px]">
                    <h1 className="text-white text-[36px] font-anton text-center leading-5 tracking-[0.36px] h-[35px] flex items-center">
                        {venueInfo.name}
                    </h1>

                    <div className="w-[398px] flex flex-col items-center gap-2">
                        {/* Social buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden"
                            >
                                <Share className="w-6 h-6 text-[#14FFEC]" />
                            </button>
                            <button
                                onClick={handleToggleLike}
                                className="w-10 h-10 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden"
                            >
                                <Heart className="w-6 h-6 text-[#14FFEC]" fill={isLiked ? '#14FFEC' : 'none'} />
                            </button>
                            <button className="w-10 h-10 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden">
                                <MapPin className="w-6 h-6 text-[#14FFEC]" />
                            </button>
                            <button className="w-10 h-10 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden">
                                <Phone className="w-6 h-6 text-[#14FFEC]" />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="w-full flex justify-center items-center gap-[7px]">
                            <button className="w-48 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden">
                                <span className="text-white text-base font-bold leading-4 tracking-[0.5px]">Reserve your spot</span>
                            </button>
                            <button className="w-36 px-6 py-[11px] bg-gradient-to-br from-[#01756C] to-[#08C2B3] rounded-[25px] flex items-center justify-center gap-2.5 overflow-hidden">
                                <span className="text-white text-base font-bold leading-4 tracking-[0.5px]">Book offline</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content sections */}
                <div className="absolute top-[262px] left-0 w-full min-h-[2438px] overflow-hidden flex flex-col items-center justify-start gap-4 flex-wrap">
                    {/* Now Playing Section */}
                    <div className="w-[398px] px-[17px] py-[15px] bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col items-center gap-[11px] overflow-hidden">
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex items-center gap-2.5">
                                    <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Now Playing</h3>
                                </div>
                            </div>

                            {/* Music player */}
                            <div className="w-[349px] h-[93px] relative">
                                <div className="absolute left-20 top-[34px] text-white text-[13px] font-normal leading-[15.6px]">Now playing</div>
                                <div className="absolute left-[60px] top-[7px] text-white text-[13px] font-normal leading-[15.6px]">Club Music</div>
                                <div className="absolute left-[39px] top-1 w-[110px] h-5 bg-gradient-to-t from-transparent to-[rgba(20,255,236,0.31)] rounded-t-[15px]"></div>

                                {/* Music tags */}
                                <div className="absolute left-20 top-14 px-2.5 py-[5px] bg-[rgba(32,43,43,0.6)] rounded-[25px] border border-[#28D2DB] flex items-center justify-center gap-1">
                                    <span className="text-white text-[13px] font-normal leading-[15.6px]">Chill House Mix</span>
                                    <div className="w-[7px] h-[7px] bg-[#C50000] rounded-full"></div>
                                </div>

                                <div className="absolute left-[211px] top-14 px-2.5 py-[5px] bg-[rgba(32,43,43,0.6)] rounded-[25px] border border-[#28D2DB] flex items-center justify-center gap-1.5">
                                    <span className="text-white text-[13px] font-normal leading-[15.6px]">Techno Vibes</span>
                                    <div className="w-[7px] h-[7px] bg-[#C50000] rounded-full"></div>
                                </div>
                            </div>

                            {/* Today's Offers */}
                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex items-center gap-2.5">
                                    <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Today's Offers</h3>
                                </div>
                                <div className="w-full h-[123px] bg-[rgba(31.93,42.75,43.32,0.6)] rounded-[15px] p-2.5 space-y-2 overflow-hidden relative">
                                    {offers.map((offer, index) => (
                                        <div key={index} className="w-[344px] h-[45px] bg-[#263438] rounded-[10px] border border-[#14FFEC] relative overflow-hidden">
                                            <div className={`absolute ${index === 0 ? 'right-[70px] top-[-23px] w-[86.81px] h-[86.47px]' : 'right-[66px] top-[-23px] w-[88.45px] h-[86.39px]'} bg-[#1B726B] transform rotate-[8deg]`}></div>
                                            <div className={`absolute ${index === 0 ? 'left-[19px] top-[15px] w-[172.5px]' : 'left-[19px] top-[15px] w-[233px]'} text-white text-[13px] font-extrabold leading-4 tracking-[0.5px]`}>
                                                {offer.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Entry/Booking */}
                            <div className="w-[364px] flex flex-col gap-3">
                                <div className="w-full flex items-center gap-2.5">
                                    <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Entry/Booking</h3>
                                </div>
                                <div className="w-full h-[134px] bg-[rgba(31.93,42.75,43.32,0.6)] rounded-[15px] p-2.5 relative overflow-hidden">
                                    <div className="w-[344px] h-[114px] bg-[#263438] rounded-[15px] flex flex-wrap items-start justify-center overflow-hidden">
                                        {entryTabs.map((tab, index) => (
                                            <div key={index} className={`${index === 0 ? 'w-36' : 'w-[100px]'} h-[57px] bg-[#263438] flex flex-col justify-end items-center gap-[5px]`}>
                                                <div className={`${index === 0 ? 'w-full' : 'w-[62px]'} text-center text-white text-[13px] font-semibold leading-5 tracking-[0.13px] whitespace-pre-line`}>
                                                    {tab.label}
                                                </div>
                                                <div className={`w-full h-1 ${index === 0 ? 'bg-[#1AFFEC] rounded-tl-[6px] rounded-tr-[7px]' : 'bg-[#5F5F5F]'}`}></div>
                                            </div>
                                        ))}
                                        {/* Entry details */}
                                        <div className="w-[269px] h-[27px] flex items-center justify-center">
                                            <div className="text-center">
                                                <span className="text-[#14FFEC] text-base font-medium leading-5 tracking-[0.16px]">Rs 1500 (Cover - 1000)</span>
                                                <br />
                                                <span className="text-[#D9D9D9] text-[13px] font-medium leading-5 tracking-[0.13px]">Redeem cover before 12:00 AM</span>
                                            </div>
                                        </div>
                                        <div className="w-[30px] h-[30px] pt-2 pb-2 bg-[#0D7377] rounded-[18px] flex flex-col items-center justify-center gap-2.5 transform -rotate-90">
                                            <div className="w-[15px] h-[11.95px] bg-[#14FFEC] rounded-[1px] transform -rotate-90"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events in Dabo */}
                    <div className="w-[362px] flex items-center gap-[15px]">
                        <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Events in Dabo</h3>
                    </div>

                    <div className="w-full h-[331px] relative overflow-hidden">
                        <div className="flex gap-4 px-4 overflow-x-auto">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="min-w-[222px] h-[321px] relative flex-shrink-0">
                                    <div className="w-[222px] h-[331px] bg-gradient-radial from-black at-22% to-[#014A4B] at-70% rounded-[20px] absolute top-0 left-0"></div>

                                    {/* Date badge */}
                                    <div className="absolute right-[37px] top-0 w-9 h-[45px] px-0.5 pt-2.5 pb-[11px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] flex flex-col items-center justify-center gap-2.5 shadow-md overflow-hidden">
                                        <div className="w-[31px] text-white text-[14px] font-semibold leading-4 text-center">
                                            {event.month} {event.date}
                                        </div>
                                    </div>

                                    {/* Event details */}
                                    <div className="absolute left-[18px] top-[217px] w-36 h-[68px] flex flex-col gap-[3px]">
                                        <h4 className="text-[#E6E6E6] text-base font-bold leading-[22px] tracking-[0.16px] whitespace-pre-line h-[42px] flex items-center">
                                            {event.title}
                                        </h4>
                                        <p className="w-36 text-[#C3C3C3] text-[12px] font-bold leading-[17px] tracking-[0.12px] h-[23px] flex items-center">
                                            {event.venue}
                                        </p>
                                    </div>

                                    {/* Category badge */}
                                    <div className="absolute bottom-0 left-0 w-[222px] h-[34px] bg-gradient-radial from-[#005F57] at-0% to-[#14FFEC] at-100% rounded-b-[20px] border-t border-[#0FD8E2] flex items-center justify-center overflow-hidden">
                                        <span className="text-white text-[14px] font-bold leading-[17px] text-center">
                                            {event.category}
                                        </span>
                                    </div>

                                    {/* Heart icon */}
                                    <div className="absolute right-[24px] top-[241px] w-[23px] h-[21px] border-2 border-[#28D2DB]"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="w-[362px] flex items-center gap-[15px]">
                        <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Photos</h3>
                    </div>

                    <div className="w-[398px] px-[7px] py-4 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-wrap justify-center items-center gap-[14px]">
                        {galleryImages.map((image, index) => (
                            <div key={index} className="relative">
                                {index === galleryImages.length - 1 ? (
                                    <div
                                        className="w-[114px] h-[112px] rounded-[15px] relative overflow-hidden bg-cover bg-center"
                                        style={{
                                            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.43) 0%, rgba(0, 0, 0, 0.43) 100%), url(${image})`
                                        }}
                                    >
                                        <div className="absolute top-9 left-[37.5px] w-10 h-10 bg-[rgba(1,49,48,0.75)] rounded-[10px] border border-[#14FFEC] flex items-center justify-center">
                                            <span className="w-[23px] text-white text-xl font-extrabold leading-[21px] text-center">+7</span>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        className={`${index < 2 ? (index === 0 ? 'w-[178px] h-[178px]' : 'w-[175px] h-[178px]') : 'w-[112px] h-[112px]'} rounded-[15px] object-cover relative`}
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Location Section */}
                    <div className="w-[362px] flex items-center gap-[15px]">
                        <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Location</h3>
                    </div>

                    <div className="w-[398px] px-4 pt-[15px] pb-[18px] bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col justify-start items-start gap-[9px] overflow-hidden">
                        <div className="flex-1 flex flex-col gap-[13px]">
                            <div className="flex items-center gap-[9px]">
                                <div className="w-[22px] h-[22px] relative overflow-hidden">
                                    <MapPin className="w-[14.67px] h-[18.71px] absolute left-[3.67px] top-[1.83px] text-[#C80000]" />
                                </div>
                                <p className="w-[285px] text-white text-[14px] font-medium leading-5 tracking-[0.14px] flex items-center">
                                    {venueInfo.address}
                                </p>
                            </div>
                            <img className="w-full h-[103px] rounded-[9px]" src="https://placehold.co/366x103" alt="Location map" />
                        </div>
                    </div>

                    {/* Facilities Section */}
                    <div className="w-[362px] flex items-center gap-[15px]">
                        <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Facilities</h3>
                    </div>

                    <div className="w-[398px] px-[14px] py-[15px] bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col justify-start items-start gap-[9px] overflow-hidden">
                        <div className="w-full flex flex-wrap gap-2">
                            {facilities.map((facility, index) => (
                                <div key={index} className="h-10 px-[15px] py-2.5 bg-white/10 rounded-[30px] flex items-center gap-1 overflow-hidden">
                                    <span className="text-xl">{facility.icon}</span>
                                    <span className="text-white text-base font-normal leading-[19.2px] text-center">{facility.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Sections */}
                    {amenities.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="w-full flex flex-col gap-4">
                            <div className="w-[362px] flex items-center gap-[15px]">
                                <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">{section.title}</h3>
                            </div>

                            <div className="w-[398px] px-[14px] py-[15px] bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col justify-start items-start gap-[9px] overflow-hidden">
                                <div className="w-full flex flex-wrap gap-[5px]">
                                    {section.items.map((item, index) => (
                                        <div key={index} className="px-[15px] py-2.5 bg-white/10 rounded-[30px] flex items-center gap-1 overflow-hidden">
                                            <span className="text-white text-base font-normal leading-[19.2px] text-center">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Reviews Section */}
                    <div className="w-[362px] flex justify-between items-center">
                        <h3 className="text-[#FFFEFF] text-base font-semibold leading-4 tracking-[0.5px]">Reviews</h3>
                        <div className="w-[61px] h-5 relative">
                            <button className="text-[#14FFEC] text-xs font-semibold uppercase tracking-[0.3em]">View all</button>
                        </div>
                    </div>

                    <div className="w-full px-4 overflow-x-auto">
                        <div className="flex gap-2.5">
                            {reviews.map((review, index) => (
                                <div key={index} className="min-w-[329px] h-[195px] bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 flex flex-col gap-3 relative overflow-hidden">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#14FFEC] rounded-full flex items-center justify-center">
                                            <span className="text-black font-bold">{review.initial}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-semibold">{review.name}</h4>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed">{review.comment}</p>
                                    <span className="text-white/60 text-xs">{review.timeAgo}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leave Review Button */}
                    <div className="w-[398px] px-4 bg-[rgba(40,60,61,0.30)] rounded-[16px] flex items-center gap-[98px] overflow-hidden">
                        <div className="w-[18px] h-[18px] relative overflow-hidden transform rotate-180">
                            <ArrowLeft className="w-full h-full text-white" />
                        </div>
                        <div className="w-[130px] h-12 text-white text-base font-medium leading-[21px] flex items-center justify-center">Leave a review</div>
                        <div className="w-6 h-6 relative overflow-hidden">
                            <div className="w-[19.5px] h-[19.5px] absolute left-[2.25px] top-[2.25px] bg-[#14FFEC]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating rating badge */}
            <div className="absolute left-[179px] top-[323px] p-1 rounded-[36px] border-2 border-[#0C898B] border-opacity-100 flex items-center gap-2.5">
                <img className="w-16 h-16 rounded-[45px] relative" src="https://placehold.co/64x64" alt="Venue" />
                <div className="w-[38px] h-[38px] absolute left-[17px] top-[60px] bg-[#005D5C] rounded-[30px]">
                    <div className="w-[42px] h-5 absolute left-[-2px] top-[9px] text-[#FFF4F4] text-base font-bold leading-[21px] text-center">{venueInfo.rating}</div>
                </div>
            </div>
        </div>
    );
}