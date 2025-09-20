'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Clock, MapPin, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DaboBookingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1); // 1: guest count, 2: date/time, 3: table selection
    const [guestCount, setGuestCount] = useState(4);
    const [selectedDate, setSelectedDate] = useState('04');
    const [selectedTime, setSelectedTime] = useState('18:30 PM');
    const [selectedOffer, setSelectedOffer] = useState('20% off on the total bill');

    const dates = [
        { day: 'SUN', date: '01' },
        { day: 'MON', date: '02' },
        { day: 'TUE', date: '03' },
        { day: 'TODAY', date: '04', isToday: true },
        { day: 'THU', date: '05' },
        { day: 'FRI', date: '06' },
        { day: 'SAT', date: '07' }
    ];

    const timeSlots = [
        { time: '18:00 PM', available: true },
        { time: '18:30 PM', available: true },
        { time: '19:00 PM', available: true },
        { time: '19:30 PM', available: false },
        { time: '20:00 PM', available: true },
        { time: '20:30 PM', available: true },
        { time: '21:00 PM', available: false },
        { time: '21:30 PM', available: true }
    ];

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleContinue = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push('/clubs/dabo/booking/table-selection');
        }
    };

    const renderGuestSelection = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Select Guests</h2>
                <p className="text-white/70">How many people will be joining?</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-center space-x-8">
                    <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <Minus className="w-8 h-8 text-white" />
                    </button>

                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                            <Users className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-6xl font-bold text-white mb-2">{guestCount}</div>
                        <p className="text-white/70">Guest{guestCount !== 1 ? 's' : ''}</p>
                    </div>

                    <button
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <Plus className="w-8 h-8 text-white" />
                    </button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-semibold">DABO</h4>
                        <p className="text-white/70 text-sm">Raj nagar, Shantigram</p>
                    </div>
                </div>
                <p className="text-white/60 text-sm">Entry Fee: ₹1500 per person</p>
            </div>
        </div>
    );

    const renderDateTimeSelection = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Select Date & Time</h2>
                <p className="text-white/70">Choose your preferred date and time</p>
            </div>

            {/* Date Selection */}
            <div>
                <h3 className="text-white text-xl font-semibold mb-4">Date</h3>
                <div className="flex space-x-3 pb-2">
                    {dates.map((date) => (
                        <button
                            key={date.date}
                            onClick={() => setSelectedDate(date.date)}
                            className={`min-w-[80px] py-4 px-4 rounded-2xl text-center transition-all duration-300 ${selectedDate === date.date
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20'
                                }`}
                        >
                            <div className="text-sm font-medium">{date.day}</div>
                            <div className="text-2xl font-bold">{date.date}</div>
                            {date.isToday && (
                                <div className="text-xs text-purple-300 mt-1">Today</div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            <div>
                <h3 className="text-white text-xl font-semibold mb-4">Time</h3>
                <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${selectedTime === slot.time
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : slot.available
                                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                                    : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{slot.time}</span>
                            </div>
                            {!slot.available && (
                                <div className="text-xs text-red-400 mt-1">Unavailable</div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Special Offers */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-3">🎉 Special Offers Available</h4>
                <div className="space-y-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-white text-sm font-medium">20% off on total bill</p>
                        <p className="text-purple-300 text-xs">Valid for 19:00 PM slot</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-white text-sm font-medium">Complimentary welcome drinks</p>
                        <p className="text-purple-300 text-xs">For groups of 6 or more</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConfirmation = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Booking Summary</h2>
                <p className="text-white/70">Review your booking details</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <img
                        src="/red-neon-lounge-interior.jpg"
                        alt="DABO"
                        className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div>
                        <h3 className="text-white text-xl font-bold">DABO</h3>
                        <p className="text-white/70">Raj nagar, Shantigram</p>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <span>★</span>
                            <span>4.2 (1,250 reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            <span className="text-white/70 text-sm">Guests</span>
                        </div>
                        <p className="text-white font-bold text-lg">{guestCount} people</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <span className="text-white/70 text-sm">Date</span>
                        </div>
                        <p className="text-white font-bold text-lg">Dec {selectedDate}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <span className="text-white/70 text-sm">Time</span>
                        </div>
                        <p className="text-white font-bold text-lg">{selectedTime}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-purple-400 text-sm">💰</span>
                            <span className="text-white/70 text-sm">Total</span>
                        </div>
                        <p className="text-white font-bold text-lg">₹{guestCount * 1500}</p>
                    </div>
                </div>

                {selectedOffer && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4">
                        <p className="text-green-400 font-medium">🎉 Offer Applied: {selectedOffer}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
                <button
                    onClick={handleBack}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Book Table</h1>
                    <p className="text-white/60 text-sm">Step {currentStep} of 3</p>
                </div>

                <div className="w-12"></div>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 mb-8">
                <div className="flex items-center">
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step <= currentStep
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 text-white/60'
                                }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`flex-1 h-1 mx-3 rounded transition-all ${step < currentStep
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'bg-white/20'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-24">
                {currentStep === 1 && renderGuestSelection()}
                {currentStep === 2 && renderDateTimeSelection()}
                {currentStep === 3 && renderConfirmation()}
            </div>

            {/* Bottom Action Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-6">
                <button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                    {currentStep === 3 ? 'Select Table' : 'Continue'}
                </button>
            </div>
        </div>
    );
}