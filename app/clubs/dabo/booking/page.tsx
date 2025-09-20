'use client';

import React, { useState } from 'react';
import { ChevronLeft, Plus, Minus, Clock, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DaboBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 1: guest count, 2: date/time, 3: table selection
  const [guestCount, setGuestCount] = useState(4);
  const [selectedDate, setSelectedDate] = useState('04');
  const [selectedTime, setSelectedTime] = useState('18:30 PM');
  const [selectedOffer, setSelectedOffer] = useState('20% off on the total bill 19:00 PM');

  const dates = [
    { day: 'SUN', date: '01' },
    { day: 'MON', date: '02' },
    { day: 'TUE', date: '03' },
    { day: 'TODAY', date: '04', isToday: true },
    { day: 'THUR', date: '05' },
    { day: 'FRI', date: '06' },
    { day: 'SAT', date: '07' }
  ];

  const timeSlots = [
    { time: '18:00 PM', offers: 1 },
    { time: '18:30 PM', offers: 1 },
    { time: '19:00 PM', offers: 1 },
    { time: '19:30 PM', offers: 1 },
    { time: '20:00 PM', offers: 1 },
    { time: '20:30 PM', offers: 1 },
    { time: '21:00 PM', offers: 1 },
    { time: '21:30 PM', offers: 1 }
  ];

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to table selection
      router.push('/clubs/dabo/booking/table-selection');
    }
  };

  const renderGuestSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg mb-4">Guest</h3>
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center"
          >
            <Minus className="w-6 h-6 text-white" />
          </button>
          <span className="text-white text-2xl font-bold">{guestCount}</span>
          <button
            onClick={() => setGuestCount(guestCount + 1)}
            className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg mb-4">Select Date</h3>
        <div className="flex space-x-3 overflow-x-scroll scrollbar-hide pb-2">
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => setSelectedDate(date.date)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                selectedDate === date.date
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <span className="text-xs text-white/80 mb-1">{date.day}</span>
              <span className="text-lg font-bold text-white">{date.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg mb-4">Select Time</h3>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => setSelectedTime(slot.time)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedTime === slot.time
                  ? 'border-teal-400 bg-teal-400/20'
                  : 'border-white/20 bg-white/10'
              }`}
            >
              <div className="text-white font-medium">{slot.time}</div>
              <div className="text-teal-400 text-sm">{slot.offers} Offer</div>
            </button>
          ))}
        </div>
        
        <button className="w-full mt-4 py-3 text-teal-400 text-center border border-teal-400/30 rounded-xl">
          View all slots ⌄
        </button>
      </div>

      {selectedTime && (
        <div className="bg-white/10 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2">Booking offers for {selectedTime}</h4>
          <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-2 border-teal-400"></div>
              <span className="text-white">20% off on the total bill 19:00 PM</span>
            </div>
            <div className="text-teal-400 text-sm mt-1">20% off on the total bill 19:00 PM</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-6">
        <div className="flex items-center mb-4">
          <button onClick={() => router.back()} className="mr-4">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">DABO CLUB & KITCHEN</h1>
        </div>
        
        {currentStep >= 2 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">Dabo club & kitchen, Nagpur</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm">24 Dec | 7:00 pm</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {currentStep === 1 && renderGuestSelection()}
        {currentStep === 2 && renderDateTimeSelection()}
      </div>

      {/* Continue Button */}
      <div className="p-4">
        <button
          onClick={handleContinue}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-semibold text-lg transition-colors"
        >
          {currentStep === 1 ? 'Select Table' : currentStep === 2 ? 'Continue' : 'Reserve Table'}
        </button>
      </div>
    </div>
  );
}