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
import { EventService } from '@/lib/services/event.service';
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
            // Close the dialog
            setShowDeleteClubDialog(false);
            const clubIdToDelete = deleteClubId;
            const clubNameToDelete = deleteClubName;
            setDeleteClubId(null);
            setDeleteClubName('');

            // Call API and wait for response
            const success = await deleteOwnedClub(clubIdToDelete);

            if (success) {
                // Remove from UI after successful API call
                const updatedClubs = ownedClubs.filter(club => club.id !== clubIdToDelete);
                setOwnedClubs(updatedClubs);
            } else {
                // Reload to get correct state if deletion failed
                loadOwnedClubs();
            }
        } catch (error: any) {
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
            const eventIdToDelete = deleteEventId;
            const eventTitleToDelete = deleteEventTitle;

            // Close the dialog
            setShowDeleteDialog(false);
            setDeleteEventId(null);
            setDeleteEventTitle('');

            // Call API to delete
            const response = await EventService.deleteEvent(eventIdToDelete);

            if (response.success) {
                // Remove from UI immediately after successful API call
                const updatedEvents = organizedEvents.filter(event => event.id !== eventIdToDelete);
                setEvents(updatedEvents);

                // Show success toast
                toast({
                    title: "Success",
                    description: response.message || `Event "${eventTitleToDelete}" deleted successfully`,
                });
            } else {
                throw new Error(response.message || 'Failed to delete event');
            }
        } catch (error: any) {
            console.error('Error deleting event:', error);

            // Extract error message from different possible formats
            let errorMessage = 'Failed to delete event';

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Show exact error message from API
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
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
                    {/* Club name and logo/story header section - Only show if club exists */}
                    {ownedClubs && ownedClubs.length > 0 && (
                        <div className="px-6 pt-6 pb-2">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-bold tracking-wide uppercase">{ownedClubs[0]?.name || 'Club'}</h1>
                                {/* Story Circle */}
                                <div
                                    onClick={() => router.push('/admin/upload-story')}
                                    className="w-16 h-16 bg-black rounded-full border-2 border-[#14FFEC] flex items-center justify-center relative cursor-pointer hover:border-[#14FFEC] hover:bg-[#14FFEC]/10 transition-colors"
                                >
                                    <div className="relative w-14 h-14 flex items-center justify-center text-xs text-center text-[#14FFEC]">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="uppercase font-semibold text-xs">Story</span>
                                            <span className="block text-[8px]">+ Add</span>
                                        </div>
                                        <div className="absolute right-0 bottom-0 bg-white rounded-full w-5 h-5 flex items-center justify-center z-50">
                                            <Plus className="w-3 h-3 text-black" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content wrapper with padding */}
                    <div className="px-6 py-6">

                        {/* Quick Actions Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {/* Create New Club - Only show if no club exists */}
                                {ownedClubs?.length === 0 && !isLoadingOwnedClubs && (
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
                                )}

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

                            <div className="grid grid-cols-3 gap-3 mb-3">
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

                            {/* My Stories Button - Full Width */}
                            <div
                                onClick={() => handleNavigation('/admin/my-stories')}
                                className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#14FFEC]/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#14FFEC] w-10 h-10 rounded-md flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m10 2V2M5.5 9h13M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                                            <circle cx="12" cy="14" r="2" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">My Stories</p>
                                        <p className="text-gray-400 text-xs">View and manage your stories</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* My Organised Events Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold">My Organised Events</h3>
                                    <div className="px-3 py-1 bg-[#14FFEC]/10 border border-[#14FFEC]/20 rounded-full">
                                        <span className="text-[#14FFEC] text-sm font-medium">
                                            {organizedEvents?.length || 0} {organizedEvents?.length === 1 ? 'Event' : 'Events'}
                                        </span>
                                    </div>
                                </div>
                                {isLoadingOrganized && (
                                    <div className="text-[#14FFEC] text-sm">Loading...</div>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Manage your organized events</p>
                            <div className="space-y-3">
                                {organizedEvents?.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/10 rounded-[15px] p-4"
                                    >
                                        <div className="flex gap-3">
                                            {/* Event Image */}
                                            {event.imageUrl && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            {!event.imageUrl && (
                                                <div className="w-16 h-16 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-8 h-8 text-[#14FFEC]" />
                                                </div>
                                            )}

                                            {/* Event Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-medium mb-1 truncate">{event.title}</h4>
                                                <div className="space-y-1 text-xs text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3 h-3 text-[#14FFEC]" />
                                                        <span>{event.formattedDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-[#14FFEC]" />
                                                        <span>{event.formattedTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3 h-3 text-[#14FFEC]" />
                                                        <span>{event.attendeeStatus}</span>
                                                    </div>
                                                </div>
                                                {/* Status Badge */}
                                                <div className="mt-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${event.ongoing ? 'bg-green-500/20 text-green-400' :
                                                        event.upcoming ? 'bg-blue-500/20 text-blue-400' :
                                                            event.pastEvent ? 'bg-gray-500/20 text-gray-400' :
                                                                'bg-[#14FFEC]/20 text-[#14FFEC]'
                                                        }`}>
                                                        {event.eventStatusText}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleEditEvent(event.id)}
                                                    className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                                                    title="Edit Event"
                                                >
                                                    <Edit className="w-4 h-4 text-[#14FFEC]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    disabled={eventCrud.isDeleting}
                                                    title="Delete Event"
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {organizedEvents?.length === 0 && !isLoadingOrganized && (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-400">No organized events found</p>
                                        <button
                                            onClick={handleCreateEvent}
                                            className="mt-4 px-6 py-2 bg-[#14FFEC] text-black font-semibold rounded-full hover:bg-opacity-90 transition-colors"
                                        >
                                            Create Your First Event
                                        </button>
                                    </div>
                                )}
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