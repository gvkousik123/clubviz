'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Plus, DollarSign, BarChart, Edit, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';
import { useAdminClubs } from '@/hooks/use-admin-clubs';
import { useAdminEvents } from '@/hooks/use-admin-events';
import { useClubList } from '@/hooks/use-club-list';
import { useOwnedClubs } from '@/hooks/use-owned-clubs';
import { useOrganizedEvents } from '@/hooks/use-organized-events';
import { AccessDenied } from '@/components/common/access-denied';
import { AuthService } from '@/lib/services/auth.service';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
    // Authentication info - no redirects
    const isAuthenticated = AuthService.isAuthenticated();
    const userRoles = AuthService.getUserRolesFromStorage();
    const hasRole = (role: string) => AuthService.hasRole(role);

    const router = useRouter();
    const { toast } = useToast();
    const [showCreateModal, setShowCreateModal] = useState<'club' | 'event' | null>(null);

    // Delete dialog states - Events
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
    const [deleteEventTitle, setDeleteEventTitle] = useState<string>('');

    // Delete dialog states - Clubs
    const [showDeleteClubDialog, setShowDeleteClubDialog] = useState(false);
    const [deleteClubId, setDeleteClubId] = useState<string | null>(null);
    const [deleteClubName, setDeleteClubName] = useState<string>('');

    // Use profile hook for admin profile data
    const {
        currentUser,
        isAdmin,
        isSuperAdmin,
    } = useProfile();

    // CRUD hooks for clubs and events
    const clubCrud = useAdminClubs();
    const eventCrud = useAdminEvents();
    const { clubs: ownedClubs, loadOwnedClubs, isLoading: isLoadingOwnedClubs, deleteClub: deleteOwnedClub, setClubs: setOwnedClubs } = useOwnedClubs();
    const { events: organizedEvents, loadOrganizedEvents, isLoading: isLoadingOrganized, error: organizedEventsError, setEvents } = useOrganizedEvents();

    // Load admin data on mount - ONLY ONCE
    useEffect(() => {
        let isMounted = true;

        const loadAdminData = async () => {
            if (!isMounted) return;

            try {
                // Load owned clubs for this admin
                await loadOwnedClubs();

                // Load organized events (events created by this user)
                await loadOrganizedEvents({ page: 0, size: 20, sortBy: 'startDateTime', sortOrder: 'asc' });
            } catch (error) {
                console.error('Error loading admin data:', error);
            }
        };

        loadAdminData();

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - only run once on mount

    // Handle logout
    const handleLogout = () => {
        // Clear all auth-related localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('user');

        toast({
            title: 'Logged out',
            description: 'You have been logged out successfully.',
        });

        router.push('/auth/login');
    };

    // Calculate stats from organized events
    const calculateStats = () => {
        if (!organizedEvents || organizedEvents.length === 0) {
            return {
                totalRevenue: 'Rs 0',
                totalTicketSold: '0/0',
                peopleAttending: '0',
                activeEvents: '0'
            };
        }

        const activeEvents = organizedEvents.filter(e => e.status === 'ONGOING' || e.ongoing);
        const totalAttendees = organizedEvents.reduce((sum, event) => sum + event.attendeeCount, 0);
        const totalCapacity = organizedEvents.reduce((sum, event) => sum + (event.maxAttendees || 0), 0);

        return {
            totalRevenue: 'Rs 0', // Fetch from API if available
            totalTicketSold: `${totalAttendees}/${totalCapacity || 'Unlimited'}`,
            peopleAttending: totalAttendees.toString(),
            activeEvents: activeEvents.length.toString()
        };
    };

    const stats = calculateStats();
    const clubName = ownedClubs?.[0]?.name || 'Club';

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    // Handle club operations

    const handleEditClub = (clubId: string) => {
        router.push(`/admin/club-preview?clubId=${clubId}&edit=true`);
    };

    const handleDeleteClub = (clubId: string) => {
        const club = ownedClubs.find(c => c.id === clubId);
        if (club) {
            setDeleteClubId(clubId);
            setDeleteClubName(club.name);
            setShowDeleteClubDialog(true);
        }
    };

    const handleConfirmDeleteClub = async () => {
        if (!deleteClubId) return;

        try {
            // Immediately remove from UI (optimistic update)
            const updatedClubs = ownedClubs.filter(club => club.id !== deleteClubId);
            setOwnedClubs(updatedClubs);

            // Close the dialog
            setShowDeleteClubDialog(false);
            setDeleteClubId(null);
            setDeleteClubName('');

            // Call API - the hook will handle success/error feedback
            const success = await deleteOwnedClub(deleteClubId);

            if (!success) {
                // If API failed, the hook will have already reverted the state
                // and shown error feedback, so we don't need to do anything
                console.error('Delete club API failed');
            }

        } catch (error) {
            console.error('Error deleting club:', error);
            // Reload to get correct state
            loadOwnedClubs();
        }
    };

    const handleCancelDeleteClub = () => {
        setShowDeleteClubDialog(false);
        setDeleteClubId(null);
        setDeleteClubName('');
    };

    const handleCreateClub = () => {
        handleNavigation('/admin/new-club');
    };

    // Handle event operations
    const handleCreateEvent = () => {
        setShowCreateModal('event');
        // Navigate to new event creation page
        handleNavigation('/admin/new-event');
    };

    const handleEditEvent = (eventId: string) => {
        router.push(`/admin/event-preview?eventId=${eventId}&edit=true`);
    };

    const handleDeleteEvent = (eventId: string) => {
        const event = organizedEvents.find(e => e.id === eventId);
        if (event) {
            setDeleteEventId(eventId);
            setDeleteEventTitle(event.title);
            setShowDeleteDialog(true);
        }
    };

    const handleConfirmDeleteEvent = async () => {
        if (!deleteEventId) return;

        try {
            // Immediately remove from UI (optimistic update)
            const updatedEvents = organizedEvents.filter(event => event.id !== deleteEventId);
            setEvents(updatedEvents);

            // Close the dialog
            setShowDeleteDialog(false);
            setDeleteEventId(null);
            setDeleteEventTitle('');

            // Show success feedback
            const toastDiv = document.createElement('div');
            toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            toastDiv.textContent = '✓ Event deleted successfully!';
            document.body.appendChild(toastDiv);
            setTimeout(() => {
                if (document.body.contains(toastDiv)) {
                    document.body.removeChild(toastDiv);
                }
            }, 3000);

            // Call API in background (don't wait for it)
            eventCrud.deleteEvent(deleteEventId).then(success => {
                if (!success) {
                    // If API failed, revert the optimistic update
                    console.error('API delete failed, reverting...');
                    loadOrganizedEvents({ page: 0, size: 20, sortBy: 'startDateTime', sortOrder: 'asc' });
                }
            });

        } catch (error) {
            console.error('Error deleting event:', error);
            // Show error toast
            const errorToast = document.createElement('div');
            errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            errorToast.textContent = '⚠️ Failed to delete event';
            document.body.appendChild(errorToast);
            setTimeout(() => {
                if (document.body.contains(errorToast)) {
                    document.body.removeChild(errorToast);
                }
            }, 3000);
            // Reload to get correct state
            loadOrganizedEvents({ page: 0, size: 20, sortBy: 'startDateTime', sortOrder: 'asc' });
        }
    };

    const handleCancelDeleteEvent = () => {
        setShowDeleteDialog(false);
        setDeleteEventId(null);
        setDeleteEventTitle('');
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Welcome back, {currentUser?.fullName || currentUser?.username || 'Admin'}</h2>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                    >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Content wrapper with padding */}
                    <div className="px-6 py-6">

                        {/* Owned Clubs Section - Moved to top */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold">Owned Clubs</h3>
                                    <div className="px-3 py-1 bg-[#14FFEC]/10 border border-[#14FFEC]/20 rounded-full">
                                        <span className="text-[#14FFEC] text-sm font-medium">
                                            {ownedClubs?.length || 0} {ownedClubs?.length === 1 ? 'Club' : 'Clubs'}
                                        </span>
                                    </div>
                                </div>
                                {isLoadingOwnedClubs && (
                                    <div className="text-[#14FFEC] text-sm">Loading...</div>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Click on a club to manage its events</p>
                            <div className="space-y-3">
                                {ownedClubs?.map((club) => (
                                    <div
                                        key={club.id}
                                        onClick={() => router.push(`/admin/club/${club.id}/events`)}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/10 rounded-[15px] p-4 cursor-pointer hover:bg-[#0D1F1F]/80 hover:border-[#14FFEC]/40 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center">
                                                    {club.logo ? (
                                                        <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Users className="w-6 h-6 text-[#14FFEC]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">{club.name}</h4>
                                                    <p className="text-gray-400 text-sm">{club.memberCount || 0} members</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClub(club.id);
                                                    }}
                                                    className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-[#14FFEC]" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClub(club.id);
                                                    }}
                                                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    disabled={clubCrud.isDeleting}
                                                    title="Delete Club"
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {ownedClubs?.length === 0 && !isLoadingOwnedClubs && (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-400">No clubs found</p>
                                        <button
                                            onClick={handleCreateClub}
                                            className="mt-4 px-6 py-2 bg-[#14FFEC] text-black font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                                        >
                                            Create Your First Club
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {/* Create New Club */}
                                <div
                                    onClick={handleCreateClub}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#14FFEC]/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#14FFEC] w-10 h-10 rounded-md flex items-center justify-center">
                                            <Plus className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Create New Club</p>
                                            <p className="text-gray-400 text-xs">Set up a new club location</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Create New Event */}
                                <div
                                    onClick={handleCreateEvent}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#14FFEC]/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#14FFEC] w-10 h-10 rounded-md flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Create New Event</p>
                                            <p className="text-gray-400 text-xs">Schedule a new event</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* Update Dynamic Pricing */}
                                <div
                                    onClick={() => handleNavigation('/admin/update-live-details')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Update Dynamic Pricing</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-black" />
                                    </div>
                                </div>

                                {/* Check Event bookings */}
                                <div
                                    onClick={() => handleNavigation('/admin/event-analytics')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Event Analytics</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <BarChart className="w-5 h-5 text-black" />
                                    </div>
                                </div>

                                {/* Club Settings */}
                                <div
                                    onClick={() => handleNavigation('/admin/settings')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-3 flex flex-col items-center justify-between cursor-pointer"
                                >
                                    <p className="text-center text-white text-xs mb-2">Club Settings</p>
                                    <div className="bg-[#14FFEC] w-8 h-8 rounded-md flex items-center justify-center">
                                        <Edit className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Total Revenue */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Total Revenue</p>
                                    <p className="text-white text-xl font-bold">{stats.totalRevenue}</p>
                                </div>

                                {/* Total Ticket Sold */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Total Ticket Sold</p>
                                    <p className="text-white text-xl font-bold">{stats.totalTicketSold}</p>
                                </div>

                                {/* No. of People Attending */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">No. of People Attending</p>
                                    <p className="text-white text-xl font-bold">{stats.peopleAttending}</p>
                                </div>

                                {/* Active Events */}
                                <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                                    <p className="text-[#14FFEC] text-sm mb-1">Active Events</p>
                                    <p className="text-white text-xl font-bold">{stats.activeEvents}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Event Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogOverlay />
                <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                    <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px]">
                        {/* Close button in the top-right corner */}
                        <div className="absolute right-3 top-3">
                            <button
                                onClick={handleCancelDeleteEvent}
                                className="w-8 h-8 flex items-center justify-center text-white bg-transparent rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Warning Icon */}
                        <div className="w-[80px] h-[80px] relative overflow-hidden flex items-center justify-center">
                            <div className="text-4xl">⚠️</div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-[12px]">
                            <div className="text-[#F9F9F9] text-[20px] font-semibold font-['Manrope']">
                                Delete Event
                            </div>
                            <div className="text-center text-[#9D9C9C] text-[16px] font-['Manrope'] leading-[19.20px]">
                                Are you sure you want to delete <span className="text-[#14FFEC] font-semibold">"{deleteEventTitle}"</span>?
                            </div>
                            <div className="text-center text-[#ff6b6b] text-[14px] font-['Manrope'] leading-[17px]">
                                This action cannot be undone
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-[14px]">
                            <button
                                onClick={handleConfirmDeleteEvent}
                                className="w-[154px] h-[38px] bg-[#d32f2f] rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-[#b71c1c] transition-all duration-300"
                            >
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                    Delete
                                </div>
                            </button>

                            <button
                                onClick={handleCancelDeleteEvent}
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

            {/* Delete Club Confirmation Dialog */}
            <Dialog open={showDeleteClubDialog} onOpenChange={setShowDeleteClubDialog}>
                <DialogOverlay />
                <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                    <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px]">
                        {/* Close button in the top-right corner */}
                        <div className="absolute right-3 top-3">
                            <button
                                onClick={handleCancelDeleteClub}
                                className="w-8 h-8 flex items-center justify-center text-white bg-transparent rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Warning Icon */}
                        <div className="w-[80px] h-[80px] relative overflow-hidden flex items-center justify-center">
                            <div className="text-4xl">⚠️</div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-[12px]">
                            <div className="text-[#F9F9F9] text-[20px] font-semibold font-['Manrope']">
                                Delete Club
                            </div>
                            <div className="text-center text-[#9D9C9C] text-[16px] font-['Manrope'] leading-[19.20px]">
                                Are you sure you want to delete <span className="text-[#14FFEC] font-semibold">"{deleteClubName}"</span>?
                            </div>
                            <div className="text-center text-[#ff6b6b] text-[14px] font-['Manrope'] leading-[17px]">
                                This action cannot be undone
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-[14px]">
                            <button
                                onClick={handleConfirmDeleteClub}
                                className="w-[154px] h-[38px] bg-[#d32f2f] rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-[#b71c1c] transition-all duration-300"
                            >
                                <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                    Delete
                                </div>
                            </button>

                            <button
                                onClick={handleCancelDeleteClub}
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