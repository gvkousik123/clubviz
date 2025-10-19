'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import BottomContinueButton from '@/components/common/bottom-continue-button';

export default function OtpPage() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [isResendActive, setIsResendActive] = useState(false);

    // Timer countdown effect
    useEffect(() => {
        if (timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        } else {
            setIsResendActive(true);
        }
    }, [timer]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = () => {
        // Verify OTP logic would go here
        router.push('/event/review-booking'); // Adjust navigation as needed
    };

    const handleResendOtp = () => {
        if (isResendActive) {
            // Logic to resend OTP would go here
            setTimer(60);
            setIsResendActive(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
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

            {/* OTP Input Section */}
            <div className="w-full absolute bottom-0 rounded-t-[60px] bg-gradient-to-b from-[#021313] to-black border-t border-[#0C898B] min-h-[50%] z-20 mt-8">
                <div className="px-6 pt-8 flex flex-col items-center">
                    {/* Phone Number Display */}
                    <div className="w-full flex items-center justify-center mb-6">
                        <div className="w-full max-w-[350px] bg-[#0D1F1F] rounded-[31px] border border-[#0C898B] flex items-center px-4 py-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.905 21.7335 20.6441 21.8227C20.3832 21.9119 20.1082 21.9451 19.8334 21.92C16.6451 21.5856 13.5797 20.5341 10.9091 18.85C8.43111 17.3147 6.33707 15.2206 4.80173 12.7426C3.11037 10.0571 2.05897 6.97298 1.73341 3.7686C1.70817 3.49473 1.74112 3.22072 1.82963 2.96061C1.91813 2.7005 2.0605 2.45909 2.24758 2.25369C2.43466 2.04829 2.66247 1.8843 2.91639 1.77215C3.1703 1.65999 3.44475 1.60227 3.72225 1.60193H6.72225C7.20239 1.5972 7.66595 1.7691 8.02992 2.08776C8.3939 2.40642 8.63414 2.84788 8.70173 3.3226C8.83799 4.32799 9.09521 5.31139 9.46893 6.2526C9.61061 6.59357 9.65438 6.96882 9.59592 7.33458C9.53746 7.70033 9.37922 8.03939 9.14173 8.3126L7.85333 9.6011C9.27419 12.1692 11.3357 14.2307 13.9037 15.6515L15.1921 14.3631C15.4653 14.1256 15.8043 13.9674 16.1701 13.9089C16.5358 13.8505 16.9111 13.8942 17.2521 14.0359C18.1933 14.4096 19.1766 14.6669 20.1821 14.8031C20.6629 14.8717 21.1087 15.1182 21.4262 15.4915C21.7438 15.8649 21.9085 16.3395 21.8921 16.8252" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[#6D6D6D] font-['Manrope'] font-semibold text-base ml-2">+91 9XXXX9XXXXX</span>
                            <div className="ml-auto">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#14FFEC" />
                                    <path d="M16.6666 9L10.5 15.1667L7.33331 12" stroke="#021313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* OTP Input */}
                    <div className="w-full max-w-[350px] bg-[#0D1F1F] rounded-[31px] border border-[#0C898B] flex items-center px-4 py-3 mb-8">
                        <MessageSquare size={24} className="text-[#14FFEC] mr-2" />
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter OTP"
                            className="bg-transparent text-[#6D6D6D] outline-none flex-1 font-['Manrope'] font-semibold"
                            maxLength={6}
                        />
                    </div>

                    {/* Timer and Resend */}
                    <div className="flex justify-between w-full max-w-[350px] mb-6 px-4">
                        <span className="text-white font-['Manrope'] text-sm">
                            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Didn\'t receive OTP?'}
                        </span>
                        <button
                            onClick={handleResendOtp}
                            className={`font-['Manrope'] text-sm ${isResendActive ? 'text-[#14FFEC] cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
                        >
                            Resend
                        </button>
                    </div>

                    {/* Verify OTP Button */}
                    <button
                        onClick={handleVerifyOtp}
                        className="bg-gradient-to-b from-[#007271] to-[#01807E] text-white font-['Manrope'] font-bold rounded-full px-8 w-[170px] h-11 flex items-center justify-center"
                    >
                        Verify OTP
                    </button>
                </div>

                {/* Next Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20">
                    <div className="absolute bottom-0 left-0 right-0">
                        <BottomContinueButton
                            text="Next"
                            onClick={handleVerifyOtp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
