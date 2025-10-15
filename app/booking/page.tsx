import { Suspense } from 'react';
import BookingPageContent from './_components/booking-page-content';

function BookingPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            <div className="flex h-full items-center justify-center px-6 py-24">
                <div className="space-y-4 text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-teal-400" />
                    <p className="text-sm font-medium text-white/70">Preparing your booking experience…</p>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<BookingPageSkeleton />}>
            <BookingPageContent />
        </Suspense>
    );
}