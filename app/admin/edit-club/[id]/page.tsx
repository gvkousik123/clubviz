'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, ChevronRight, Plus } from 'lucide-react';
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
        contactEmail: '',
        contactPhone: '',
        maxMembers: 0,
        logo: null as File | null
    });
    const [lookupData, setLookupData] = useState<AllLookupData>({});
    const [isLoadingLookup, setIsLoadingLookup] = useState(true);

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
                        contactEmail: club.contactEmail || '',
                        contactPhone: club.contactPhone || '',
                        maxMembers: club.maxMembers || 0,
                        logo: null // Can't pre-fill file input
                    });

                    // Pre-fill location data
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
            console.log('📸 Logo selected:', file.name);
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
                "maxMembers": formData.maxMembers || 100
            };

            // Add location if available
            if (selectedLocation.state || selectedLocation.city || selectedLocation.pincode) {
                clubData.locationText = {
                    state: selectedLocation.state,
                    city: selectedLocation.city,
                    pincode: selectedLocation.pincode,
                    fullAddress: `${selectedLocation.city}, ${selectedLocation.state} ${selectedLocation.pincode}`.trim()
                };
            }

            if (selectedLocation.lat && selectedLocation.lng) {
                clubData.locationMap = {
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng
                };
            }

            // Add other fields that might be needed
            if (currentClub) {
                // Preserve existing data that we don't have forms for
                clubData.images = currentClub.images || [];
                clubData.foodCuisines = currentClub.foodCuisines || [];
                clubData.facilities = currentClub.facilities || [];
                clubData.music = currentClub.music || [];
                clubData.barOptions = currentClub.barOptions || [];
                clubData.entryPricing = currentClub.entryPricing || {
                    weekdayPrice: 0,
                    weekendPrice: 0,
                    memberDiscount: 0,
                    currency: "INR"
                };
                clubData.logo = currentClub.logo || "";
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
                        {/* Club Logo Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-[#14FFEC]/20 rounded-full flex items-center justify-center relative mb-4 cursor-pointer"
                                onClick={() => logoInputRef.current?.click()}>
                                {currentClub.logo ? (
                                    <img src={currentClub.logo} alt="Club Logo" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <Upload className="w-8 h-8 text-[#14FFEC]" />
                                )}
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#14FFEC] rounded-full flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-black" />
                                </div>
                            </div>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <p className="text-gray-400 text-sm text-center">
                                {formData.logo ? formData.logo.name : 'Tap to update club logo'}
                            </p>
                        </div>

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

                        {/* Max Members */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-3">Max Members</label>
                            <input
                                type="number"
                                value={formData.maxMembers}
                                onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 0)}
                                placeholder="100"
                                min="0"
                                className="w-full h-12 bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] px-4 text-white placeholder-gray-400 focus:border-[#14FFEC] focus:outline-none"
                            />
                        </div>

                        {/* Location */}
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