'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Edit } from 'lucide-react';

export default function BookingReviewPage() {
    const router = useRouter();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const handleEdit = (section: string) => {
        switch (section) {
            case 'table':
                router.push('/booking/table-selection');
                break;
            case 'date':
                router.push('/booking');
                break;
            default:
                router.push('/booking');
        }
    };

    const handleConfirmBooking = async () => {
        setIsConfirming(true);
        // Simulate booking process
        setTimeout(() => {
            setIsConfirming(false);
            router.push('/booking/success');
        }, 2000);
    };

    const bookingDetails = {
        venue: 'DABO CLUB & KITCHEN',
        date: 'Thursday, December 04, 2025',
        time: '6:30 PM',
        guests: 4,
        table: 'T3',
        tableLocation: 'Center stage view',
        minimumOrder: 2500,
        offers: ['20% off on total bill', 'Complimentary appetizer']
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        REVIEW BOOKING
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Venue Info */}
                <div className="bg-[#222831] rounded-2xl p-4">
                    <h2 className="text-white font-bold text-xl mb-2">{bookingDetails.venue}</h2>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-teal-400" />
                        <p className="text-white/70 text-sm">6, New Manish Nagar, Somalwada, Nagpur</p>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium text-lg">Booking Summary</h3>

                    {/* Date & Time */}
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} className="text-teal-400" />
                                <div>
                                    <p className="text-white font-medium">Date & Time</p>
                                    <p className="text-white/70 text-sm">{bookingDetails.date}</p>
                                    <p className="text-white/70 text-sm">{bookingDetails.time}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEdit('date')}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <Edit size={16} className="text-teal-400" />
                            </button>
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-teal-400" />
                                <div>
                                    <p className="text-white font-medium">Guests</p>
                                    <p className="text-white/70 text-sm">{bookingDetails.guests} people</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEdit('date')}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <Edit size={16} className="text-teal-400" />
                            </button>
                        </div>
                    </div>

                    {/* Table Selection */}
                    <div className="bg-[#222831] rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-teal-600 rounded border-2 border-teal-400 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">T</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Table {bookingDetails.table}</p>
                                    <p className="text-white/70 text-sm">{bookingDetails.tableLocation}</p>
                                    <p className="text-teal-400 text-sm">₹{bookingDetails.minimumOrder.toLocaleString()} minimum order</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEdit('table')}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <Edit size={16} className="text-teal-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offers Applied */}
                <div className="space-y-3">
                    <h3 className="text-white font-medium text-lg">Offers Applied</h3>
                    {bookingDetails.offers.map((offer, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-400/30 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                                <p className="text-white font-medium">{offer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cancellation Policy */}
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-4">
                    <h4 className="text-orange-400 font-medium mb-2">Cancellation Policy</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                        <li>• Free cancellation up to 2 hours before booking time</li>
                        <li>• 50% refund if cancelled within 2 hours</li>
                        <li>• No refund for no-shows</li>
                    </ul>
                </div>

                {/* Terms */}
                <div className="bg-[#1a1a24] rounded-2xl p-4">
                    <h4 className="text-white font-medium mb-2">Terms & Conditions</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                        <li>• Minimum order amount must be met during your visit</li>
                        <li>• Table reservation is valid for 3 hours</li>
                        <li>• ID verification required at entry</li>
                        <li>• Management reserves the right to admission</li>
                    </ul>
                </div>

                {/* Confirm Button */}
                <div className="pt-4">
                    <button
                        onClick={handleConfirmBooking}
                        disabled={isConfirming}
                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300"
                    >
                        {isConfirming ? 'Confirming Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
}