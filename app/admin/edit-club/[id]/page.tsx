'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LookupService, AllLookupData } from '@/lib/services/lookup.service';
import { ClubService, Club } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';
import '../../new-event/styles.css';

export default function EditClubPage() {
    const router = useRouter();
    const params = useParams();
    const clubId = params.id as string;
    const { toast } = useToast();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingClub, setIsLoadingClub] = useState(true);
    const [adminDetails, setAdminDetails] = useState({ email: '', phone: '' });
    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0, city: '', state: '', pincode: '' });
    const [currentClub, setCurrentClub] = useState<Club | null>(null);

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
    const foodDrinksRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const ambienceRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const menuRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    // Fetch club data, lookup data and admin details on component mount
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                setIsLoadingClub(true);
                console.log('📡 Fetching club data for ID:', clubId);
                const response = await ClubService.getClubById(clubId);

                if (response.success && response.data) {
                    const club = response.data;
                    setCurrentClub(club);

                    // Pre-fill form data
                    setFormData({
                        clubName: club.name || '',
                        description: club.description || '',
                        category: club.category || '',
                        maxMembers: club.maxMembers ? String(club.maxMembers) : '',
                        contactEmail: club.contactEmail || '',
                        contactPhone: club.contactPhone || '',
                        address1: club.locationText?.address1 || '',
                        address2: club.locationText?.address2 || '',
                        location: club.locationText?.city || '',
                        logo: null,
                        foodCuisines: club.foodCuisines ? club.foodCuisines.join(', ') : '',
                        facilities: club.facilities ? club.facilities.join(', ') : '',
                        music: club.music ? club.music.join(', ') : '',
                        barOptions: club.barOptions ? club.barOptions.join(', ') : '',
                        coupleEntryPrice: club.entryPricing?.coupleEntryPrice ? String(club.entryPricing.coupleEntryPrice) : '',
                        groupEntryPrice: club.entryPricing?.groupEntryPrice ? String(club.entryPricing.groupEntryPrice) : '',
                        maleStagEntryPrice: club.entryPricing?.maleStagEntryPrice ? String(club.entryPricing.maleStagEntryPrice) : '',
                        femaleStagEntryPrice: club.entryPricing?.femaleStagEntryPrice ? String(club.entryPricing.femaleStagEntryPrice) : '',
                        coverCharge: club.entryPricing?.coverCharge ? String(club.entryPricing.coverCharge) : '',
                        redeemDetails: club.entryPricing?.redeemDetails || '',
                        hasTimeRestriction: club.entryPricing?.hasTimeRestriction || false,
                        timeRestriction: club.entryPricing?.timeRestriction || '',
                        inclusions: club.entryPricing?.inclusions ? club.entryPricing.inclusions.join(', ') : '',
                        exclusions: club.entryPricing?.exclusions ? club.entryPricing.exclusions.join(', ') : ''
                    });

                    // Set logo preview from existing club data
                    if (club.logo || club.logoUrl) {
                        setLogoPreview(club.logo || club.logoUrl);
                    }

                    // Pre-fill location data (Keep using selectedLocation state for consistency)
                    if (club.locationText || club.locationMap) {
                        setSelectedLocation({
                            lat: club.locationMap?.lat || 0,
                            lng: club.locationMap?.lng || 0,
                            city: club.locationText?.city || '',
                            state: club.locationText?.state || '',
                            pincode: club.locationText?.pincode || ''
                        });
                    }

                    console.log('✅ Club data loaded:', club);
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
                // Redirect back to admin page on error
                router.push('/admin');
            } finally {
                setIsLoadingClub(false);
            }
        };

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

        if (clubId) {
            fetchClubData();
        }
        fetchLookupData();
        loadAdminDetails();

        // Listen for location updates from the location page
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'clubviz-selected-location' && e.newValue) {
                const location = JSON.parse(e.newValue);
                setSelectedLocation(location);
                console.log('📍 Location Updated:', location);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [clubId, toast, router]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logo: file
            }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            console.log('📸 Logo selected:', file.name);
        }
    };

    const handleDeleteLogo = () => {
        setFormData(prev => ({ ...prev, logo: null }));
        setLogoPreview('');
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    const handleImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleFoodDrinksImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...foodDrinksImages];
            newImages[index] = file;
            setFoodDrinksImages(newImages);
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...foodDrinksPreview];
                newPreviews[index] = event.target?.result as string;
                setFoodDrinksPreview(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAmbienceImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...ambienceImages];
            newImages[index] = file;
            setAmbienceImages(newImages);
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...ambiencePreview];
                newPreviews[index] = event.target?.result as string;
                setAmbiencePreview(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMenuImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...menuImages];
            newImages[index] = file;
            setMenuImages(newImages);
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPreviews = [...menuPreview];
                newPreviews[index] = event.target?.result as string;
                setMenuPreview(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteFoodDrinksImage = (index: number) => {
        const newImages = [...foodDrinksImages];
        newImages[index] = null as any;
        setFoodDrinksImages(newImages);
        const newPreviews = [...foodDrinksPreview];
        newPreviews[index] = '';
        setFoodDrinksPreview(newPreviews);
        if (foodDrinksRefs[index].current) {
            foodDrinksRefs[index].current!.value = '';
        }
    };

    const handleDeleteAmbienceImage = (index: number) => {
        const newImages = [...ambienceImages];
        newImages[index] = null as any;
        setAmbienceImages(newImages);
        const newPreviews = [...ambiencePreview];
        newPreviews[index] = '';
        setAmbiencePreview(newPreviews);
        if (ambienceRefs[index].current) {
            ambienceRefs[index].current!.value = '';
        }
    };

    const handleDeleteMenuImage = (index: number) => {
        const newImages = [...menuImages];
        newImages[index] = null as any;
        setMenuImages(newImages);
        const newPreviews = [...menuPreview];
        newPreviews[index] = '';
        setMenuPreview(newPreviews);
        if (menuRefs[index].current) {
            menuRefs[index].current!.value = '';
        }
    };

    const handleNavigation = (path: string) => {
        if (path === '/location') {
            router.push('/admin/add-location');
        } else {
            console.log(`Navigating to ${path}`);
        }
    };

    const handleUpdateClub = async () => {
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
                description: "Please log in as an admin to update clubs",
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
                    description: "You need ADMIN or SUPER_ADMIN role to update clubs",
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

            // ✅ BUILD UPDATE PAYLOAD - include all form fields
            const clubData: any = {
                "name": formData.clubName.trim(),
                "description": formData.description.trim(),
                "contactEmail": formData.contactEmail || adminDetails.email,
                "contactPhone": formData.contactPhone || adminDetails.phone,
                "maxMembers": Number(formData.maxMembers) || 100,
                // New Fields
                "category": formData.category || "NIGHT_CLUB",
                "pricing": {
                    "coupleEntryPrice": Number(formData.coupleEntryPrice) || 0,
                    "groupEntryPrice": Number(formData.groupEntryPrice) || 0,
                    "maleStagEntryPrice": Number(formData.maleStagEntryPrice) || 0,
                    "femaleStagEntryPrice": Number(formData.femaleStagEntryPrice) || 0,
                    "coverCharge": Number(formData.coverCharge) || 0
                },
                "rules": {
                    "hasTimeRestriction": formData.hasTimeRestriction,
                    "timeRestriction": formData.timeRestriction,
                    "inclusions": typeof formData.inclusions === 'string' ? formData.inclusions.split(',').map(s => s.trim()).filter(Boolean) : [],
                    "exclusions": typeof formData.exclusions === 'string' ? formData.exclusions.split(',').map(s => s.trim()).filter(Boolean) : [],
                    "redeemDetails": formData.redeemDetails
                },
                // Tag Arrays (Manual Entry conversions)
                "foodCuisines": typeof formData.foodCuisines === 'string' ? formData.foodCuisines.split(',').map(s => s.trim()).filter(Boolean) : [],
                "facilities": typeof formData.facilities === 'string' ? formData.facilities.split(',').map(s => s.trim()).filter(Boolean) : [],
                "music": typeof formData.music === 'string' ? formData.music.split(',').map(s => s.trim()).filter(Boolean) : [],
                "barOptions": typeof formData.barOptions === 'string' ? formData.barOptions.split(',').map(s => s.trim()).filter(Boolean) : [],
                // Ensure empty images array as requested
                "images": [],
                "logo": null
            };

            // Add location if available
            if (selectedLocation.state || selectedLocation.city || selectedLocation.pincode) {
                const parts = [
                    formData.address1,
                    formData.address2,
                    selectedLocation.city,
                    selectedLocation.state,
                    selectedLocation.pincode
                ].filter(Boolean);

                clubData.locationText = {
                    state: selectedLocation.state,
                    city: selectedLocation.city,
                    pincode: selectedLocation.pincode,
                    address1: formData.address1,
                    address2: formData.address2,
                    addressLine1: formData.address1, // Send both just in case
                    addressLine2: formData.address2,
                    fullAddress: parts.join(', ')
                };
            }

            if (selectedLocation.lat && selectedLocation.lng) {
                clubData.locationMap = {
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng
                };
            }

            // Add legacy fields if needed
            if (currentClub) {
                // Just keep legacy entryPricing for safety if backend checks it
                clubData.entryPricing = currentClub.entryPricing || {
                    weekdayPrice: 0,
                    weekendPrice: 0,
                    memberDiscount: 0,
                    currency: "INR"
                };
            }

            console.log('🚀 Updating club with payload:', JSON.stringify(clubData, null, 2));
            console.log('📡 API Call: PUT /clubs/' + clubId);

            // Call the service to update the club
            const response = await ClubService.updateClub(clubId, clubData);

            console.log('✅ Club updated successfully:', response);

            // Update the current club data immediately
            if (response.success && response.data) {
                setCurrentClub(response.data);

                // Update form data with the returned data to reflect any server-side changes
                const updatedClub = response.data;
                setFormData({
                    clubName: updatedClub.name || '',
                    description: updatedClub.description || '',
                    contactEmail: updatedClub.contactEmail || '',
                    contactPhone: updatedClub.contactPhone || '',
                    maxMembers: updatedClub.maxMembers || 0,
                    logo: null
                });

                // Update location data if changed
                if (updatedClub.locationText || updatedClub.locationMap) {
                    setSelectedLocation({
                        lat: updatedClub.locationMap?.lat || 0,
                        lng: updatedClub.locationMap?.lng || 0,
                        city: updatedClub.locationText?.city || '',
                        state: updatedClub.locationText?.state || '',
                        pincode: updatedClub.locationText?.pincode || ''
                    });
                }
            }

            toast({
                title: "Success",
                description: `Club "${formData.clubName}" updated successfully!`,
                variant: "default",
            });

            // Redirect to admin panel after short delay
            setTimeout(() => {
                router.push('/admin');
            }, 1000);

        } catch (error) {
            console.error('❌ Error updating club:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update club",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (isLoadingClub || isLoadingLookup) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-[#14FFEC] text-lg">Loading club data...</div>
            </div>
        );
    }

    // Show error state if club not found
    if (!currentClub) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-lg mb-4">Club not found</div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="px-4 py-2 bg-[#14FFEC] text-black rounded-lg font-medium"
                    >
                        Back to Admin
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.back()} className="text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-medium">Edit Club</h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-0 relative mt-[140px] z-40">
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    <div className="px-6 py-6">
                        {/* Logo Upload */}
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="w-[160px] h-[160px] bg-[#0D1F1F] rounded-[15px] border border-[#14FFEC] flex flex-col items-center justify-center p-2 cursor-pointer overflow-hidden group hover:bg-[#0D1F1F]/70 transition-all mx-auto mb-6"
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
                                                logoInputRef.current?.click();
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
                            onChange={handleLogoUpload}
                            className="hidden"
                        />

                        {/* Club Name */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Club Name *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.clubName}
                                    onChange={(e) => handleInputChange('clubName', e.target.value)}
                                    placeholder="Enter club name"
                                    className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 text-white placeholder-gray-400 focus:border-[#14FFEC] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Describe your club..."
                                rows={3}
                                className="w-full bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 py-3 text-white placeholder-gray-400 focus:border-[#14FFEC] focus:outline-none resize-none"
                            />
                        </div>

                        {/* Photos Section */}
                        <div className="w-full mb-6">
                            <div className="mb-2">
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

                        {/* Category - Commented out for now since lookup data structure unclear */}
                        {/*
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 text-white focus:border-[#14FFEC] focus:outline-none"
                            >
                                <option value="">Select category</option>
                                {lookupData.categories?.map((category: any) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        */}

                        {/* Contact Email */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Contact Email</label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                placeholder={adminDetails.email}
                                className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 text-white placeholder-gray-400 focus:border-[#14FFEC] focus:outline-none"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Contact Phone</label>
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                placeholder={adminDetails.phone}
                                className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 text-white placeholder-gray-400 focus:border-[#14FFEC] focus:outline-none"
                            />
                        </div>

                        {/* Category & Max Members */}
                        <div className="w-full grid grid-cols-2 gap-4 mb-6">
                            <div className="flex flex-col gap-[11px]">
                                <div className="px-1">
                                    <label className="text-[#14FFEC] font-semibold text-sm">Category</label>
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
                                <div className="px-1">
                                    <label className="text-[#14FFEC] font-semibold text-sm">Max Members</label>
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

                        {/* Additional Address Fields */}
                        <div className="w-full flex flex-col gap-3 mb-6">
                            <div className="px-1">
                                <label className="text-[#14FFEC] font-semibold text-sm">Address Details</label>
                            </div>
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

                        {/* Location Picker */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Location</label>
                            <div
                                onClick={() => handleNavigation('/location')}
                                className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 flex items-center justify-between cursor-pointer hover:border-[#14FFEC] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-[#14FFEC]" />
                                    <span className="text-white">
                                        {selectedLocation.city && selectedLocation.state
                                            ? `${selectedLocation.city}, ${selectedLocation.state}`
                                            : 'Add location'
                                        }
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-[#14FFEC]" />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="w-full flex flex-col gap-[11px] mb-6">
                            <div className="px-1">
                                <label className="text-[#14FFEC] font-semibold text-sm">Pricing</label>
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
                        <div className="w-full flex flex-col gap-[11px] mb-6">
                            <div className="px-1">
                                <label className="text-[#14FFEC] font-semibold text-sm">Details & Rules</label>
                            </div>

                            <div className="space-y-3">
                                {/* Time Restriction Toggle */}
                                <div className="px-5 flex items-center justify-between">
                                    <span className="text-white">Has Time Restriction?</span>
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, hasTimeRestriction: !prev.hasTimeRestriction }))}
                                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.hasTimeRestriction ? 'bg-[#14FFEC]' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-black rounded-full transition-transform ${formData.hasTimeRestriction ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
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
                        <div className="w-full flex flex-col gap-[11px] mb-6">
                            <div className="px-1">
                                <label className="text-[#14FFEC] font-semibold text-sm">Tags (Manual Entry)</label>
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

                        {/* Update Button */}
                        <button
                            onClick={handleUpdateClub}
                            disabled={isSubmitting || !formData.clubName.trim()}
                            className={`w-full h-12 rounded-[30px] flex items-center justify-center font-bold relative mb-6 ${isSubmitting || !formData.clubName.trim()
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-[#14FFEC] text-black hover:bg-[#11A99B] transition-colors'
                                }`}
                        >
                            {isSubmitting ? 'Updating Club...' : 'Update Club'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}