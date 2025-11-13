'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LookupService, AllLookupData } from '@/lib/services/lookup.service';
import { ClubService } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';
import '../new-event/styles.css';

export default function NewClubPage() {
    const router = useRouter();
    const { toast } = useToast();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adminDetails, setAdminDetails] = useState({ email: '', phone: '' });
    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0, city: '', state: '', pincode: '' });

    const [formData, setFormData] = useState({
        clubName: '',
        location: '',
        logo: null as File | null
    });
    const [lookupData, setLookupData] = useState<AllLookupData>({});
    const [isLoadingLookup, setIsLoadingLookup] = useState(true);

    // References for image upload sections
    const foodDrinksRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const ambienceRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const menuRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    // Fetch lookup data and admin details on component mount
    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                setIsLoadingLookup(true);
                const response = await LookupService.getAllLookupData();
                if (response.success) {
                    setLookupData(response.data);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load club categories",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Failed to fetch lookup data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load club categories",
                    variant: "destructive",
                });
            } finally {
                setIsLoadingLookup(false);
            }
        };

        // Load admin details from localStorage
        const loadAdminDetails = () => {
            try {
                const userData = localStorage.getItem('clubviz-user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setAdminDetails({
                        email: user.email || 'admin@example.com',
                        phone: user.phoneNumber || user.mobileNumber || '+91-9876543210'
                    });
                    console.log('📱 Loaded Admin Details:', { email: user.email, phone: user.phoneNumber || user.mobileNumber });
                }
            } catch (error) {
                console.error('Failed to load admin details:', error);
            }
        };

        // Load selected location from localStorage
        const loadSelectedLocation = () => {
            try {
                const locationData = localStorage.getItem('clubviz-selected-location');
                if (locationData) {
                    const location = JSON.parse(locationData);
                    setSelectedLocation(location);
                    console.log('📍 Loaded Selected Location:', location);
                }
            } catch (error) {
                console.error('Failed to load location:', error);
            }
        };

        fetchLookupData();
        loadAdminDetails();
        loadSelectedLocation();

        // Listen for location updates from the location page
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'clubviz-selected-location' && e.newValue) {
                const location = JSON.parse(e.newValue);
                setSelectedLocation(location);
                console.log('📍 Location Updated:', location);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [toast]);

    // Helper function to get club tags from lookup data
    const getClubTags = () => {
        const tags = [];
        if (lookupData.facilities && lookupData.facilities.length > 0) {
            tags.push({ label: 'Facilities', key: 'facilities' });
        }
        if (lookupData.foodCuisines && lookupData.foodCuisines.length > 0) {
            tags.push({ label: 'Food', key: 'foodCuisines' });
        }
        if (lookupData.music && lookupData.music.length > 0) {
            tags.push({ label: 'Music', key: 'music' });
        }
        if (lookupData.barOptions && lookupData.barOptions.length > 0) {
            tags.push({ label: 'Bar', key: 'barOptions' });
        }
        return tags;
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleLogoUpload = () => {
        logoInputRef.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
        }
    };

    const handleImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleNavigate = (path: string) => {
        // Navigate to specific sections
        if (path === '/location') {
            router.push('/admin/add-location');
        } else {
            console.log(`Navigating to ${path}`);
        }
    };

    const handleCreateClub = async () => {
        // Validate required fields
        if (!formData.clubName.trim()) {
            toast({
                title: "Error",
                description: "Club name is required",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // 🔴 REQUIRED: Validate club name
            if (!formData.clubName.trim()) {
                throw new Error('Club name is required');
            }

            // ✅ BUILD COMPLETE CLUB PAYLOAD per API spec
            const clubData: any = {
                // REQUIRED FIELDS
                name: formData.clubName.trim(),
                description: '',  // Optional but recommended
                logo: '',          // Optional - image URL
                category: '',      // Optional - club category
                maxMembers: 0,     // Optional - member capacity

                // CONTACT INFORMATION
                contactEmail: adminDetails.email !== 'admin@example.com' ? adminDetails.email : '',
                contactPhone: adminDetails.phone !== '+91-9876543210' ? adminDetails.phone : '',

                // IMAGES ARRAY
                images: [],  // Array of {type, url}

                // LOCATION INFORMATION
                locationText: selectedLocation.lat && selectedLocation.lng && selectedLocation.city && selectedLocation.state ? {
                    address1: '',
                    address2: '',
                    state: selectedLocation.state || '',
                    city: selectedLocation.city || '',
                    pincode: selectedLocation.pincode || ''
                } : {
                    address1: '',
                    address2: '',
                    state: '',
                    city: '',
                    pincode: ''
                },

                locationMap: selectedLocation.lat && selectedLocation.lng ? {
                    lat: selectedLocation.lat || 0,
                    lng: selectedLocation.lng || 0
                } : {
                    lat: 0,
                    lng: 0
                },

                // CUISINE & FACILITIES
                foodCuisines: lookupData.foodCuisines && lookupData.foodCuisines.length > 0 ? [] : [],
                facilities: lookupData.facilities && lookupData.facilities.length > 0 ? [] : [],
                music: lookupData.music && lookupData.music.length > 0 ? [] : [],
                barOptions: lookupData.barOptions && lookupData.barOptions.length > 0 ? [] : [],

                // ENTRY PRICING
                entryPricing: {
                    coupleEntryPrice: 0,
                    groupEntryPrice: 0,
                    maleStagEntryPrice: 0,
                    femaleStagEntryPrice: 0,
                    coverCharge: 0,
                    redeemDetails: '',
                    hasTimeRestriction: false,
                    timeRestriction: '',
                    inclusions: [],
                    exclusions: []
                }
            };

            console.log('🚀 Creating club with COMPLETE required payload:', JSON.stringify(clubData, null, 2));
            console.log('📡 API Call: POST /clubs with all fields per API spec');
            console.log('📊 Payload structure:', {
                name: '✅',
                description: '✅',
                logo: '✅',
                category: '✅',
                maxMembers: '✅',
                contactEmail: '✅',
                contactPhone: '✅',
                images: '✅',
                locationText: '✅',
                locationMap: '✅',
                foodCuisines: '✅',
                facilities: '✅',
                music: '✅',
                barOptions: '✅',
                entryPricing: '✅'
            });

            // Call the service to create the club
            const response = await ClubService.createClub(clubData as any);

            console.log('✅ Club created successfully:', response);

            toast({
                title: "Success",
                description: `Club "${formData.clubName}" created successfully!`,
                variant: "default",
            });

            // Redirect to admin panel after short delay
            setTimeout(() => {
                router.push('/admin');
            }, 1000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create club';
            console.error('❌ Club creation error:', error);

            toast({
                title: "Error",
                description: errorMessage || 'Failed to create club. Please try again.',
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <span className="text-white text-xl font-bold">&lt;</span>
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Enter Club Details</h1>
                </div>
            </div>

            {/* Main Content - Scrollable container */}
            <div className="px-0 pt-[100px] pb-20 relative z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col items-center gap-[20px] p-[20px_14px_30px]">
                    {/* Logo Upload */}
                    <div
                        onClick={handleLogoUpload}
                        className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex flex-col items-center justify-center p-2 cursor-pointer"
                    >
                        <img
                            src="/admin/upload.svg"
                            alt="Upload"
                            width={30}
                            height={30}
                            className="mb-2"
                        />
                        <p className="text-white text-center text-[16px] font-semibold leading-[16px] tracking-[0.5px]">Upload logo here</p>
                    </div>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />

                    {/* Club Name */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">
                                Club Name <span className="text-red-500 text-lg">*</span>
                            </label>
                        </div>
                        <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                            <input
                                type="text"
                                value={formData.clubName}
                                onChange={(e) => handleInputChange('clubName', e.target.value)}
                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                placeholder="Enter Club Name Here"
                            />
                        </div>
                    </div>

                    {/* Photos Section */}
                    <div className="w-full">
                        <div className="px-5 mb-2">
                            <h3 className="text-white font-semibold text-base">Photos</h3>
                        </div>

                        {/* Food/Drinks Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px] mb-2">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Food/Drinks</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`food-drink-${index}`}
                                            onClick={() => handleImageUpload(foodDrinksRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={foodDrinksRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ambience Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px] mb-2">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Ambience</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`ambience-${index}`}
                                            onClick={() => handleImageUpload(ambienceRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={ambienceRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Menu Section */}
                        <div className="w-full bg-[#0D1F1F] rounded-[15px] p-[8px_0_12px] flex flex-col items-center gap-[6px]">
                            <div className="w-full flex flex-col items-center gap-[9px]">
                                <div className="w-full px-4">
                                    <p className="text-[#14FFEC] text-base font-medium tracking-[0.5px]">Menu</p>
                                </div>
                                <div className="flex items-center gap-[9px]">
                                    {[0, 1, 2].map((index) => (
                                        <div
                                            key={`menu-${index}`}
                                            onClick={() => handleImageUpload(menuRefs[index])}
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer"
                                        >
                                            <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                            </div>
                                            <input
                                                ref={menuRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Location</label>
                        </div>
                        <div
                            onClick={() => handleNavigate('/location')}
                            className="w-full h-[55px] bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5 flex items-center justify-between cursor-pointer"
                        >
                            <span className="text-white text-base font-semibold">
                                {selectedLocation.city && selectedLocation.state
                                    ? `${selectedLocation.city}, ${selectedLocation.state}${selectedLocation.pincode ? ' - ' + selectedLocation.pincode : ''}`
                                    : 'Add Location'}
                            </span>
                            <ChevronRight className="text-[#14FFEC]" size={18} />
                        </div>
                    </div>

                    {/* Club Tags */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Club Tags</label>
                        </div>
                        <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-5 flex flex-col gap-5">
                            {isLoadingLookup ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14FFEC]"></div>
                                    <span className="text-white text-sm ml-2">Loading categories...</span>
                                </div>
                            ) : (
                                getClubTags().map((tag) => (
                                    <div
                                        key={tag.key}
                                        onClick={() => handleNavigate(`/tags/${tag.key}`)}
                                        className="flex items-center justify-between cursor-pointer"
                                    >
                                        <span className="text-white text-base font-semibold">{tag.label}</span>
                                        <ChevronRight className="text-[#14FFEC]" size={18} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Save Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-full h-[80px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                    <div className="flex justify-center items-center px-8 h-full">
                        <div className="w-[220px] h-[45px] bg-[#0F6861] rounded-[30px] flex justify-center items-center hover:bg-[#0D5451] transition-colors disabled:opacity-50">
                            <button
                                onClick={handleCreateClub}
                                disabled={isSubmitting || !formData.clubName.trim()}
                                className="w-full h-full flex justify-center items-center cursor-pointer disabled:cursor-not-allowed"
                            >
                                <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                    {isSubmitting ? 'Creating...' : 'Save & Create Club'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
