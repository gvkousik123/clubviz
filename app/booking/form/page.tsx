'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Edit, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function BookingFormPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: '+91 9XXXX9XXXXX',
        name: 'David Simon',
        email: 'DavidSimon@test.com',
        gender: 'Male'
    });

    const handleGoBack = () => {
        router.push('/home');
    };

    const handleNext = () => {
        router.push('/booking/final-review');
    };

    const handleGenderSelect = (gender: string) => {
        setFormData({ ...formData, gender });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Event Poster */}
            <div className="absolute inset-0">
                <div className="relative h-full w-full">
                    {/* Poster background with dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
                    <div className="absolute inset-0 bg-[url('/night-party-event-poster-with-purple-and-pink-neon.jpg')] bg-cover bg-center opacity-30"></div>

                    {/* Content overlay for poster effect */}
                    <div className="absolute inset-0">
                        <div className="h-full w-full relative">
                            {/* Club monarch branding at top */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="text-white text-xs font-bold tracking-[0.2em] opacity-80">
                                    CLUB MONARCH PRESENT
                                </div>
                            </div>

                            {/* Main event graphics */}
                            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="text-center">
                                    {/* Large stylized text effect */}
                                    <div className="text-6xl font-black text-white mb-2" style={{
                                        textShadow: '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.3)',
                                        fontFamily: 'Impact, Arial Black, sans-serif'
                                    }}>
                                        HIP
                                    </div>
                                    <div className="text-4xl font-bold text-teal-400 tracking-wider">
                                        CHART
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-start p-6 pt-12">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
            </div>

            {/* Event Title Overlay */}
            <div className="relative z-20 px-6 mt-8">
                <div className="bg-teal-600/90 backdrop-blur-md rounded-2xl p-6 border border-teal-400/30">
                    <h1 className="text-2xl font-bold text-white text-center mb-4">
                        TIMELESS TUESDAYS FT. DJ XPENSIVE
                    </h1>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-white">
                            <MapPin size={18} className="text-teal-300" />
                            <span className="text-sm">Dabo club & kitchen, Nagpur</span>
                        </div>

                        <div className="flex items-center gap-3 text-white">
                            <Calendar size={18} className="text-teal-300" />
                            <span className="text-sm">24 Dec | 7:00 pm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="relative z-20 px-6 mt-8 pb-32">
                <div className="space-y-6">
                    {/* Phone Number Field */}
                    <div className="relative">
                        <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                            <Phone size={20} className="text-teal-400 mr-3" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                placeholder="Phone Number"
                            />
                            <button className="text-teal-400 font-medium text-sm">
                                <Edit size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="relative">
                        <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                            <User size={20} className="text-teal-400 mr-3" />
                            <span className="text-teal-400 text-sm mr-3">Name :</span>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                        <div className="flex items-center bg-black/40 backdrop-blur-md border border-teal-400/40 rounded-2xl p-4">
                            <Mail size={20} className="text-teal-400 mr-3" />
                            <span className="text-teal-400 text-sm mr-3">Email :</span>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-center text-lg tracking-wider">
                            GENDER
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {['Male', 'Female', 'Other'].map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => handleGenderSelect(gender)}
                                    className={`py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${formData.gender === gender
                                        ? 'bg-teal-400 text-black'
                                        : 'bg-black/40 backdrop-blur-md border border-teal-400/40 text-teal-400 hover:bg-teal-400/10'
                                        }`}
                                >
                                    {gender === 'Male' && <span className="mr-2">♂</span>}
                                    {gender === 'Female' && <span className="mr-2">♀</span>}
                                    {gender === 'Other' && <span className="mr-2">⚬</span>}
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Next Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
                <button
                    onClick={handleNext}
                    className="w-full header-gradient text-white font-bold py-4 px-6 rounded-2xl 
                   shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 
                   transform hover:scale-[1.02] transition-all duration-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}