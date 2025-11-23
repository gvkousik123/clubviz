'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LookupService, AllLookupData } from '@/lib/services/lookup.service';
import { ClubService } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';
import { fileToBase64 } from '@/lib/image-utils';
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
    const [foodDrinksImages, setFoodDrinksImages] = useState<File[]>([]);
    const [ambienceImages, setAmbienceImages] = useState<File[]>([]);
    const [menuImages, setMenuImages] = useState<File[]>([]);
    const [foodDrinksPreview, setFoodDrinksPreview] = useState<string[]>(['', '', '']);
    const [ambiencePreview, setAmbiencePreview] = useState<string[]>(['', '', '']);
    const [menuPreview, setMenuPreview] = useState<string[]>(['', '', '']);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [lookupData, setLookupData] = useState<AllLookupData>({});
    const [isLoadingLookup, setIsLoadingLookup] = useState(true);
    const [selectedMusicGenres, setSelectedMusicGenres] = useState<any[]>([]);

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

        // Load selected music genres from localStorage
        const loadSelectedMusicGenres = () => {
            try {
                const musicGenresData = localStorage.getItem('clubviz-selected-music-genres');
                if (musicGenresData) {
                    const genres = JSON.parse(musicGenresData);
                    setSelectedMusicGenres(genres);
                    console.log('🎵 Loaded Selected Music Genres:', genres);
                }
            } catch (error) {
                console.error('Failed to load music genres:', error);
            }
        };

        fetchLookupData();
        loadAdminDetails();
        loadSelectedLocation();
        loadSelectedMusicGenres();

        // Listen for location updates from the location page
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'clubviz-selected-location' && e.newValue) {
                const location = JSON.parse(e.newValue);
                setSelectedLocation(location);
                console.log('📍 Location Updated:', location);
            } else if (e.key === 'clubviz-selected-music-genres' && e.newValue) {
                const genres = JSON.parse(e.newValue);
                setSelectedMusicGenres(genres);
                console.log('🎵 Music Genres Updated:', genres);
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
            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
                console.log('✅ Logo preview generated');
            };
            reader.readAsDataURL(file);
            console.log('📸 Logo file stored:', file.name, file.size, 'bytes');
        }
    };

    const handleFoodDrinksImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...foodDrinksImages];
            newImages[index] = file;
            setFoodDrinksImages(newImages);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...foodDrinksPreview];
                newPreviews[index] = event.target?.result as string;
                setFoodDrinksPreview(newPreviews);
                console.log(`✅ Food/Drinks image ${index} preview generated`);
            };
            reader.readAsDataURL(file);
            console.log(`📸 Food/Drinks image ${index} uploaded:`, file.name, file.size, 'bytes');
        }
    };

    const handleAmbienceImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...ambienceImages];
            newImages[index] = file;
            setAmbienceImages(newImages);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...ambiencePreview];
                newPreviews[index] = event.target?.result as string;
                setAmbiencePreview(newPreviews);
                console.log(`✅ Ambience image ${index} preview generated`);
            };
            reader.readAsDataURL(file);
            console.log(`📸 Ambience image ${index} uploaded:`, file.name, file.size, 'bytes');
        }
    };

    const handleMenuImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...menuImages];
            newImages[index] = file;
            setMenuImages(newImages);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...menuPreview];
                newPreviews[index] = event.target?.result as string;
                setMenuPreview(newPreviews);
                console.log(`✅ Menu image ${index} preview generated`);
            };
            reader.readAsDataURL(file);
            console.log(`📸 Menu image ${index} uploaded:`, file.name, file.size, 'bytes');
        }
    };

    const handleImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleNavigate = (path: string) => {
        // Navigate to specific sections
        if (path === '/location') {
            router.push('/admin/add-location');
        } else if (path === '/tags/music') {
            router.push('/admin/tags/music');
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

        // Check if user is logged in and has admin role
        const token = typeof window !== 'undefined' ? localStorage.getItem('clubviz-accessToken') : null;
        const userData = typeof window !== 'undefined' ? localStorage.getItem('clubviz-user') : null;

        if (!token) {
            toast({
                title: "Authentication Required",
                description: "Please log in as an admin to create clubs",
                variant: "destructive",
            });
            console.error('❌ No access token found. Please login as admin.');
            return;
        }

        if (userData) {
            const user = JSON.parse(userData);
            console.log('👤 Current User:', user);
            console.log('🔑 User Role:', user.role || user.roles);

            // Role can be string, array, or object - check all formats
            const roleStr = JSON.stringify(user.role || user.roles || '');
            const hasAdminRole = roleStr.includes('ADMIN');

            console.log('✅ Has Admin Role:', hasAdminRole);

            if (!hasAdminRole) {
                toast({
                    title: "Permission Denied",
                    description: "You need ADMIN or SUPER_ADMIN role to create clubs",
                    variant: "destructive",
                });
                console.error('❌ User does not have admin role:', user.role || user.roles);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            // 🔴 REQUIRED: Validate club name
            if (!formData.clubName.trim()) {
                throw new Error('Club name is required');
            }

            // ✅ CONVERT LOGO TO BASE64
            let logoBase64 = '';
            if (formData.logo) {
                try {
                    logoBase64 = await fileToBase64(formData.logo);
                    console.log('✅ Logo converted to base64');
                } catch (error) {
                    console.warn('⚠️ Failed to convert logo:', error);
                }
            }

            // ✅ COLLECT AND CONVERT ALL IMAGES TO BASE64
            const allImages: Array<{ type: string; data: string }> = [];

            // Process Food/Drinks images
            for (let i = 0; i < foodDrinksImages.length; i++) {
                if (foodDrinksImages[i]) {
                    try {
                        const base64Data = await fileToBase64(foodDrinksImages[i]);
                        allImages.push({
                            type: 'foodDrinks',
                            data: base64Data
                        });
                        console.log(`✅ Food/Drinks image ${i + 1} converted to base64`);
                    } catch (error) {
                        console.warn(`⚠️ Failed to convert food/drinks image ${i + 1}:`, error);
                    }
                }
            }

            // Process Ambience images
            for (let i = 0; i < ambienceImages.length; i++) {
                if (ambienceImages[i]) {
                    try {
                        const base64Data = await fileToBase64(ambienceImages[i]);
                        allImages.push({
                            type: 'ambience',
                            data: base64Data
                        });
                        console.log(`✅ Ambience image ${i + 1} converted to base64`);
                    } catch (error) {
                        console.warn(`⚠️ Failed to convert ambience image ${i + 1}:`, error);
                    }
                }
            }

            // Process Menu images
            for (let i = 0; i < menuImages.length; i++) {
                if (menuImages[i]) {
                    try {
                        const base64Data = await fileToBase64(menuImages[i]);
                        allImages.push({
                            type: 'menu',
                            data: base64Data
                        });
                        console.log(`✅ Menu image ${i + 1} converted to base64`);
                    } catch (error) {
                        console.warn(`⚠️ Failed to convert menu image ${i + 1}:`, error);
                    }
                }
            }

            // ✅ BUILD PAYLOAD WITH BASE64 IMAGES
            const clubData: any = {
                "name": formData.clubName.trim(), // REQUIRED
            };

            // Add logo if available (base64 format)
            if (logoBase64) {
                clubData.logo = logoBase64;
                console.log('📸 Logo added to payload (base64)');
            }

            // Add images if available (base64 format)
            if (allImages.length > 0) {
                clubData.images = allImages;
                console.log(`📸 ${allImages.length} images added to payload (base64)`);
            }

            // Add optional fields only if they have values
            if (adminDetails.email && adminDetails.email !== 'admin@example.com') {
                clubData.contactEmail = adminDetails.email;
            }

            if (adminDetails.phone && adminDetails.phone !== '+91-9876543210') {
                clubData.contactPhone = adminDetails.phone;
            }

            // Add location if available
            if (selectedLocation.state) clubData.locationTextState = selectedLocation.state;
            if (selectedLocation.city) clubData.locationTextCity = selectedLocation.city;
            if (selectedLocation.pincode) clubData.locationTextPincode = selectedLocation.pincode;
            if (selectedLocation.lat) clubData.locationLat = selectedLocation.lat;
            if (selectedLocation.lng) clubData.locationLng = selectedLocation.lng;

            console.log('🚀 Creating club with base64 images:', {
                name: clubData.name,
                hasLogo: !!clubData.logo,
                logoSize: clubData.logo ? clubData.logo.length : 0,
                imageCount: clubData.images?.length || 0,
                images: clubData.images?.map((img: any) => ({
                    type: img.type,
                    dataSize: img.data.length
                }))
            });
            console.log('📡 API Call: POST /clubs/create-json-with-images');
            console.log('📋 Full Payload:', JSON.stringify(clubData, null, 2));

            // Call the service to create the club
            const response = await ClubService.createClub(clubData);

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

        } catch (error: any) {
            console.error('❌ Club creation error:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error message:', error.message);

            let errorMessage = 'Failed to create club. Please try again.';

            // Check for specific error responses
            if (error.response?.status === 403 || error.response?.status === 401) {
                errorMessage = 'Permission denied. You need ADMIN or SUPER_ADMIN role to create clubs. Please login with admin credentials.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: "Error",
                description: errorMessage,
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
                        className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden"
                    >
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="w-full h-full object-cover rounded-[13px]"
                            />
                        ) : (
                            <>
                                <img
                                    src="/admin/upload.svg"
                                    alt="Upload"
                                    width={30}
                                    height={30}
                                    className="mb-2"
                                />
                                <p className="text-white text-center text-[12px] font-semibold leading-[12px] tracking-[0.5px]">Upload logo</p>
                            </>
                        )}
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
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden"
                                        >
                                            {foodDrinksPreview[index] ? (
                                                <img
                                                    src={foodDrinksPreview[index]}
                                                    alt={`Food/Drinks ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-[13px]"
                                                />
                                            ) : (
                                                <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                    <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                                </div>
                                            )}
                                            <input
                                                ref={foodDrinksRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFoodDrinksImageChange(e, index)}
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
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden"
                                        >
                                            {ambiencePreview[index] ? (
                                                <img
                                                    src={ambiencePreview[index]}
                                                    alt={`Ambience ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-[13px]"
                                                />
                                            ) : (
                                                <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                    <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                                </div>
                                            )}
                                            <input
                                                ref={ambienceRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleAmbienceImageChange(e, index)}
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
                                            className="w-[100px] h-[100px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden"
                                        >
                                            {menuPreview[index] ? (
                                                <img
                                                    src={menuPreview[index]}
                                                    alt={`Menu ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-[13px]"
                                                />
                                            ) : (
                                                <div className="w-[25px] h-[25px] bg-[#14FFEC] rounded-full flex items-center justify-center">
                                                    <Plus className="w-[12px] h-[12px] text-[#004342]" />
                                                </div>
                                            )}
                                            <input
                                                ref={menuRefs[index]}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleMenuImageChange(e, index)}
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
                                        <div className="flex items-center gap-3">
                                            <span className="text-white text-base font-semibold">{tag.label}</span>
                                            {tag.key === 'music' && selectedMusicGenres.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[#14FFEC] text-xs bg-[#14FFEC]/10 px-2 py-1 rounded-full">
                                                        {selectedMusicGenres.length} selected
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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
