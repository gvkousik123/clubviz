'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, MapPin, ChevronRight, ChevronLeft,
    Edit3, Save, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ClubService } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';

// Tag Component for reusability
const TagComponent = ({ icon, label, iconPath }: { icon?: React.ReactNode, label: string, iconPath?: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {iconPath && <img src={iconPath} alt={label} className="w-4 h-4" />}
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

export default function EditClubPage() {
    const router = useRouter();
    const params = useParams();
    const clubId = params.id as string;
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [clubData, setClubData] = useState<any>(null);
    const [editData, setEditData] = useState<any>({});

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [heroImages, setHeroImages] = useState<string[]>([
        '/dabo ambience main dabo page/Media.jpg',
        '/dabo ambience main dabo page/Media-1.jpg',
        '/dabo ambience main dabo page/Media-2.jpg',
        '/dabo ambience main dabo page/Media-3.jpg',
    ]);

    // Load club data
    useEffect(() => {
        const loadClubData = async () => {
            try {
                setIsLoading(true);
                const response = await ClubService.getClubById(clubId);

                if (response.success && response.data) {
                    const club = response.data;
                    setClubData(club);

                    // Initialize edit data with all fields
                    setEditData({
                        name: club.name || '',
                        description: club.description || '',
                        contactEmail: club.contactEmail || '',
                        contactPhone: club.contactPhone || '',
                        category: club.category || '',
                        maxMembers: club.maxMembers || '',
                        address1: club.locationText?.address1 || '',
                        address2: club.locationText?.address2 || '',
                        city: club.locationText?.city || '',
                        state: club.locationText?.state || '',
                        pincode: club.locationText?.pincode || '',
                        // Pricing
                        coupleEntryPrice: club.entryPricing?.coupleEntryPrice || '',
                        groupEntryPrice: club.entryPricing?.groupEntryPrice || '',
                        maleStagEntryPrice: club.entryPricing?.maleStagEntryPrice || '',
                        femaleStagEntryPrice: club.entryPricing?.femaleStagEntryPrice || '',
                        coverCharge: club.entryPricing?.coverCharge || '',
                        redeemDetails: club.entryPricing?.redeemDetails || '',
                        hasTimeRestriction: club.entryPricing?.hasTimeRestriction || false,
                        timeRestriction: club.entryPricing?.timeRestriction || '',
                        inclusions: club.entryPricing?.inclusions?.join(', ') || '',
                        exclusions: club.entryPricing?.exclusions?.join(', ') || '',
                        // Tags
                        foodCuisines: club.foodCuisines?.join(', ') || '',
                        facilities: club.facilities?.join(', ') || '',
                        music: club.music?.join(', ') || '',
                        barOptions: club.barOptions?.join(', ') || '',
                        // Images
                        logo: club.logo || '',
                    });

                    // Update hero images if available
                    if (club.images && club.images.length > 0) {
                        setHeroImages(club.images);
                    }

                } else {
                    throw new Error(response.message || 'Failed to load club data');
                }
            } catch (error) {
                console.error('❌ Error loading club data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load club data",
                    variant: "destructive",
                });
                router.push('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        if (clubId) {
            loadClubData();
        }
    }, [clubId, toast, router]);

    const handleInputChange = (field: string, value: any) => {
        setEditData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset to original data
            setEditData({
                name: clubData.name || '',
                description: clubData.description || '',
                contactEmail: clubData.contactEmail || '',
                contactPhone: clubData.contactPhone || '',
                category: clubData.category || '',
                maxMembers: clubData.maxMembers || '',
                address1: clubData.locationText?.address1 || '',
                address2: clubData.locationText?.address2 || '',
                city: clubData.locationText?.city || '',
                state: clubData.locationText?.state || '',
                pincode: clubData.locationText?.pincode || '',
                coupleEntryPrice: clubData.entryPricing?.coupleEntryPrice || '',
                groupEntryPrice: clubData.entryPricing?.groupEntryPrice || '',
                maleStagEntryPrice: clubData.entryPricing?.maleStagEntryPrice || '',
                femaleStagEntryPrice: clubData.entryPricing?.femaleStagEntryPrice || '',
                coverCharge: clubData.entryPricing?.coverCharge || '',
                redeemDetails: clubData.entryPricing?.redeemDetails || '',
                hasTimeRestriction: clubData.entryPricing?.hasTimeRestriction || false,
                timeRestriction: clubData.entryPricing?.timeRestriction || '',
                inclusions: clubData.entryPricing?.inclusions?.join(', ') || '',
                exclusions: clubData.entryPricing?.exclusions?.join(', ') || '',
                foodCuisines: clubData.foodCuisines?.join(', ') || '',
                facilities: clubData.facilities?.join(', ') || '',
                music: clubData.music?.join(', ') || '',
                barOptions: clubData.barOptions?.join(', ') || '',
                logo: clubData.logo || clubData.logoUrl || '',
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const updateData: any = {
                name: editData.name,
                description: editData.description,
                contactEmail: editData.contactEmail,
                contactPhone: editData.contactPhone,
                category: editData.category || "NIGHT_CLUB",
                maxMembers: editData.maxMembers ? parseInt(editData.maxMembers) : 100,
                locationText: {
                    address1: editData.address1,
                    address2: editData.address2,
                    city: editData.city,
                    state: editData.state,
                    pincode: editData.pincode,
                    fullAddress: [editData.address1, editData.address2, editData.city, editData.state, editData.pincode].filter(Boolean).join(', ')
                },
                pricing: {
                    coupleEntryPrice: Number(editData.coupleEntryPrice) || 0,
                    groupEntryPrice: Number(editData.groupEntryPrice) || 0,
                    maleStagEntryPrice: Number(editData.maleStagEntryPrice) || 0,
                    femaleStagEntryPrice: Number(editData.femaleStagEntryPrice) || 0,
                    coverCharge: Number(editData.coverCharge) || 0
                },
                rules: {
                    hasTimeRestriction: editData.hasTimeRestriction,
                    timeRestriction: editData.timeRestriction,
                    inclusions: typeof editData.inclusions === 'string' ? editData.inclusions.split(',').map(s => s.trim()).filter(Boolean) : [],
                    exclusions: typeof editData.exclusions === 'string' ? editData.exclusions.split(',').map(s => s.trim()).filter(Boolean) : [],
                    redeemDetails: editData.redeemDetails
                },
                foodCuisines: typeof editData.foodCuisines === 'string' ? editData.foodCuisines.split(',').map(s => s.trim()).filter(Boolean) : [],
                facilities: typeof editData.facilities === 'string' ? editData.facilities.split(',').map(s => s.trim()).filter(Boolean) : [],
                music: typeof editData.music === 'string' ? editData.music.split(',').map(s => s.trim()).filter(Boolean) : [],
                barOptions: typeof editData.barOptions === 'string' ? editData.barOptions.split(',').map(s => s.trim()).filter(Boolean) : [],
            };

            const response = await ClubService.updateClub(clubId, updateData);

            if (response.success && response.data) {
                setClubData(response.data);
                setIsEditing(false);
                toast({
                    title: 'Success',
                    description: 'Club updated successfully!',
                });
            }
        } catch (error) {
            console.error('Error updating club:', error);
            toast({
                title: 'Error',
                description: 'Failed to update club. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackClick = () => {
        router.push('/admin');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-[#14FFEC] rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p>Loading club details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (!clubData) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Club not found</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#14FFEC] text-black rounded-full font-bold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-[40vh] overflow-hidden">
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
                    onClick={handleBackClick}
                    className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>

                {/* Action Buttons - Edit and Save */}
                <div className="absolute top-12 right-4 flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="bg-[#14FFEC] text-black py-2 px-4 rounded-full font-bold text-sm cursor-pointer hover:bg-[#10d4c4] transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleEditToggle}
                                className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                            >
                                <X size={16} className="text-[#14FFEC]" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className="bg-[#005D5C] text-white py-2 px-4 rounded-full font-bold text-sm cursor-pointer hover:bg-[#007875] transition-all duration-300 flex items-center gap-2"
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Profile picture */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(35vh - 42.5px)' }}>
                <div className="w-[85px] h-[85px] rounded-full border-4 border-[#08C2B3] overflow-hidden shadow-xl">
                    <img
                        src={editData.logo || '/dabo ambience main dabo page/Media.jpg'}
                        alt="Club Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Rating Circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(35vh + 15px)' }}>
                <div className="w-[40px] h-[40px] relative">
                    <div className="w-full h-full bg-[#005D5C] rounded-[30px] flex items-center justify-center">
                        <div className="text-[#FFF4F4] text-[16px] font-bold">
                            {clubData?.rating || '4.2'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-gradient-to-b from-[#021313] to-[rgba(2,19,19,0)] mt-[-5vh] rounded-t-[40px] relative z-0 px-4 pb-[18px] w-full">
                <div className="flex flex-col items-center w-full" style={{ paddingTop: 'calc(6vh + 30px)' }}>

                    {/* Title */}
                    <div className="flex justify-center items-center mb-3 w-full">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="bg-[#0D1F1F] text-white text-center text-[36px] tracking-[0.36px] font-normal leading-[35px] rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none w-full max-w-md"
                                style={{ fontFamily: "'Anton', sans-serif" }}
                                placeholder="Club Name"
                            />
                        ) : (
                            <h1 className="text-white text-[36px] tracking-[0.36px] text-center font-normal leading-[35px]" style={{ fontFamily: "'Anton', sans-serif" }}>
                                {editData.name || clubData?.name}
                            </h1>
                        )}
                    </div>

                    {/* Social buttons */}
                    <div className="w-full flex flex-col items-center gap-3 mb-4">
                        <div className="flex justify-center items-center gap-3">
                            <div
                                className="transition-transform hover:scale-110 active:scale-95 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)" }}
                            >
                                <img src="/club/ThumbsUp (1).svg" alt="Like" className="w-5 h-5" />
                            </div>
                            <div
                                className="transition-transform hover:scale-110 active:scale-95 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)" }}
                            >
                                <img src="/club/ThumbsDown (1).svg" alt="Dislike" className="w-5 h-5" />
                            </div>
                            <div
                                className="transition-transform hover:scale-110 active:scale-95 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)" }}
                            >
                                <img src="/club/ShareNetwork (1).svg" alt="Share" className="w-5 h-5" />
                            </div>
                            <div
                                className="transition-transform hover:scale-110 active:scale-95 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)" }}
                            >
                                <img src="/club/BookmarkSimple (1).svg" alt="Bookmark" className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="w-full flex justify-center items-center gap-3">
                            <Link
                                href="/booking/form"
                                className="transition-all hover:brightness-110 px-5 py-3 rounded-full flex items-center justify-center text-white text-sm font-bold tracking-wide"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", minWidth: "160px" }}
                            >
                                Reserve your spot
                            </Link>
                            <Link
                                href="/booking/form"
                                className="transition-all hover:brightness-110 px-5 py-3 rounded-full flex items-center justify-center text-white text-sm font-bold tracking-wide"
                                style={{ background: "radial-gradient(ellipse 122.14% 367.06% at 47.50% 51.28%, #01756C 0%, #08C2B3 100%)", minWidth: "120px" }}
                            >
                                Book offline
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Container */}
                    <div className="w-full px-4 py-3 bg-[rgba(40,60,61,0.30)] rounded-[15px] flex flex-col gap-[8px]">

                        {/* Description */}
                        {(isEditing || editData.description) && (
                            <div className="flex flex-col gap-[8px] mt-2">
                                <h3 className="text-[#FFFEFF] text-lg font-semibold mb-1 px-1">Description</h3>
                                <div className="bg-[rgba(31.93,42.75,43.32,0.60)] rounded-[15px] p-4">
                                    {isEditing ? (
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="w-full bg-[#021313] text-white rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none min-h-[80px]"
                                            placeholder="Club description..."
                                        />
                                    ) : (
                                        <p className="text-white/90 text-sm">{editData.description}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        {(isEditing || editData.contactEmail || editData.contactPhone) && (
                            <div className="flex flex-col gap-[8px] mt-2">
                                <h3 className="text-[#FFFEFF] text-lg font-semibold mb-1 px-1">Contact</h3>
                                <div className="bg-[rgba(31.93,42.75,43.32,0.60)] rounded-[15px] p-4 space-y-3">
                                    <div>
                                        <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editData.contactEmail}
                                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                                className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                placeholder="contact@email.com"
                                            />
                                        ) : (
                                            <p className="text-white text-sm">{editData.contactEmail}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editData.contactPhone}
                                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                                className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                placeholder="+1-234-567-8900"
                                            />
                                        ) : (
                                            <p className="text-white text-sm">{editData.contactPhone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Entry/Booking Pricing */}
                        <div className="flex flex-col gap-[8px] mt-3">
                            <h3 className="text-[#FFFEFF] text-lg font-semibold mb-1 px-1">Entry/Booking</h3>
                            <div className="relative bg-[rgba(31.93,42.75,43.32,0.60)] rounded-[15px] overflow-hidden">
                                <div className="bg-[#263438] rounded-[15px] p-4 space-y-3">
                                    {isEditing ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Couple</label>
                                                <input
                                                    type="number"
                                                    value={editData.coupleEntryPrice}
                                                    onChange={(e) => handleInputChange('coupleEntryPrice', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Group</label>
                                                <input
                                                    type="number"
                                                    value={editData.groupEntryPrice}
                                                    onChange={(e) => handleInputChange('groupEntryPrice', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Male Stag</label>
                                                <input
                                                    type="number"
                                                    value={editData.maleStagEntryPrice}
                                                    onChange={(e) => handleInputChange('maleStagEntryPrice', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Female Stag</label>
                                                <input
                                                    type="number"
                                                    value={editData.femaleStagEntryPrice}
                                                    onChange={(e) => handleInputChange('femaleStagEntryPrice', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Cover Charge</label>
                                                <input
                                                    type="number"
                                                    value={editData.coverCharge}
                                                    onChange={(e) => handleInputChange('coverCharge', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-[#14FFEC] text-xs font-semibold mb-1 block">Redeem Details</label>
                                                <input
                                                    type="text"
                                                    value={editData.redeemDetails}
                                                    onChange={(e) => handleInputChange('redeemDetails', e.target.value)}
                                                    className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                                    placeholder="Redeem before 12 AM"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-white space-y-2">
                                            {editData.coupleEntryPrice && (
                                                <div className="flex justify-between">
                                                    <span className="text-[#14FFEC]">Couple Entry:</span>
                                                    <span>Rs {editData.coupleEntryPrice}</span>
                                                </div>
                                            )}
                                            {editData.groupEntryPrice && (
                                                <div className="flex justify-between">
                                                    <span className="text-[#14FFEC]">Group Entry:</span>
                                                    <span>Rs {editData.groupEntryPrice}</span>
                                                </div>
                                            )}
                                            {editData.coverCharge && (
                                                <div className="flex justify-between">
                                                    <span className="text-[#14FFEC]">Cover:</span>
                                                    <span>Rs {editData.coverCharge}</span>
                                                </div>
                                            )}
                                            {editData.redeemDetails && (
                                                <p className="text-sm text-white/80 mt-2">{editData.redeemDetails}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Location</h3>
                        <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[20px] p-4">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editData.address1}
                                        onChange={(e) => handleInputChange('address1', e.target.value)}
                                        className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        type="text"
                                        value={editData.address2}
                                        onChange={(e) => handleInputChange('address2', e.target.value)}
                                        className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                        placeholder="Address Line 2"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            value={editData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text"
                                            value={editData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                            placeholder="State"
                                        />
                                        <input
                                            type="text"
                                            value={editData.pincode}
                                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                                            className="w-full bg-[#021313] text-white rounded-lg px-3 py-2 text-sm border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-[#FF3B3B]/20 flex items-center justify-center mt-1">
                                            <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0" />
                                        </div>
                                        <p className="text-white text-sm">
                                            {[editData.address1, editData.address2, editData.city, editData.state, editData.pincode].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                    <div className="w-full h-[150px] rounded-[15px] overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59398.187240769305!2d78.96056867424174!3d21.14914597223921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1698233719734!5m2!1sen!2sin"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            title="Club Location"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Facilities</h3>
                        <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                            {isEditing ? (
                                <textarea
                                    value={editData.facilities}
                                    onChange={(e) => handleInputChange('facilities', e.target.value)}
                                    className="w-full bg-[#021313] text-white rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none min-h-[60px]"
                                    placeholder="Facilities (comma separated)"
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {editData.facilities?.split(',').map((facility: string, index: number) => (
                                        <TagComponent
                                            key={index}
                                            iconPath="/club/facilities/Clock (1).svg"
                                            label={facility.trim()}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Food */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Food</h3>
                        <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                            {isEditing ? (
                                <textarea
                                    value={editData.foodCuisines}
                                    onChange={(e) => handleInputChange('foodCuisines', e.target.value)}
                                    className="w-full bg-[#021313] text-white rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none min-h-[60px]"
                                    placeholder="Food (comma separated)"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {editData.foodCuisines?.split(',').map((cuisine: string, index: number) => (
                                        <TagComponent
                                            key={index}
                                            iconPath="/club/food/BowlFood (1).svg"
                                            label={cuisine.trim()}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Music */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Music</h3>
                        <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                            {isEditing ? (
                                <textarea
                                    value={editData.music}
                                    onChange={(e) => handleInputChange('music', e.target.value)}
                                    className="w-full bg-[#021313] text-white rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none min-h-[60px]"
                                    placeholder="Music (comma separated)"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {editData.music?.split(',').map((genre: string, index: number) => (
                                        <TagComponent
                                            key={index}
                                            iconPath="/club/music/Equalizer.svg"
                                            label={genre.trim()}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Bar</h3>
                        <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                            {isEditing ? (
                                <textarea
                                    value={editData.barOptions}
                                    onChange={(e) => handleInputChange('barOptions', e.target.value)}
                                    className="w-full bg-[#021313] text-white rounded-lg px-4 py-2 border border-[#14FFEC]/30 focus:border-[#14FFEC] outline-none min-h-[60px]"
                                    placeholder="Bar (comma separated)"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {editData.barOptions?.split(',').map((option: string, index: number) => (
                                        <TagComponent
                                            key={index}
                                            iconPath="/club/bar/Martini (1).svg"
                                            label={option.trim()}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
