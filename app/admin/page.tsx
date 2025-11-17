'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Plus, DollarSign, BarChart, Edit, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';
import { useAdminClubs } from '@/hooks/use-admin-clubs';
import { useAdminEvents } from '@/hooks/use-admin-events';
import { useEventList } from '@/hooks/use-event-list';
import { useClubList } from '@/hooks/use-club-list';
import { useOrganizedEvents } from '@/hooks/use-organized-events';
import { AccessDenied } from '@/components/common/access-denied';
import { AuthService } from '@/lib/services/auth.service';

export default function AdminDashboard() {
    // Authentication info - no redirects
    const isAuthenticated = AuthService.isAuthenticated();
    const userRoles = AuthService.getUserRolesFromStorage();
    const hasRole = (role: string) => AuthService.hasRole(role);

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active');
    const [showCreateModal, setShowCreateModal] = useState<'club' | 'event' | null>(null);

    // Use profile hook for admin profile data
    const {
        currentUser,
        isAdmin,
        isSuperAdmin,
    } = useProfile();

    // CRUD hooks for clubs and events
    const clubCrud = useAdminClubs();
    const eventCrud = useAdminEvents();
    const { eventList, loadEventList, isLoadingList: isLoadingEvents } = useEventList();
    const { clubs: clubsData, loadClubs, loading: isLoadingClubs } = useClubList();
    const { events: organizedEvents, loadOrganizedEvents, isLoading: isLoadingOrganized } = useOrganizedEvents();

    // Load admin data on mount - ONLY ONCE
    useEffect(() => {
        let isMounted = true;

        const loadAdminData = async () => {
            if (!isMounted) return;

            try {
                // Load events for this admin
                await loadEventList();

                // Load clubs for this admin
                await loadClubs();

                // Load admin-specific club data
                await clubCrud.refreshData();

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

    // Calculate stats from real event data
    const calculateStats = () => {
        if (!eventList?.content) {
            return {
                totalRevenue: 'Rs 0',
                totalTicketSold: '0/0',
                peopleAttending: '0',
                activeEvents: '0'
            };
        }

        const events = eventList.content;
        const activeEvents = events.filter(e => e.status === 'ONGOING' || e.ongoing);
        const totalAttendees = events.reduce((sum, event) => sum + event.attendeeCount, 0);
        const totalCapacity = events.reduce((sum, event) => sum + event.maxAttendees, 0);

        return {
            totalRevenue: 'Rs 0', // Fetch from API if available
            totalTicketSold: `${totalAttendees}/${totalCapacity}`,
            peopleAttending: totalAttendees.toString(),
            activeEvents: activeEvents.length.toString()
        };
    };

    const stats = calculateStats();
    const clubName = clubsData?.content?.[0]?.name || 'Club';

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    // Handle club operations
    const handleCreateClub = () => {
        setShowCreateModal('club');
        // Navigate to new club creation page
        handleNavigation('/admin/new-club');
    };

    const handleEditClub = (clubId: string) => {
        router.push(`/admin/edit-club/${clubId}`);
    };

    const handleDeleteClub = async (clubId: string) => {
        if (confirm('Are you sure you want to delete this club?')) {
            const success = await clubCrud.deleteClub(clubId);
            if (success) {
                await loadClubs(); // Refresh clubs list
            }
        }
    };

    // Handle event operations
    const handleCreateEvent = () => {
        setShowCreateModal('event');
        // Navigate to new event creation page
        handleNavigation('/admin/new-event');
    };

    const handleEditEvent = (eventId: string) => {
        router.push(`/admin/edit-event/${eventId}`);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            const success = await eventCrud.deleteEvent(eventId);
            if (success) {
                await loadEventList(); // Refresh events list
                await loadOrganizedEvents({ page: 0, size: 20, sortBy: 'startDateTime', sortOrder: 'asc' }); // Refresh organized events
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6">
                    <h2 className="text-lg font-medium">Welcome back, {currentUser?.fullName || currentUser?.username || 'Admin'}</h2>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Club name and logo header section */}
                    <div className="px-6 pt-6 pb-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-bold tracking-wide uppercase">{clubName}</h1>
                            {/* Club Logo */}
                            <div className="w-16 h-16 bg-black rounded-full border-2 border-[#14FFEC] flex items-center justify-center relative">
                                <div className="relative w-14 h-14 flex items-center justify-center text-xs text-center text-[#14FFEC]">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="uppercase font-semibold text-xs">LOGO</span>
                                        <span className="block text-[8px]">+ DRINKS</span>
                                    </div>
                                    <div className="absolute right-0 bottom-0 bg-white rounded-full w-5 h-5 flex items-center justify-center z-50">
                                        <Plus className="w-3 h-3 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content wrapper with padding */}
                    <div className="px-6 py-4">
                        {/* Create New Event Button */}
                        <button
                            onClick={() => handleNavigation('/admin/new-event')}
                            className="w-full h-12 bg-[#14FFEC] text-black font-bold rounded-[30px] flex items-center justify-center relative mb-6"
                        >
                            Create new event
                            <div className="absolute right-4 transform rotate-12">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </button>

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

                        {/* Quick Actions Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
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
                                            <p className="text-gray-400 text-xs">Add a new club to manage</p>
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

                        {/* My Clubs Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">My Clubs</h3>
                                {isLoadingClubs && (
                                    <div className="text-[#14FFEC] text-sm">Loading...</div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {clubsData?.content?.slice(0, 3).map((club) => (
                                    <div
                                        key={club.id}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/10 rounded-[15px] p-4"
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
                                                    onClick={() => handleEditClub(club.id)}
                                                    className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-[#14FFEC]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClub(club.id)}
                                                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    disabled={clubCrud.isDeleting}
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {clubsData?.content?.length === 0 && (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-400">No clubs found</p>
                                        <button
                                            onClick={handleCreateClub}
                                            className="mt-2 px-4 py-2 bg-[#14FFEC] text-black rounded-lg font-medium"
                                        >
                                            Create Your First Club
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Club Info Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Club Management</h3>
                            <div className="space-y-3">
                                {/* Create New Club */}
                                <div
                                    onClick={handleCreateClub}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <Plus className="w-5 h-5 text-[#14FFEC]" />
                                        <p className="text-white font-medium">Create New Club</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>

                                {/* My Clubs List */}
                                {isLoadingClubs && (
                                    <div className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4">
                                        <p className="text-gray-400">Loading clubs...</p>
                                    </div>
                                )}

                                {!isLoadingClubs && clubsData?.content && clubsData.content.length > 0 && clubsData.content.slice(0, 2).map((club) => (
                                    <div
                                        key={club.id}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#14FFEC]/20 rounded-lg flex items-center justify-center">
                                                    {club.logo ? (
                                                        <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Users className="w-5 h-5 text-[#14FFEC]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{club.name}</p>
                                                    <p className="text-gray-400 text-sm">{club.memberCount || 0} members</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClub(club.id);
                                                    }}
                                                    className="p-2 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/30 transition-colors"
                                                    title="Edit Club"
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

                                {!isLoadingClubs && (!clubsData?.content || clubsData.content.length === 0) && (
                                    <div
                                        onClick={handleCreateClub}
                                        className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                    >
                                        <p className="text-gray-400">No clubs found. Create your first club!</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </div>
                                )}

                                {/* Update live Details */}
                                <div
                                    onClick={() => handleNavigation('/admin/update-live-details')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <p className="text-white font-medium">Update Live Details</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>

                                {/* Add Story */}
                                <div
                                    onClick={() => handleNavigation('/admin/add-story')}
                                    className="bg-[#0D1F1F] border border-[#14FFEC]/40 rounded-[15px] p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <p className="text-white font-medium">Add Club Story</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* My Organized Events Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">My Organized Events</h3>
                                {isLoadingOrganized && (
                                    <div className="text-[#14FFEC] text-sm">Loading...</div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {organizedEvents && organizedEvents.length > 0 ? (
                                    organizedEvents.slice(0, 5).map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-[#0D1F1F] border border-[#14FFEC]/10 rounded-[15px] p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium mb-1">{event.title}</h4>
                                                    <div className="space-y-1 text-sm text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-[#14FFEC]" />
                                                            <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-[#14FFEC]" />
                                                            <span>{new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-[#14FFEC]" />
                                                            <span>{event.attendedCount || 0}/{event.maxAttendees} attendees</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
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
                                    ))
                                ) : (
                                    !isLoadingOrganized && (
                                        <div className="text-center py-8">
                                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-400">No organized events found</p>
                                            <button
                                                onClick={handleCreateEvent}
                                                className="mt-2 px-4 py-2 bg-[#14FFEC] text-black rounded-lg font-medium"
                                            >
                                                Create Your First Event
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Event Info Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Event Info</h3>

                            {/* Event Tabs */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => handleTabChange('past')}
                                    className={`px-4 py-2 rounded-full text-xs font-medium ${activeTab === 'past'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Past Events
                                </button>
                                <button
                                    onClick={() => handleTabChange('active')}
                                    className={`px-4 py-2 rounded-full text-xs font-medium ${activeTab === 'active'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Active Events
                                </button>
                                <button
                                    onClick={() => handleTabChange('upcoming')}
                                    className={`px-4 py-2 rounded-full text-xs font-medium ${activeTab === 'upcoming'
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'bg-[#0D1F1F] text-white'
                                        }`}
                                >
                                    Upcoming Events
                                </button>
                            </div>

                            {/* Event Cards */}
                            <div className="pb-24">
                                {/* Loading State */}
                                {isLoadingEvents && (
                                    <div className="text-center py-8 text-gray-400">
                                        Loading events...
                                    </div>
                                )}

                                {/* Active Events */}
                                {activeTab === 'active' && !isLoadingEvents && (
                                    <>
                                        {eventList?.content && eventList.content.filter(event => event.status === 'ONGOING' || event.ongoing).length > 0 ? (
                                            eventList.content.filter(event => event.status === 'ONGOING' || event.ongoing).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="flex items-start justify-between mb-4 cursor-pointer relative group"
                                                >
                                                    <div
                                                        className="flex-1"
                                                        onClick={() => handleNavigation('/admin/event-analytics')}
                                                    >
                                                        <h4 className="text-lg font-semibold text-[#14FFEC] mb-1">{event.title}</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.formattedDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                                    <circle cx="12" cy="10" r="3" />
                                                                </svg>
                                                                <span>{event.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.attendeeCount}/{event.maxAttendees} attendees</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.formattedTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Admin Action Buttons */}
                                                    <div className="flex flex-col gap-2 ml-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditEvent(event.id);
                                                            }}
                                                            className="p-1.5 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/40 transition-colors"
                                                            title="Edit Event"
                                                        >
                                                            <Edit className="w-3 h-3 text-[#14FFEC]" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteEvent(event.id);
                                                            }}
                                                            className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
                                                            disabled={eventCrud.isDeleting}
                                                            title="Delete Event"
                                                        >
                                                            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="w-20 h-28 bg-[#0D1F1F] rounded-md overflow-hidden ml-4 border border-[#14FFEC]/40">
                                                        <img
                                                            src={event.imageUrl || "/event list/Rectangle 1.jpg"}
                                                            alt="Event Poster"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                No active events to display
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Past Events */}
                                {activeTab === 'past' && !isLoadingEvents && (
                                    <>
                                        {eventList?.content && eventList.content.filter(event => event.status === 'COMPLETED' || event.pastEvent).length > 0 ? (
                                            eventList.content.filter(event => event.status === 'COMPLETED' || event.pastEvent).map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={() => handleNavigation('/admin/event-analytics')}
                                                    className="flex items-start justify-between mb-4 cursor-pointer opacity-75"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-300 mb-1">{event.title}</h4>
                                                        <div className="space-y-1 text-sm text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{event.formattedDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4" />
                                                                <span>{event.attendeeCount} attended</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-20 h-28 bg-[#0D1F1F] rounded-md overflow-hidden ml-4 border border-gray-500/20">
                                                        <img
                                                            src={event.imageUrl || "/event list/Rectangle 1.jpg"}
                                                            alt="Event Poster"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                No past events to display
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Upcoming Events */}
                                {activeTab === 'upcoming' && !isLoadingEvents && (
                                    <>
                                        {eventList && eventList.content.filter(event => event.status === 'UPCOMING' || event.upcoming).length > 0 ? (
                                            eventList.content.filter(event => event.status === 'UPCOMING' || event.upcoming).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="flex items-start justify-between mb-4 cursor-pointer relative group"
                                                >
                                                    <div
                                                        className="flex-1"
                                                        onClick={() => handleNavigation('/admin/event-analytics')}
                                                    >
                                                        <h4 className="text-lg font-semibold text-[#14FFEC] mb-1">{event.title}</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.formattedDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC]">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                                    <circle cx="12" cy="10" r="3" />
                                                                </svg>
                                                                <span>{event.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.attendeeCount}/{event.maxAttendees} registered</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-[#14FFEC]" />
                                                                <span>{event.timeUntilEvent}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Admin Action Buttons */}
                                                    <div className="flex flex-col gap-2 ml-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditEvent(event.id);
                                                            }}
                                                            className="p-1.5 bg-[#14FFEC]/20 rounded-lg hover:bg-[#14FFEC]/40 transition-colors"
                                                            title="Edit Event"
                                                        >
                                                            <Edit className="w-3 h-3 text-[#14FFEC]" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteEvent(event.id);
                                                            }}
                                                            className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
                                                            disabled={eventCrud.isDeleting}
                                                            title="Delete Event"
                                                        >
                                                            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="w-20 h-28 bg-[#0D1F1F] rounded-md overflow-hidden ml-4 border border-[#14FFEC]/40">
                                                        <img
                                                            src={event.imageUrl || "/event list/Rectangle 1.jpg"}
                                                            alt="Event Poster"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                No upcoming events to display
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
