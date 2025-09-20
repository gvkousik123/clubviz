'use client';

import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function VerifyScreen() {
    const [phoneNumber, setPhoneNumber] = useState('+91 84567XXXXX');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleBack = () => {
        window.location.href = '/auth/login';
    };

    const handleSkip = () => {
        window.location.href = '/home';
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        if (otp.join('').length === 6) {
            window.location.href = '/home';
        }
    };

    const handleResendOtp = () => {
        // Reset OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const isOtpComplete = otp.join('').length === 6;

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <button
                    onClick={handleBack}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                    Skip
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Verify your number
                    </h1>
                    <p className="text-white/70 text-lg mb-2">
                        We have sent a verification code to
                    </p>
                    <p className="text-white font-semibold text-lg">
                        {phoneNumber}
                    </p>
                </div>

                {/* OTP Input */}
                <div className="max-w-sm mx-auto w-full mb-12">
                    <div className="flex justify-center space-x-4 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl font-bold bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isOtpComplete}
                        className={`w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${isOtpComplete
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                                : 'bg-white/10 text-white/50 cursor-not-allowed'
                            }`}
                    >
                        Verify
                    </button>
                </div>

                {/* Resend Section */}
                <div className="text-center">
                    <p className="text-white/70 mb-4">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResendOtp}
                        className="text-purple-400 hover:text-purple-300 transition-colors font-medium underline"
                    >
                        Resend OTP
                    </button>
                </div>

                {/* Timer */}
                <div className="text-center mt-8">
                    <p className="text-white/50 text-sm">
                        Resend code in 00:30
                    </p>
                </div>
            </div>
        </div>
    );
}