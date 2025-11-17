'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Edit Event Page
 * This page allows admins to edit an existing event
 * For now, it redirects to the event details or shows a placeholder
 */
export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    useEffect(() => {
        // For now, redirect to event preview or show a message
        // In the future, this can be a full edit form similar to new-event
        console.log('Edit event:', eventId);
    }, [eventId]);

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[120px]">
                <div className="px-6 pt-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
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
                <div className="bg-[#0D1F1F] rounded-[20px] p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4">Event Editor</h2>
                    <p className="text-gray-400 mb-6">
                        Event ID: {eventId}
                    </p>
                    <p className="text-gray-400 mb-6">
                        Edit functionality coming soon. For now, you can view and delete events from the admin dashboard.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-6 py-3 bg-[#14FFEC] text-black rounded-lg font-medium"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => router.push(`/event/${eventId}`)}
                            className="px-6 py-3 bg-[#14FFEC]/20 text-[#14FFEC] border border-[#14FFEC] rounded-lg font-medium"
                        >
                            View Event Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
