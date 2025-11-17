'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { EventService, EventDetailsResponse } from '@/lib/services/event.service';

/**
 * Edit Event Page
 * This page allows admins to edit an existing event
 */
export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [eventData, setEventData] = useState<EventDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        maxAttendees: '',
        isPublic: true,
        requiresApproval: false
    });

    useEffect(() => {
        const loadEventData = async () => {
            try {
                setIsLoading(true);
                const response = await EventService.getEventDetails(eventId);

                if (response.success && response.data) {
                    const data = response.data;
                    setEventData(data);

                    // Populate form with existing data
                    setFormData({
                        title: data.title,
                        description: data.description,
                        startDateTime: data.startDateTime,
                        endDateTime: data.endDateTime,
                        location: data.location,
                        maxAttendees: data.maxAttendees?.toString() || '',
                        isPublic: data.isPublic,
                        requiresApproval: data.requiresApproval
                    });
                } else {
                    setError('Failed to load event data');
                }
            } catch (err) {
                console.error('Error loading event:', err);
                setError('Error loading event details');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            loadEventData();
        }
    }, [eventId]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            const updateData = {
                title: formData.title,
                description: formData.description,
                startDateTime: formatDateTimeForAPI(formData.startDateTime),
                endDateTime: formatDateTimeForAPI(formData.endDateTime),
                location: formData.location,
                maxAttendees: parseInt(formData.maxAttendees) || undefined,
                isPublic: formData.isPublic,
                requiresApproval: formData.requiresApproval
            };

            const response = await EventService.updateEvent(eventId, updateData);

            if (response.success) {
                // Navigate back to admin dashboard
                router.push('/admin');
            } else {
                setError(response.message || 'Failed to update event');
            }
        } catch (err: any) {
            console.error('Error updating event:', err);
            setError(err.message || 'Error updating event');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDateTimeForInput = (dateTime: string) => {
        if (!dateTime) return '';
        try {
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    const formatDateTimeForAPI = (dateTime: string) => {
        if (!dateTime) return '';
        try {
            return new Date(dateTime).toISOString();
        } catch (error) {
            console.error('Date API formatting error:', error);
            return dateTime;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-[#14FFEC] rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error && !eventData) {
        return (
            <div className="min-h-screen bg-[#021313] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4">⚠️</div>
                    <p className="text-red-400">{error}</p>
                    <button
                        onClick={() => router.push('/admin')}
                        className="mt-4 px-4 py-2 bg-[#14FFEC] text-black rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[120px]">
                <div className="px-6 pt-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold">Edit Event</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-[140px] px-6 pb-24">
                <div className="bg-[#0D1F1F] rounded-[20px] p-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                placeholder="Enter event title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                placeholder="Enter event description"
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.startDateTime)}
                                    onChange={(e) => handleInputChange('startDateTime', e.target.value)}
                                    className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.endDateTime)}
                                    onChange={(e) => handleInputChange('endDateTime', e.target.value)}
                                    className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Location and Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                    placeholder="Enter event location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Max Attendees</label>
                                <input
                                    type="number"
                                    value={formData.maxAttendees}
                                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                                    className="w-full p-3 bg-[#021313] border border-[#14FFEC]/20 rounded-lg text-white focus:border-[#14FFEC] focus:outline-none"
                                    placeholder="Enter max attendees"
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                    className="w-4 h-4 rounded border-[#14FFEC]/20 bg-[#021313] text-[#14FFEC] focus:ring-[#14FFEC]"
                                />
                                <label htmlFor="isPublic" className="text-sm">Public Event</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="requiresApproval"
                                    checked={formData.requiresApproval}
                                    onChange={(e) => handleInputChange('requiresApproval', e.target.checked)}
                                    className="w-4 h-4 rounded border-[#14FFEC]/20 bg-[#021313] text-[#14FFEC] focus:ring-[#14FFEC]"
                                />
                                <label htmlFor="requiresApproval" className="text-sm">Requires Approval</label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#14FFEC] text-black rounded-lg font-medium disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => router.push(`/admin/event-preview?eventId=${eventId}`)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#14FFEC]/20 text-[#14FFEC] border border-[#14FFEC] rounded-lg font-medium"
                            >
                                <Eye className="w-5 h-5" />
                                Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
