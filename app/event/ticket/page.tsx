'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * This page redirects to the proper booking ticket page
 * Users should view their tickets through /booking/ticket instead
 */
function EventTicketRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticketId');

    useEffect(() => {
        // Redirect to proper booking ticket page
        if (ticketId) {
            router.replace(`/booking/ticket?ticketId=${ticketId}`);
        } else {
            // If no ticketId, redirect to bookings list
            router.replace('/account/bookings');
        }
    }, [ticketId, router]);

    return (
        <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin mx-auto mb-4" />
                <p className="text-white text-sm">Redirecting to your ticket...</p>
            </div>
        </div>
    );
}

export default function EventTicketRedirect() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#021313] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin mx-auto mb-4" />
                    <p className="text-white text-sm">Loading...</p>
                </div>
            </div>
        }>
            <EventTicketRedirectContent />
        </Suspense>
    );
}
