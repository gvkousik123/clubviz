'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
    Share2,
    MapPin,
    Star,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react';
import { ClubService } from '@/lib/services/club.service';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Tag Component
const TagComponent = ({ icon, label }: { icon?: React.ReactNode, label: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

function ClubPreviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');
    const isEditMode = searchParams.get('edit') === 'true';
    const { toast } = useToast();

    const [clubData, setClubData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        const loadClubData = async () => {
            try {
                if (!clubId) {
                    setError('No club ID provided');
                    setIsLoading(false);
                    return;
                }

                const response = await ClubService.getClubById(clubId);

                let clubDetails: any;
                if (response.success && response.data) {
                    clubDetails = response.data;
                } else if ((response as any).id) {
                    clubDetails = response;
                } else {
                    throw new Error('Invalid response format');
                }

                setClubData(clubDetails);
                setError(null);
            } catch (err) {
                console.error('Error loading club:', err);
                setError('Failed to load club data');
            } finally {
                setIsLoading(false);
            }
        };

        loadClubData();
    }, [clubId]);

    useEffect(() => {
        if (clubData && isEditing) {
            setEditData({
                name: clubData.name || '',
                description: clubData.description || '',
                phone: clubData.phone || clubData.contactPhone || '',
                email: clubData.email || clubData.contactEmail || '',
                category: clubData.category || '',
                maxMembers: clubData.maxMembers || '',
                music: (clubData.music || clubData.musicGenres || []).join(', '),
                facilities: (clubData.facilities || []).join(', '),
                foodCuisines: (clubData.foodCuisines || []).join(', '),
                barOptions: (clubData.barOptions || []).join(', '),
                // Address fields
                address1: clubData.locationText?.address1 || '',
                address2: clubData.locationText?.address2 || '',
                city: clubData.locationText?.city || '',
                state: clubData.locationText?.state || '',
                pincode: clubData.locationText?.pincode || '',
                // Entry pricing
                coupleEntryPrice: clubData.entryPricing?.coupleEntryPrice || '',
                groupEntryPrice: clubData.entryPricing?.groupEntryPrice || '',
                maleStagEntryPrice: clubData.entryPricing?.maleStagEntryPrice || '',
                femaleStagEntryPrice: clubData.entryPricing?.femaleStagEntryPrice || '',
                coverCharge: clubData.entryPricing?.coverCharge || '',
                redeemDetails: clubData.entryPricing?.redeemDetails || '',
                hasTimeRestriction: clubData.entryPricing?.hasTimeRestriction || false,
                timeRestriction: clubData.entryPricing?.timeRestriction || '',
                inclusions: (clubData.entryPricing?.inclusions || []).join(', '),
                exclusions: (clubData.entryPricing?.exclusions || []).join(', '),
            });
        }
    }, [clubData, isEditing]);

    const handleGoBack = () => {
        if (isEditing) {
            setIsEditing(false);
            setEditData(null);
        } else {
            router.push('/admin');
        }
    };

    const handleEdit = () => setIsEditing(true);

    const handleSaveUpdate = async () => {
        if (!clubId || !editData) return;

        try {
            setIsSaving(true);
            const updatePayload: any = {
                name: editData.name,
                description: editData.description,
                contactPhone: editData.phone,
                contactEmail: editData.email,
                category: editData.category,
                maxMembers: editData.maxMembers ? parseInt(editData.maxMembers) : undefined,
                music: editData.music.split(',').map((m: string) => m.trim()).filter((m: string) => m),
                facilities: editData.facilities.split(',').map((f: string) => f.trim()).filter((f: string) => f),
                foodCuisines: editData.foodCuisines.split(',').map((c: string) => c.trim()).filter((c: string) => c),
                barOptions: editData.barOptions.split(',').map((b: string) => b.trim()).filter((b: string) => b),
                locationText: {
                    address1: editData.address1,
                    address2: editData.address2,
                    city: editData.city,
                    state: editData.state,
                    pincode: editData.pincode
                },
                locationMap: clubData?.locationMap || { lat: 0, lng: 0 },
                entryPricing: {
                    coupleEntryPrice: editData.coupleEntryPrice ? parseFloat(editData.coupleEntryPrice) : 0,
                    groupEntryPrice: editData.groupEntryPrice ? parseFloat(editData.groupEntryPrice) : 0,
                    maleStagEntryPrice: editData.maleStagEntryPrice ? parseFloat(editData.maleStagEntryPrice) : 0,
                    femaleStagEntryPrice: editData.femaleStagEntryPrice ? parseFloat(editData.femaleStagEntryPrice) : 0,
                    coverCharge: editData.coverCharge ? parseFloat(editData.coverCharge) : 0,
                    redeemDetails: editData.redeemDetails,
                    hasTimeRestriction: editData.hasTimeRestriction,
                    timeRestriction: editData.timeRestriction,
                    inclusions: editData.inclusions.split(',').map((i: string) => i.trim()).filter((i: string) => i),
                    exclusions: editData.exclusions.split(',').map((e: string) => e.trim()).filter((e: string) => e)
                }
            };

            console.log('📡 Updating club:', updatePayload);
            await ClubService.updateClub(clubId, updatePayload);

            // Update local state with new data
            setClubData({
                ...clubData,
                ...updatePayload,
            });

            setIsEditing(false);
            setEditData(null);
            toast({
                title: 'Success',
                description: 'Club updated successfully',
                variant: 'success'
            });
        } catch (err) {
            console.error('Error updating club:', err);
            toast({
                title: 'Update Failed',
                description: err instanceof Error ? err.message : 'Failed to update club',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: clubData?.name || 'Club',
                    text: `Check out ${clubData?.name || 'this club'}!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({ title: 'Link copied!', description: 'Club link copied to clipboard.' });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const nextImage = () => {
        const heroImages = clubData?.images?.length > 0
            ? clubData.images.map((img: any) => img.url || img)
            : [clubData?.logo || clubData?.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        const heroImages = clubData?.images?.length > 0
            ? clubData.images.map((img: any) => img.url || img)
            : [clubData?.logo || clubData?.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const handleDeleteClub = async () => {
        if (!clubId) return;

        try {
            setIsDeleting(true);
            await ClubService.deleteClub(clubId);
            toast({ title: 'Success', description: 'Club deleted successfully', variant: 'success' });
            router.push('/admin');
        } catch (err) {
            console.error('Error deleting club:', err);
            toast({
                title: 'Delete Failed',
                description: err instanceof Error ? err.message : 'Failed to delete club',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (error || !clubData) {
        return (
            <div className="min-h-screen bg-[#021313] flex flex-col items-center justify-center p-4">
                <p className="text-white mb-4">{error || 'Club not found'}</p>
                <button onClick={handleGoBack} className="text-[#14FFEC] flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const heroImages = clubData.images?.length > 0
        ? clubData.images.map((img: any) => img.url || img)
        : [clubData.logo || clubData.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];

    const getAddress = () => {
        if (clubData.locationText?.fullAddress) return clubData.locationText.fullAddress;
        const parts = [
            clubData.locationText?.address1,
            clubData.locationText?.address2,
            clubData.locationText?.city,
            clubData.locationText?.state
        ].filter(Boolean);
        return parts.join(', ') || clubData.location || '';
    };

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Edit Mode - Form */}
            {isEditing && editData && (
                <div className="p-6 pb-20">
                    <button onClick={handleGoBack} className="text-[#14FFEC] flex items-center gap-2 hover:opacity-80 mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <h2 className="text-white text-2xl font-bold mb-6">Edit Club</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Club Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                placeholder="Enter club name"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[100px]"
                                placeholder="Enter club description"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Phone</label>
                            <input
                                type="text"
                                value={editData.phone}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Email</label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Music Genres (comma separated)</label>
                            <textarea
                                value={editData.music}
                                onChange={(e) => setEditData({ ...editData, music: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[80px]"
                                placeholder="e.g., House, Techno, Bollywood"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Facilities (comma separated)</label>
                            <textarea
                                value={editData.facilities}
                                onChange={(e) => setEditData({ ...editData, facilities: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[80px]"
                                placeholder="e.g., WiFi, Parking, Dance Floor"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Cuisines (comma separated)</label>
                            <textarea
                                value={editData.foodCuisines}
                                onChange={(e) => setEditData({ ...editData, foodCuisines: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[80px]"
                                placeholder="e.g., Indian, Italian, Continental"
                            />
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">Bar Options (comma separated)</label>
                            <textarea
                                value={editData.barOptions}
                                onChange={(e) => setEditData({ ...editData, barOptions: e.target.value })}
                                className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[80px]"
                                placeholder="e.g., Cocktails, Beer, Wine, Spirits"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white text-sm font-semibold mb-2 block">Category</label>
                                <input
                                    type="text"
                                    value={editData.category}
                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                    className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                    placeholder="e.g., NIGHTCLUB"
                                />
                            </div>

                            <div>
                                <label className="text-white text-sm font-semibold mb-2 block">Max Members</label>
                                <input
                                    type="number"
                                    value={editData.maxMembers}
                                    onChange={(e) => setEditData({ ...editData, maxMembers: e.target.value })}
                                    className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                    placeholder="e.g., 500"
                                />
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-2">
                            <h3 className="text-white text-lg font-semibold mb-3">Address Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={editData.address1}
                                        onChange={(e) => setEditData({ ...editData, address1: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                        placeholder="Street address, building number"
                                    />
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Address Line 2</label>
                                    <input
                                        type="text"
                                        value={editData.address2}
                                        onChange={(e) => setEditData({ ...editData, address2: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                        placeholder="Apartment, suite, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">City</label>
                                        <input
                                            type="text"
                                            value={editData.city}
                                            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">State</label>
                                        <input
                                            type="text"
                                            value={editData.state}
                                            onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="State"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Pincode</label>
                                    <input
                                        type="text"
                                        value={editData.pincode}
                                        onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-2">
                            <h3 className="text-white text-lg font-semibold mb-3">Entry Pricing</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">Couple Entry</label>
                                        <input
                                            type="number"
                                            value={editData.coupleEntryPrice}
                                            onChange={(e) => setEditData({ ...editData, coupleEntryPrice: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="₹ 0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">Group Entry</label>
                                        <input
                                            type="number"
                                            value={editData.groupEntryPrice}
                                            onChange={(e) => setEditData({ ...editData, groupEntryPrice: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="₹ 0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">Male Stag Entry</label>
                                        <input
                                            type="number"
                                            value={editData.maleStagEntryPrice}
                                            onChange={(e) => setEditData({ ...editData, maleStagEntryPrice: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="₹ 0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">Female Stag Entry</label>
                                        <input
                                            type="number"
                                            value={editData.femaleStagEntryPrice}
                                            onChange={(e) => setEditData({ ...editData, femaleStagEntryPrice: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="₹ 0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Cover Charge</label>
                                    <input
                                        type="number"
                                        value={editData.coverCharge}
                                        onChange={(e) => setEditData({ ...editData, coverCharge: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                        placeholder="₹ 0"
                                    />
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Redeem Details</label>
                                    <textarea
                                        value={editData.redeemDetails}
                                        onChange={(e) => setEditData({ ...editData, redeemDetails: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[60px]"
                                        placeholder="Redeem details..."
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 text-white font-semibold cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editData.hasTimeRestriction}
                                            onChange={(e) => setEditData({ ...editData, hasTimeRestriction: e.target.checked })}
                                            className="w-4 h-4 text-[#14FFEC] bg-[#0D1F1F] border-[#14FFEC]/30 rounded focus:ring-[#14FFEC] focus:ring-2"
                                        />
                                        Has Time Restriction
                                    </label>
                                </div>

                                {editData.hasTimeRestriction && (
                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">Time Restriction</label>
                                        <input
                                            type="text"
                                            value={editData.timeRestriction}
                                            onChange={(e) => setEditData({ ...editData, timeRestriction: e.target.value })}
                                            className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC]"
                                            placeholder="e.g., Valid before 12:00 AM"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Inclusions (comma separated)</label>
                                    <textarea
                                        value={editData.inclusions}
                                        onChange={(e) => setEditData({ ...editData, inclusions: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[60px]"
                                        placeholder="e.g., Welcome drink, Appetizers"
                                    />
                                </div>

                                <div>
                                    <label className="text-white text-sm font-semibold mb-2 block">Exclusions (comma separated)</label>
                                    <textarea
                                        value={editData.exclusions}
                                        onChange={(e) => setEditData({ ...editData, exclusions: e.target.value })}
                                        className="w-full bg-[rgba(40,60,61,0.30)] border border-[#14FFEC]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#14FFEC] min-h-[60px]"
                                        placeholder="e.g., Main course, Desserts"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleGoBack}
                                disabled={isSaving}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUpdate}
                                disabled={isSaving}
                                className="flex-1 bg-gradient-to-r from-[#005D5C] to-[#14FFEC] hover:brightness-110 text-white py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Mode */}
            {!isEditing && (
                <>
                    {/* Hero Image Carousel */}
                    <div className="relative w-full h-[40vh] overflow-hidden">
                        <div className="absolute inset-0 flex">
                            {heroImages.map((image: string, index: number) => (
                                <img
                                    key={index}
                                    className="min-w-full h-full object-cover transition-transform duration-300"
                                    src={image}
                                    alt={`Hero ${index + 1}`}
                                    style={{ transform: `translateX(${(index - currentImageIndex) * 100}%)` }}
                                />
                            ))}
                        </div>

                        {heroImages.length > 1 && (
                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 flex justify-between items-center w-[calc(100%-28px)]">
                                <button onClick={prevImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition">
                                    <ChevronLeft className="w-4 h-4 text-black" />
                                </button>
                                <button onClick={nextImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition">
                                    <ChevronRight className="w-4 h-4 text-black" />
                                </button>
                            </div>
                        )}

                        <button onClick={handleGoBack} className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition">
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </button>

                        <div className="absolute right-4 top-12 flex gap-2">
                            <button onClick={handleShare} className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition">
                                <Share2 className="h-5 w-5 text-white" />
                            </button>
                            <button onClick={handleEdit} className="w-[35px] h-[35px] bg-[#14FFEC]/20 rounded-[18px] flex items-center justify-center hover:bg-[#14FFEC]/30 transition">
                                <Edit3 className="h-5 w-5 text-[#14FFEC]" />
                            </button>
                            <button onClick={() => setShowDeleteDialog(true)} className="w-[35px] h-[35px] bg-red-500/20 rounded-[18px] flex items-center justify-center hover:bg-red-500/30 transition">
                                <Trash2 className="h-5 w-5 text-red-500" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(40vh - 42.5px)' }}>
                        <div className="w-[85px] h-[85px] rounded-full border-4 border-[#08C2B3] overflow-hidden shadow-xl bg-black">
                            <img
                                src={clubData.logo || clubData.logoUrl || heroImages[0]}
                                alt={clubData.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = heroImages[0])}
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-[#021313] to-[rgba(2,19,19,0)] mt-[-5vh] rounded-t-[40px] relative z-0 px-4 pb-[18px] w-full">
                        <div className="flex flex-col items-center w-full" style={{ paddingTop: 'calc(6vh + 30px)' }}>
                            <h1 className="text-white text-[30px] tracking-[0.36px] text-center font-normal leading-[35px] mb-3 uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
                                {clubData.name}
                            </h1>
                            {clubData.description && <p className="text-white/70 text-sm text-center mb-4 px-4">{clubData.description}</p>}

                            {clubData.rating && (
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-white text-sm font-semibold">{clubData.rating}</span>
                                </div>
                            )}

                            {getAddress() && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Location</h3>
                                    <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[20px] p-4">
                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0" />
                                            <p className="text-white text-sm">{getAddress()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {clubData.facilities && clubData.facilities.length > 0 && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Facilities</h3>
                                    <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                        {clubData.facilities.map((facility: any, i: number) => (
                                            <TagComponent key={i} label={facility} icon={<Star className="w-3 h-3" />} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {clubData.foodCuisines && clubData.foodCuisines.length > 0 && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Cuisines</h3>
                                    <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                        {clubData.foodCuisines.map((cuisine: any, i: number) => (
                                            <TagComponent key={i} label={cuisine} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {clubData.music && clubData.music.length > 0 && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Music</h3>
                                    <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                        {clubData.music.map((genre: any, i: number) => (
                                            <TagComponent key={i} label={genre} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {clubData.barOptions && clubData.barOptions.length > 0 && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Bar Options</h3>
                                    <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                        {clubData.barOptions.map((option: any, i: number) => (
                                            <TagComponent key={i} label={option} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {clubData.entryPricing && (clubData.entryPricing.coupleEntryPrice || clubData.entryPricing.groupEntryPrice || clubData.entryPricing.maleStagEntryPrice || clubData.entryPricing.femaleStagEntryPrice) && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Entry Pricing</h3>
                                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 space-y-2">
                                        {clubData.entryPricing.coupleEntryPrice > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Couple Entry</span>
                                                <span className="text-[#14FFEC] font-semibold">₹ {clubData.entryPricing.coupleEntryPrice}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.groupEntryPrice > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Group Entry</span>
                                                <span className="text-[#14FFEC] font-semibold">₹ {clubData.entryPricing.groupEntryPrice}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.maleStagEntryPrice > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Male Stag Entry</span>
                                                <span className="text-[#14FFEC] font-semibold">₹ {clubData.entryPricing.maleStagEntryPrice}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.femaleStagEntryPrice > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Female Stag Entry</span>
                                                <span className="text-[#14FFEC] font-semibold">₹ {clubData.entryPricing.femaleStagEntryPrice}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.coverCharge > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Cover Charge</span>
                                                <span className="text-[#14FFEC] font-semibold">₹ {clubData.entryPricing.coverCharge}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.redeemDetails && (
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <span className="text-white/70 text-sm">Redeem: </span>
                                                <span className="text-white text-sm">{clubData.entryPricing.redeemDetails}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.hasTimeRestriction && clubData.entryPricing.timeRestriction && (
                                            <div className="text-yellow-400 text-sm">⏰ {clubData.entryPricing.timeRestriction}</div>
                                        )}
                                        {clubData.entryPricing.inclusions && clubData.entryPricing.inclusions.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <span className="text-[#14FFEC] text-sm font-semibold">Inclusions: </span>
                                                <span className="text-white text-sm">{clubData.entryPricing.inclusions.join(', ')}</span>
                                            </div>
                                        )}
                                        {clubData.entryPricing.exclusions && clubData.entryPricing.exclusions.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-red-400 text-sm font-semibold">Exclusions: </span>
                                                <span className="text-white/70 text-sm">{clubData.entryPricing.exclusions.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(clubData.phone || clubData.email || clubData.contactPhone || clubData.contactEmail) && (
                                <div className="w-full mt-5 mb-5">
                                    <h3 className="text-white text-xl font-semibold mb-4">Contact</h3>
                                    <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 space-y-2">
                                        {(clubData.phone || clubData.contactPhone) && <p className="text-white text-sm">📞 {clubData.phone || clubData.contactPhone}</p>}
                                        {(clubData.email || clubData.contactEmail) && <p className="text-white text-sm">✉️ {clubData.email || clubData.contactEmail}</p>}
                                    </div>
                                </div>
                            )}

                            <div className="w-full mt-6 flex gap-4">
                                <button onClick={() => router.push(`/admin/new-event?clubId=${clubId}`)} className="flex-1 py-3 px-6 rounded-[30px] bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition">
                                    Create Event
                                </button>
                                <button onClick={() => router.push(`/club/${clubId}`)} className="flex-1 py-3 px-6 rounded-[30px] border-2 border-[#14FFEC] text-[#14FFEC] font-bold hover:bg-[#14FFEC]/10 transition">
                                    View Public
                                </button>
                            </div>
                        </div>
                    </div>

                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogOverlay />
                        <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                            <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px]">
                                <div className="w-[74px] h-[74px] bg-red-500/20 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-10 h-10 text-red-400" />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-white text-lg font-semibold mb-2">Delete Club</h3>
                                    <p className="text-gray-400 text-sm">Are you sure you want to delete "{clubData?.name}"? This action cannot be undone.</p>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <button onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteClub} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div >
    );
}

export default function ClubPreview() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <ClubPreviewContent />
        </Suspense>
    );
}
