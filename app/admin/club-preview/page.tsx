'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Share2,
    Heart,
    Users,
    MapPin,
    Calendar,
    ChevronLeft,
    Edit3,
    Save,
    X,
    Trash2,
    Mail,
    Phone,
    Globe
} from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import BottomContinueButton from '@/components/common/bottom-continue-button';
import { ClubService } from '@/lib/services/club.service';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

function ClubPreviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');
    const editParam = searchParams.get('edit');
    const { toast } = useToast();

    const [isLiked, setIsLiked] = useState(false);
    const [clubData, setClubData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Editing states - initialize based on URL parameter
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load club data on mount
    useEffect(() => {
        const loadClubData = async () => {
            try {
                if (!clubId) {
                    setError('No club ID provided');
                    setIsLoading(false);
                    return;
                }

                const response = await ClubService.getClubById(clubId);
                console.log('Club details response:', response);

                // Handle both wrapper response format and direct response format
                let clubDetails: any;
                if (response.success && response.data) {
                    // API wrapper format
                    clubDetails = response.data;
                } else if ((response as any).id) {
                    // Direct response format (when API returns club data directly)
                    clubDetails = response;
                } else {
                    throw new Error('Invalid response format');
                }

                setClubData(clubDetails);

                // Initialize edit data
                setEditData({
                    name: clubDetails.name || '',
                    description: clubDetails.description || '',
                    category: clubDetails.category || '',
                    contactEmail: clubDetails.contactEmail || '',
                    contactPhone: clubDetails.contactPhone || '',
                    locationText: clubDetails.locationText || { address1: '', city: '', state: '', pincode: '' },
                    logo: clubDetails.logo || ''
                });
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

    // Set edit mode based on URL parameter - run after data is loaded
    useEffect(() => {
        const editParam = searchParams.get('edit');
        console.log('🔧 Edit parameter from URL:', editParam);
        if (editParam === 'true' && clubData) {
            console.log('✅ Enabling edit mode');
            setIsEditing(true);
        }
    }, [searchParams, clubData]);

    // Handle save changes
    const handleSaveChanges = async () => {
        if (!clubId || !clubData) return;

        setIsSaving(true);
        try {
            const updateData = {
                name: editData.name,
                description: editData.description,
                category: editData.category,
                contactEmail: editData.contactEmail,
                contactPhone: editData.contactPhone,
                locationText: editData.locationText || { address1: '', city: '', state: '', pincode: '' },
                locationMap: clubData.locationMap || { lat: 0, lng: 0 },
                logo: editData.logo || '',
                maxMembers: clubData.maxMembers || 0,
                images: clubData.images || [],
                foodCuisines: clubData.foodCuisines || [],
                facilities: clubData.facilities || [],
                music: clubData.music || [],
                barOptions: clubData.barOptions || [],
                entryPricing: clubData.entryPricing || { free: true, amount: 0 }
            };

            const response = await ClubService.updateClub(clubId, updateData);
            console.log('✅ Update response:', response);
            console.log('✅ Response type:', typeof response);
            console.log('✅ Has data property:', 'data' in (response || {}));
            console.log('✅ Has id property:', 'id' in (response || {}));

            // Handle response - can be wrapped {success, data} or direct object
            let updatedClub: any;
            if (response && (response as any).data) {
                // Wrapped response format
                console.log('📦 Using wrapped response format');
                updatedClub = (response as any).data;
            } else if (response && (response as any).id) {
                // Direct response format (API returns club object directly)
                console.log('📦 Using direct response format');
                updatedClub = response;
            } else {
                console.error('❌ Invalid response format:', response);
                throw new Error('Invalid response format');
            }

            console.log('✅ Updated club data:', updatedClub);

            // Update local state with the response data
            setClubData(updatedClub);
            setEditData({
                name: updatedClub.name || '',
                description: updatedClub.description || '',
                category: updatedClub.category || '',
                contactEmail: updatedClub.contactEmail || '',
                contactPhone: updatedClub.contactPhone || '',
                locationText: updatedClub.locationText || { address1: '', city: '', state: '', pincode: '' },
                logo: updatedClub.logo || ''
            });
            setIsEditing(false);

            toast({
                title: 'Club Updated',
                description: 'Club details have been updated successfully.',
                variant: 'default',
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

    // Handle delete club
    const handleDeleteClub = async () => {
        if (!clubId) return;

        setIsDeleting(true);
        try {
            const response = await ClubService.deleteClub(clubId);

            if (response.success) {
                toast({
                    title: 'Club Deleted',
                    description: 'Club has been deleted successfully.',
                    variant: 'default',
                });
                router.push('/admin');
            } else {
                throw new Error(response.message || 'Failed to delete club');
            }
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

    const handleCancelEdit = () => {
        if (clubData) {
            setEditData({
                name: clubData.name || '',
                description: clubData.description || '',
                category: clubData.category || '',
                contactEmail: clubData.contactEmail || '',
                contactPhone: clubData.contactPhone || '',
                locationText: clubData.locationText || { address1: '', city: '', state: '', pincode: '' },
                logo: clubData.logo || ''
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading club details...</div>
            </div>
        );
    }

    if (error || !clubData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">{error || 'Club not found'}</div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="px-4 py-2 bg-[#14FFEC] text-black rounded-lg"
                    >
                        Back to Admin
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Header with Action Buttons */}
            <div className="flex items-center justify-between p-4 border-b border-[#14FFEC]/20">
                <button
                    onClick={() => router.push('/admin')}
                    className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[#14FFEC]" />
                </button>
                <h1 className="text-lg font-semibold">{isEditing ? "Edit Club" : "Club Details"}</h1>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                                title="Edit Club"
                            >
                                <Edit3 className="w-5 h-5 text-[#14FFEC]" />
                            </button>
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                title="Delete Club"
                            >
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                title="Save Changes"
                            >
                                <Save className="w-5 h-5 text-green-500" />
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors"
                                title="Cancel"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 pb-24">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Club Logo */}
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-[#14FFEC]/20 rounded-full flex items-center justify-center mb-4">
                            {clubData.logo ? (
                                <img
                                    src={clubData.logo}
                                    alt={clubData.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <Users className="w-12 h-12 text-[#14FFEC]" />
                            )}
                        </div>
                    </div>

                    {/* Club Name */}
                    <div className="text-center">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-3 text-white text-xl font-semibold text-center w-full"
                                placeholder="Club Name"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold text-white mb-2">{clubData.name}</h1>
                        )}
                    </div>

                    {/* Club Info */}
                    <div className="bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] p-6 space-y-4">
                        {/* Category */}
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#14FFEC]" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.category}
                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white flex-1"
                                    placeholder="Category"
                                />
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Category</p>
                                    <p className="text-white">{clubData.category || 'Not specified'}</p>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#14FFEC] mt-1" />
                            {isEditing ? (
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={editData.locationText?.address1 || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            locationText: {
                                                ...editData.locationText,
                                                address1: e.target.value
                                            }
                                        })}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white w-full"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        type="text"
                                        value={editData.locationText?.state || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            locationText: {
                                                ...editData.locationText,
                                                state: e.target.value
                                            }
                                        })}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white w-full"
                                        placeholder="State"
                                    />
                                    <input
                                        type="text"
                                        value={editData.locationText?.city || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            locationText: {
                                                ...editData.locationText,
                                                city: e.target.value
                                            }
                                        })}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white w-full"
                                        placeholder="City"
                                    />
                                    <input
                                        type="text"
                                        value={editData.locationText?.pincode || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            locationText: {
                                                ...editData.locationText,
                                                pincode: e.target.value
                                            }
                                        })}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white w-full"
                                        placeholder="Pincode"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Location</p>
                                    <p className="text-white">
                                        {clubData.locationText?.fullAddress ||
                                            `${clubData.locationText?.address1 || ''}, ${clubData.locationText?.city || ''}, ${clubData.locationText?.state || ''} ${clubData.locationText?.pincode || ''}`.trim() ||
                                            'Not specified'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Contact Email */}
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#14FFEC]" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData.contactEmail}
                                    onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white flex-1"
                                    placeholder="Contact Email"
                                />
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Contact Email</p>
                                    <p className="text-white">{clubData.contactEmail || 'Not provided'}</p>
                                </div>
                            )}
                        </div>

                        {/* Contact Phone */}
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-[#14FFEC]" />
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.contactPhone}
                                    onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-2 text-white flex-1"
                                    placeholder="Contact Phone"
                                />
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Contact Phone</p>
                                    <p className="text-white">{clubData.contactPhone || 'Not provided'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] p-6">
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        {isEditing ? (
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-lg p-3 text-white w-full h-32 resize-none"
                                placeholder="Club description..."
                            />
                        ) : (
                            <p className="text-gray-300 leading-relaxed">
                                {clubData.description || 'No description provided.'}
                            </p>
                        )}
                    </div>

                    {/* Club Stats */}
                    <div className="bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[15px] p-6">
                        <h3 className="text-lg font-semibold mb-3">Club Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#14FFEC]">{clubData.memberCount || 0}</div>
                                <div className="text-gray-400 text-sm">Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#14FFEC]">{clubData.eventCount || 0}</div>
                                <div className="text-gray-400 text-sm">Events</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!isEditing && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push(`/admin/new-event?clubId=${clubId}`)}
                                className="flex-1 bg-[#14FFEC] text-black py-3 px-6 rounded-lg font-medium hover:bg-[#14FFEC]/90 transition-colors"
                            >
                                Create Event
                            </button>
                            <button
                                onClick={() => router.push(`/club/${clubId}`)}
                                className="flex-1 bg-[#0D1F1F] border border-[#14FFEC]/40 text-white py-3 px-6 rounded-lg font-medium hover:bg-[#0D1F1F]/80 transition-colors"
                            >
                                View Public Page
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogOverlay />
                <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                    <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px] relative">
                        {/* Close button */}
                        <div className="absolute right-3 top-3">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="w-8 h-8 flex items-center justify-center text-white bg-transparent rounded-full hover:bg-white/10 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Warning Icon */}
                        <div className="w-[80px] h-[80px] relative overflow-hidden flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                        </div>

                        {/* Title and Message */}
                        <div className="flex flex-col items-center gap-[12px]">
                            <div className="text-[#F9F9F9] text-[20px] font-semibold font-['Manrope']">
                                Delete Club
                            </div>
                            <div className="text-[#A3A3A3] text-[14px] font-['Manrope'] text-center leading-relaxed">
                                Are you sure you want to delete "{clubData?.name || 'this club'}"? This action cannot be undone.
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-[14px]">
                            <button
                                onClick={handleDeleteClub}
                                disabled={isDeleting}
                                className="w-[154px] h-[38px] bg-red-600 rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px] flex items-center gap-2">
                                    {isDeleting && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </div>
                            </button>

                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="w-[154px] h-[38px] border border-[#007877] rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-[#012e2e] transition-all duration-300"
                            >
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                    Cancel
                                </div>
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ClubPreview() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <ClubPreviewContent />
        </Suspense>
    );
}