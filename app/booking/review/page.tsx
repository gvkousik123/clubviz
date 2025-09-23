'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Hash, Building, MessageSquare, Gift } from 'lucide-react';

export default function ReviewEventBookingPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleGetDirection = () => {
        // Open maps with venue location
        const venue = "6, New Manish Nagar, Somalwada, Nagpur";
        const encodedVenue = encodeURIComponent(venue);
        window.open(`https://maps.google.com/?q=${encodedVenue}`, '_blank');
    };

    const handleConfirmBooking = () => {
        router.push('/booking/form');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-800 via-dark-900 to-black text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                <div className="flex items-center justify-between p-6 pt-12">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        REVIEW EVENT BOOKING
                    </h1>
                </div>

                {/* Instructions */}
                <div className="px-6 mt-4">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <p className="text-white text-sm text-center leading-relaxed">
                            Please arrive at the venue at least 10 minutes prior to your scheduled booking to ensure a smooth and hassle free experience
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Club Details Card */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {/* Club Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-teal-400/30">
                            <span className="text-white font-bold text-lg">D+</span>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-white font-bold text-lg mb-1">Dabo club & Kitchen</h2>

                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                                <span className="text-white font-medium">24 Dec | 7:00 pm</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-teal-400" />
                                <span className="text-gray-300 text-sm">6, New Manish Nagar, Somalwada, Nagpur</span>
                            </div>
                        </div>
                    </div>

                    {/* Get Direction Button */}
                    <button
                        onClick={handleGetDirection}
                        className="flex items-center gap-2 bg-teal-600/20 border border-teal-400/40 text-teal-400 font-medium py-2 px-4 rounded-full text-sm hover:bg-teal-600/30 transition-all duration-300"
                    >
                        <MapPin size={16} />
                        Get direction
                    </button>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                    {/* Booking Date */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Booking date</span>
                        <span className="text-white font-medium">04 Apr | 4:00 pm</span>
                    </div>

                    {/* Number of Guests */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Number of Guest(s)</span>
                        <span className="text-white font-medium">2 Guests</span>
                    </div>

                    {/* Table Number */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Table Number</span>
                        <span className="text-white font-medium">TG-03</span>
                    </div>

                    {/* Floor Number */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Floor Number</span>
                        <span className="text-white font-medium">Ground Floor</span>
                    </div>

                    {/* Notes */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Notes</span>
                        <span className="text-white font-medium">Birthday</span>
                    </div>

                    {/* Benefits */}
                    <div className="py-3">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-teal-400 text-sm font-medium">Benefits</span>
                            <span className="text-teal-400 font-bold">Flat 30% OFF</span>
                        </div>
                        <p className="text-gray-400 text-xs">Pay your bill between 7:00 PM to 11 PM</p>
                    </div>
                </div>
            </div>

            {/* Bottom Confirm Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                <button
                    onClick={handleConfirmBooking}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl 
                   shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                   transform hover:scale-[1.02] transition-all duration-300"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}