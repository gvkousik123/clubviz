'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, Phone } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';

export default function MobilePage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleSendOTP = () => {
        // Handle OTP logic here
        router.push('/event/otp'); // Adjust this route as needed
    };

    const handleNext = () => {
        router.push('/event/otp'); // Adjust this route as needed
    };

    return (
        <div className="min-h-screen w-full relative">
            {/* Hero Section with Event Image */}
            <div className="relative h-[320px] w-full">
                <img
                    src="/event list/Rectangle 1.jpg"
                    alt="Event Banner"
                    className="w-full h-full object-cover brightness-90"
                />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#005D5C]/60 backdrop-blur-sm rounded-full hover:bg-[#005D5C]/80 transition-all duration-300"
                    >
                        <ChevronLeft size={20} className="text-[#14FFEC]" />
                    </button>
                </div>


            </div>

            {/* Event Info Card */}
            <div className="w-full bg-gradient-to-b from-[#0D696D] to-[#000000] rounded-t-[40px] -mt-20 relative z-10 pt-4 pb-8">
                <h1 className="text-center text-white text-2xl font-['Anton'] tracking-[2.4px] leading-8">
                    Timeless Tuesdays Ft. DJ Xpensive
                </h1>

                {/* Separator Line */}
                <div className="flex justify-center my-4">
                    <div className="w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#71F8FF] to-transparent opacity-80"></div>
                </div>

                {/* Event Details */}
                <div className="px-9 flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-3">
                        <svg className="text-[#14FFEC]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white font-['Manrope'] font-bold">Dabo club & kitchen, Nagpur</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <svg className="text-[#14FFEC]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 2V5" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 8H21" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="bg-white/10 px-6 py-2 rounded-full">
                            <p className="text-white font-['Manrope'] font-bold">24 Dec | 7:00 pm</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6"></div>
            </div>

            {/* Mobile Input Section */}
            <div className="w-full absolute bottom-0 rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] min-h-[50%] z-20 mt-8">
                <div className="px-6 pt-8 flex flex-col items-center">
                    <h2 className="text-white text-center text-base font-['Anton'] font-normal tracking-wide mb-8">
                        # TICKET BOOKING AREA
                    </h2>

                    {/* Country Code */}
                    <div className="w-full flex justify-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="text-white font-['Manrope'] font-semibold text-base">
                                Your Country Code
                            </div>
                            <div className="flex items-center bg-[#0D1F1F] rounded-[15px] border border-[#0C898B] px-3 py-2">
                                <span className="text-white font-['Manrope'] font-semibold text-base mr-2">+91</span>
                                <ChevronDown size={18} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Phone Input */}
                    <div className="w-full max-w-[375px] bg-[#0D1F1F] rounded-[31px] border border-[#0C898B] flex items-center px-4 py-3 mb-8">
                        <Phone size={24} className="text-[#14FFEC] mr-2" />
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="+91 9XXXX9XXXXX"
                            className="bg-transparent text-[#6D6D6D] outline-none flex-1 font-['Manrope'] font-semibold"
                        />
                    </div>

                    {/* Send OTP Button */}
                    <button
                        onClick={handleSendOTP}
                        className="bg-gradient-to-b from-[#007271] to-[#01807E] text-white font-['Manrope'] font-bold rounded-full px-8 min-w-[143px] h-11 flex items-center justify-center"
                    >
                        Send OTP
                    </button>
                </div>

                {/* Next Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20">
                    <div className="absolute bottom-0 left-0 right-0">
                        <BottomContinueButton
                            text="Next"
                            onClick={handleNext}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
