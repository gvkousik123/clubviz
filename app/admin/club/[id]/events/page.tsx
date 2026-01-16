'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Users, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ClubService, Club } from '@/lib/services/club.service';
import { EventService } from '@/lib/services/event.service';
import { Event } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';

export default function ClubEventsPage() {
    const router = useRouter();
    const params = useParams();
    const clubId = params.id as string;
    const { toast } = useToast();

    const [club, setClub] = useState<Club | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Fetch Club Details
                const clubResponse = await ClubService.getClubById(clubId);
                if (clubResponse.success && clubResponse.data) {
                    setClub(clubResponse.data);
                } else if (clubResponse.data) {
                    // Handle direct data response
                    setClub(clubResponse.data);
                }

                // Fetch Club Events
                const eventsResponse = await EventService.getEventsByClub(clubId, { size: 100, sortOrder: 'desc', sortBy: 'startDateTime' });

                // Handle different response formats
                if (eventsResponse.success !== false && eventsResponse.data) {
                    if (eventsResponse.data.events) {
                        setEvents(eventsResponse.data.events);
                    } else if (Array.isArray(eventsResponse.data)) {
                        setEvents(eventsResponse.data);
                    } else if ((eventsResponse.data as any).content) {
                        setEvents((eventsResponse.data as any).content);
                    }
                } else if (Array.isArray((eventsResponse as any).content)) {
                    setEvents((eventsResponse as any).content);
                } else if (Array.isArray(eventsResponse)) {
                    setEvents(eventsResponse);
                }
            } catch (error: any) {
                console.error('Error loading data:', error);
                // Check for JWT token expiration
                const errorMessage = error?.message || error?.response?.data?.error || '';
                if (errorMessage.toLowerCase().includes('jwt token') || errorMessage.toLowerCase().includes('token expired')) {
                    toast({
                        title: "Session Expired",
                        description: "Please login again",
                        variant: "destructive",
                    });
                    localStorage.clear();
                    router.push('/auth/login');
                    return;
                }
                toast({
                    title: "Error",
                    description: "Failed to load club events",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (clubId) {
            loadData();
        }
    }, [clubId, toast, router]);

    const handleCreateEvent = () => {
        router.push(`/admin/new-event?clubId=${clubId}`);
    };

    const handleEditEvent = (eventId: string) => {
        // Navigate to edit event page with clubId
        router.push(`/admin/edit-event/${eventId}?clubId=${clubId}`);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            setIsDeleting(true);
            const response = await EventService.deleteEvent(eventId);
            if (response.success !== false) {
                toast({
                    title: "Success",
                    description: "Event deleted successfully",
                });
                // Remove from local state
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                throw new Error(response.message || 'Failed to delete');
            }
        } catch (error: any) {
            console.error('Error deleting event:', error);
            // Check for JWT token expiration
            const errorMessage = error?.message || error?.response?.data?.error || '';
            if (errorMessage.toLowerCase().includes('jwt token') || errorMessage.toLowerCase().includes('token expired')) {
                toast({
                    title: "Session Expired",
                    description: "Please login again",
                    variant: "destructive",
                });
                localStorage.clear();
                router.push('/auth/login');
                return;
            }
            toast({
                title: "Error",
                description: "Failed to delete event",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-[#14FFEC]">Loading events...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.push('/admin')} className="text-white hover:text-[#14FFEC] transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-lg font-medium opacity-80">Events Management</h2>
                            <h1 className="text-2xl font-bold">{club?.name || 'Club Events'}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-0 relative mt-[140px] z-40">
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col min-h-[calc(100vh-140px)]">
                    <div className="px-6 py-6">

                        {/* Create Button */}
                        <button
                            onClick={handleCreateEvent}
                            className="w-full h-12 bg-[#14FFEC] text-black font-bold rounded-[30px] flex items-center justify-center relative mb-8 hover:bg-[#11A99B] transition-colors"
                        >
                            Create New Event
                            <div className="absolute right-4 transform rotate-12">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Events List */}
                        <div className="space-y-4">
                            {events.length > 0 ? events.map((event) => (
                                <div key={event.id} className="bg-[#0D1F1F] border border-[#14FFEC]/20 rounded-[20px] p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                            <div className="flex flex-col gap-2 text-gray-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{(event as any).formattedDate || new Date(event.startDateTime).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{event.formattedTime || new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                {event.locationText && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-[#14FFEC]" />
                                                        <span className="line-clamp-1">{typeof event.locationText === 'object' ? (event.locationText as any).fullAddress : event.locationText}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-[#14FFEC]" />
                                                    <span>{(event as any).attendeeCount || event.attendedCount || 0} attendees</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => handleEditEvent(event.id)}
                                                className="p-2 bg-[#14FFEC]/10 text-[#14FFEC] rounded-lg hover:bg-[#14FFEC]/20 transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                disabled={isDeleting}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${(event as any).status === 'ONGOING' ? 'bg-green-500/20 text-green-400' :
                                                (event as any).status === 'COMPLETED' ? 'bg-gray-500/20 text-gray-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {(event as any).status || (new Date(event.endDateTime) < new Date() ? 'COMPLETED' : 'UPCOMING')}
                                        </span>
                                        {event.isPublic && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#14FFEC]/10 text-[#14FFEC]">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    No events found for this club.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
