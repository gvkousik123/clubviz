'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus, Trash2 } from 'lucide-react';
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
    const [isCheckingClubs, setIsCheckingClubs] = useState(true);
    const [adminDetails, setAdminDetails] = useState({ email: '', phone: '' });
    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0, city: '', state: '', pincode: '' });

    const [formData, setFormData] = useState({
        clubName: '',
        description: '',
        category: '',
        maxMembers: '',
        contactEmail: '',
        contactPhone: '',
        address1: '',
        address2: '',
        location: '',
        logo: null as File | null,
        foodCuisines: '',
        facilities: '',
        music: '',
        barOptions: '',
        coupleEntryPrice: '',
        groupEntryPrice: '',
        maleStagEntryPrice: '',
        femaleStagEntryPrice: '',
        coverCharge: '',
        redeemDetails: '',
        hasTimeRestriction: false,
        timeRestriction: '',
        inclusions: '',
        exclusions: ''
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
        const checkExistingClub = async () => {
            try {
                console.log('🔍 Checking if admin already has a club...');
                const response = await ClubService.getAllClubsAdmin();

                let clubsData: any[] = [];
                if (Array.isArray(response)) {
                    clubsData = response;
                } else if (response && typeof response === 'object' && 'data' in response) {
                    clubsData = (response as any).data || [];
                }

                if (clubsData && Array.isArray(clubsData) && clubsData.length > 0) {
                    console.log('⚠️ Admin already has a club! Redirecting to admin dashboard.');
                    toast({
                        title: "Club Already Exists",
                        description: "You can only have one club. Please edit your existing club or contact support.",
                        variant: "default",
                    });
                    // Redirect to admin dashboard
                    router.push('/admin');
                    return;
                }
                console.log('✅ No existing club found. User can create one.');
                setIsCheckingClubs(false);
            } catch (error) {
                console.error('❌ Error checking clubs:', error);
                setIsCheckingClubs(false);
            }
        };

        checkExistingClub();
    }, [router, toast]);

    useEffect(() => {
        if (isCheckingClubs) return; // Don't load anything until we verify club count

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
        router.push('/admin');
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

    const handleDeleteLogo = () => {
        setFormData({ ...formData, logo: null });
        setLogoPreview('');
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
        console.log('🗑️ Logo deleted');
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

    const handleDeleteFoodDrinksImage = (index: number) => {
        const newImages = [...foodDrinksImages];
        newImages.splice(index, 1);
        setFoodDrinksImages(newImages);
        const newPreviews = [...foodDrinksPreview];
        newPreviews[index] = '';
        setFoodDrinksPreview(newPreviews);
        if (foodDrinksRefs[index]?.current) {
            foodDrinksRefs[index].current.value = '';
        }
        console.log(`🗑️ Food/Drinks image ${index} deleted`);
    };

    const handleDeleteAmbienceImage = (index: number) => {
        const newImages = [...ambienceImages];
        newImages.splice(index, 1);
        setAmbienceImages(newImages);
        const newPreviews = [...ambiencePreview];
        newPreviews[index] = '';
        setAmbiencePreview(newPreviews);
        if (ambienceRefs[index]?.current) {
            ambienceRefs[index].current.value = '';
        }
        console.log(`🗑️ Ambience image ${index} deleted`);
    };

    const handleDeleteMenuImage = (index: number) => {
        const newImages = [...menuImages];
        newImages.splice(index, 1);
        setMenuImages(newImages);
        const newPreviews = [...menuPreview];
        newPreviews[index] = '';
        setMenuPreview(newPreviews);
        if (menuRefs[index]?.current) {
            menuRefs[index].current.value = '';
        }
        console.log(`🗑️ Menu image ${index} deleted`);
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

        if (!token) {
            toast({
                title: "Authentication Required",
                description: "Please log in as an admin to create clubs",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert logo to base64
            let logoBase64 = "";
            if (formData.logo) {
                logoBase64 = await fileToBase64(formData.logo);
            }

            // Convert food/drinks images to base64
            const foodDrinksBase64 = await Promise.all(
                foodDrinksImages.filter(img => img).map(async (img) => ({
                    type: "FOOD_DRINKS",
                    url: await fileToBase64(img)
                }))
            );

            // Convert ambience images to base64
            const ambienceBase64 = await Promise.all(
                ambienceImages.filter(img => img).map(async (img) => ({
                    type: "AMBIENCE",
                    url: await fileToBase64(img)
                }))
            );

            // Convert menu images to base64
            const menuBase64 = await Promise.all(
                menuImages.filter(img => img).map(async (img) => ({
                    type: "MENU",
                    url: await fileToBase64(img)
                }))
            );

            // Combine all images
            const allImages = [...foodDrinksBase64, ...ambienceBase64, ...menuBase64];

            // Build arrays from comma-separated strings
            const foodCuisinesArray = formData.foodCuisines
                ? formData.foodCuisines.split(',').map(item => item.trim()).filter(item => item)
                : [];
            const facilitiesArray = formData.facilities
                ? formData.facilities.split(',').map(item => item.trim()).filter(item => item)
                : [];
            const musicArray = selectedMusicGenres.length > 0
                ? selectedMusicGenres.map(genre => genre.name || genre)
                : (formData.music ? formData.music.split(',').map(item => item.trim()).filter(item => item) : []);
            const barOptionsArray = formData.barOptions
                ? formData.barOptions.split(',').map(item => item.trim()).filter(item => item)
                : [];

            // Build inclusions/exclusions arrays
            const inclusionsArray = formData.inclusions
                ? formData.inclusions.split(',').map(item => item.trim()).filter(item => item)
                : [];
            const exclusionsArray = formData.exclusions
                ? formData.exclusions.split(',').map(item => item.trim()).filter(item => item)
                : [];

            // ✅ BUILD PAYLOAD MATCHING ClubCreateRequest INTERFACE
            const clubData: any = {
                "name": formData.clubName.trim(),
                "description": formData.description.trim() || "",
                "logo": logoBase64,
                "category": formData.category.trim() || "NIGHTCLUB",
                "maxMembers": parseInt(formData.maxMembers) || 100,
                "contactEmail": formData.contactEmail.trim() || adminDetails.email,
                "contactPhone": formData.contactPhone.trim() || adminDetails.phone,
                "images": allImages,
                "locationText": {
                    "address1": formData.address1.trim() || "",
                    "address2": formData.address2.trim() || "",
                    "city": selectedLocation.city || "",
                    "state": selectedLocation.state || "",
                    "pincode": selectedLocation.pincode || ""
                },
                "locationMap": {
                    "lat": selectedLocation.lat || 0,
                    "lng": selectedLocation.lng || 0
                },
                "foodCuisines": foodCuisinesArray,
                "facilities": facilitiesArray,
                "music": musicArray,
                "barOptions": barOptionsArray,
                "entryPricing": {
                    "coupleEntryPrice": parseFloat(formData.coupleEntryPrice) || 0,
                    "groupEntryPrice": parseFloat(formData.groupEntryPrice) || 0,
                    "maleStagEntryPrice": parseFloat(formData.maleStagEntryPrice) || 0,
                    "femaleStagEntryPrice": parseFloat(formData.femaleStagEntryPrice) || 0,
                    "coverCharge": parseFloat(formData.coverCharge) || 0,
                    "redeemDetails": formData.redeemDetails || "",
                    "hasTimeRestriction": formData.hasTimeRestriction,
                    "timeRestriction": formData.timeRestriction || "",
                    "inclusions": inclusionsArray,
                    "exclusions": exclusionsArray
                }
            };

            console.log('🚀 Creating Club with Images - Payload:', clubData);
            console.log('📡 API Call: POST /clubs/create-json-with-images');
            console.log('📸 Total Images:', allImages.length);

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

        } catch (error: any) {
            console.error('❌ Club creation error:', error);

            let errorMessage = 'Failed to create club. Please try again.';

            if (error.response?.data?.message) {
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
            {/* Show loading state while checking for existing clubs */}
            {isCheckingClubs && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#14FFEC] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#14FFEC]">Checking club status...</p>
                    </div>
                </div>
            )}

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
            <div className="px-0 pt-[100px] pb-20 relative z-40" style={{ opacity: isCheckingClubs ? 0.5 : 1, pointerEvents: isCheckingClubs ? 'none' : 'auto' }}>
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col items-center gap-[20px] p-[20px_14px_30px]">
                    {/* Logo Upload */}
                    <div
                        onClick={handleLogoUpload}
                        className="w-[160px] h-[160px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden group hover:bg-[#0D1F1F]/70 transition-all"
                    >
                        {logoPreview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-full h-full object-cover rounded-[13px]"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[13px] flex items-center justify-center gap-2 flex-col">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLogoUpload();
                                        }}
                                        className="px-2 py-1 bg-[#14FFEC] text-black rounded-lg text-xs font-semibold hover:bg-[#14FFEC]/80 transition-all"
                                    >
                                        Replace
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLogo();
                                        }}
                                        className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all flex items-center gap-1"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img
                                    src="/admin/upload.svg"
                                    alt="Upload"
                                    width={40}
                                    height={40}
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

                    {/* Description */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Description</label>
                        </div>
                        <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold min-h-[80px]"
                                placeholder="Enter club description"
                            />
                        </div>
                    </div>

                    {/* Category & Max Members */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-[11px]">
                            <div className="px-5">
                                <label className="text-[#14FFEC] font-semibold text-base">Category</label>
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="e.g. NIGHT_CLUB"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[11px]">
                            <div className="px-5">
                                <label className="text-[#14FFEC] font-semibold text-base">Max Members</label>
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="number"
                                    value={formData.maxMembers}
                                    onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-[11px]">
                            <div className="px-5">
                                <label className="text-[#14FFEC] font-semibold text-base">Contact Email</label>
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder={adminDetails.email}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[11px]">
                            <div className="px-5">
                                <label className="text-[#14FFEC] font-semibold text-base">Contact Phone</label>
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder={adminDetails.phone}
                                />
                            </div>
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
                                            className="w-[130px] h-[130px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden group hover:bg-[#0D1F1F]/70 transition-all"
                                        >
                                            {foodDrinksPreview[index] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={foodDrinksPreview[index]}
                                                        alt={`Food/Drinks ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-[13px]"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[13px] flex items-center justify-center gap-1 flex-col">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleImageUpload(foodDrinksRefs[index]);
                                                            }}
                                                            className="px-2 py-1 bg-[#14FFEC] text-black rounded-lg text-xs font-semibold hover:bg-[#14FFEC]/80 transition-all"
                                                        >
                                                            Replace
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteFoodDrinksImage(index);
                                                            }}
                                                            className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
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
                                            className="w-[130px] h-[130px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden group hover:bg-[#0D1F1F]/70 transition-all"
                                        >
                                            {ambiencePreview[index] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={ambiencePreview[index]}
                                                        alt={`Ambience ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-[13px]"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[13px] flex items-center justify-center gap-1 flex-col">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleImageUpload(ambienceRefs[index]);
                                                            }}
                                                            className="px-2 py-1 bg-[#14FFEC] text-black rounded-lg text-xs font-semibold hover:bg-[#14FFEC]/80 transition-all"
                                                        >
                                                            Replace
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteAmbienceImage(index);
                                                            }}
                                                            className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
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
                                            className="w-[130px] h-[130px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex items-center justify-center cursor-pointer overflow-hidden group hover:bg-[#0D1F1F]/70 transition-all"
                                        >
                                            {menuPreview[index] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={menuPreview[index]}
                                                        alt={`Menu ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-[13px]"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[13px] flex items-center justify-center gap-1 flex-col">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleImageUpload(menuRefs[index]);
                                                            }}
                                                            className="px-2 py-1 bg-[#14FFEC] text-black rounded-lg text-xs font-semibold hover:bg-[#14FFEC]/80 transition-all"
                                                        >
                                                            Replace
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteMenuImage(index);
                                                            }}
                                                            className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
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
                            className="w-full h-[55px] bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5 flex items-center justify-between cursor-pointer mb-2"
                        >
                            <span className="text-white text-base font-semibold">
                                {selectedLocation.city && selectedLocation.state
                                    ? `${selectedLocation.city}, ${selectedLocation.state}${selectedLocation.pincode ? ' - ' + selectedLocation.pincode : ''}`
                                    : 'Select on Map (City/State)'}
                            </span>
                            <ChevronRight className="text-[#14FFEC]" size={18} />
                        </div>

                        {/* Additional Address Fields */}
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.address1}
                                    onChange={(e) => handleInputChange('address1', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Address Line 1"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.address2}
                                    onChange={(e) => handleInputChange('address2', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Address Line 2 (Optional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Pricing</label>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-3">
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[10px] px-4">
                                <label className="text-xs text-[#9D9C9C]">Couple Entry</label>
                                <input
                                    type="number"
                                    value={formData.coupleEntryPrice}
                                    onChange={(e) => handleInputChange('coupleEntryPrice', e.target.value)}
                                    className="w-full bg-transparent text-white outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[10px] px-4">
                                <label className="text-xs text-[#9D9C9C]">Group Entry</label>
                                <input
                                    type="number"
                                    value={formData.groupEntryPrice}
                                    onChange={(e) => handleInputChange('groupEntryPrice', e.target.value)}
                                    className="w-full bg-transparent text-white outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[10px] px-4">
                                <label className="text-xs text-[#9D9C9C]">Male Stag</label>
                                <input
                                    type="number"
                                    value={formData.maleStagEntryPrice}
                                    onChange={(e) => handleInputChange('maleStagEntryPrice', e.target.value)}
                                    className="w-full bg-transparent text-white outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[10px] px-4">
                                <label className="text-xs text-[#9D9C9C]">Female Stag</label>
                                <input
                                    type="number"
                                    value={formData.femaleStagEntryPrice}
                                    onChange={(e) => handleInputChange('femaleStagEntryPrice', e.target.value)}
                                    className="w-full bg-transparent text-white outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[10px] px-4 col-span-2">
                                <label className="text-xs text-[#9D9C9C]">Cover Charge</label>
                                <input
                                    type="number"
                                    value={formData.coverCharge}
                                    onChange={(e) => handleInputChange('coverCharge', e.target.value)}
                                    className="w-full bg-transparent text-white outline-none text-base font-semibold"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Details & Rules */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Details & Rules</label>
                        </div>

                        <div className="space-y-3">
                            {/* Time Restriction Toggle */}
                            <div className="px-5 flex items-center justify-between">
                                <span className="text-white">Has Time Restriction?</span>
                                <input
                                    type="checkbox"
                                    checked={formData.hasTimeRestriction}
                                    onChange={(e) => setFormData({ ...formData, hasTimeRestriction: e.target.checked })}
                                    className="w-5 h-5 accent-[#14FFEC]"
                                />
                            </div>

                            {formData.hasTimeRestriction && (
                                <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                    <input
                                        type="text"
                                        value={formData.timeRestriction}
                                        onChange={(e) => handleInputChange('timeRestriction', e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                        placeholder="Time Restriction (e.g. 10 PM)"
                                    />
                                </div>
                            )}

                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.redeemDetails}
                                    onChange={(e) => handleInputChange('redeemDetails', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Redeem Details"
                                />
                            </div>

                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <textarea
                                    value={formData.inclusions}
                                    onChange={(e) => handleInputChange('inclusions', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold min-h-[60px]"
                                    placeholder="Inclusions (comma separated)"
                                />
                            </div>

                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <textarea
                                    value={formData.exclusions}
                                    onChange={(e) => handleInputChange('exclusions', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold min-h-[60px]"
                                    placeholder="Exclusions (comma separated)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Manual Tags Entry */}
                    <div className="w-full flex flex-col gap-[11px]">
                        <div className="px-5">
                            <label className="text-[#14FFEC] font-semibold text-base">Tags (Manual Entry)</label>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.foodCuisines}
                                    onChange={(e) => handleInputChange('foodCuisines', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Food Cuisines (comma separated)"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.facilities}
                                    onChange={(e) => handleInputChange('facilities', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Facilities (comma separated)"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.music}
                                    onChange={(e) => handleInputChange('music', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Music (comma separated)"
                                />
                            </div>
                            <div className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                <input
                                    type="text"
                                    value={formData.barOptions}
                                    onChange={(e) => handleInputChange('barOptions', e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                    placeholder="Bar Options (comma separated)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Club Tags (Navigation - kept for reference or alternate selection) */}
                    <div className="w-full flex flex-col gap-[11px] opacity-70">
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
