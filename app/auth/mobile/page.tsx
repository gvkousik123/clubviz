"use client";

import { useState } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MobileVerificationScreen() {
    const [phoneNumber, setPhoneNumber] = useState("+91 XXXXXXXXXX");

    const handleNumberPress = (num: string) => {
        if (phoneNumber.includes('X')) {
            setPhoneNumber(prev => prev.replace('X', num));
        }
    };

    const handleDelete = () => {
        const lastDigitIndex = phoneNumber.lastIndexOf(/[0-9]/.exec(phoneNumber.split('').reverse().join(''))?.[0] || '');
        if (lastDigitIndex > 6) { // Keep "+91 " format
            setPhoneNumber(prev => {
                const chars = prev.split('');
                for (let i = chars.length - 1; i >= 0; i--) {
                    if (/[0-9]/.test(chars[i]) && i > 6) {
                        chars[i] = 'X';
                        break;
                    }
                }
                return chars.join('');
            });
        }
    };

    const handleSubmit = () => {
        // Handle mobile number submission and navigate to OTP page
        console.log("Submitting phone number:", phoneNumber);
        // Navigate to OTP verification page
        window.location.href = '/auth/otp';
    };

    const canSubmit = !phoneNumber.includes('X');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-screen flex flex-col">
                {/* Header with Back and Skip */}
                <div className="flex items-center justify-between p-4 pt-12">
                    <Link
                        href="/auth/login"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/auth/login"
                        className="px-4 py-2 rounded-full border border-teal-400/30 text-sm text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Skip
                    </Link>
                </div>

                {/* Main Content - Logo Area */}
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    {/* Logo */}
                    <div className="mb-8">
                        <ClubVizLogo size="md" variant="full" />
                    </div>
                </div>

                {/* Terms and Conditions - Above white container */}
                <div className="px-6 mb-4">
                    <div className="text-center text-sm text-white/70">
                        By login you are agreeing to
                        <br />
                        <AuthLink href="/terms">Terms & Condition</AuthLink> and <AuthLink href="/privacy">Privacy Policy</AuthLink>
                    </div>
                </div>

                {/* White Card Container - Bottom half */}
                <div className="px-0 pb-0">
                    <div className="bg-white rounded-t-3xl px-6 py-6">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-xl font-semibold text-gray-900 mb-4 text-center">Enter your Mobile Number</h1>

                            <div className="w-full py-4 px-4 rounded-2xl border-2 border-teal-400 bg-gray-50 text-gray-900 text-lg font-mono text-center mb-3">
                                {phoneNumber}
                            </div>

                            <p className="text-sm text-gray-600 text-center">We will send you a confirmation code</p>
                        </div>

                        {/* Number Keypad */}
                        <div className="space-y-4">
                            {/* Keypad Grid */}
                            <div className="grid grid-cols-3 gap-4 justify-items-center">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberPress(num.toString())}
                                        className="w-16 h-16 rounded-full border-2 border-teal-400 
                                                 text-gray-900 text-xl font-medium
                                                 hover:bg-teal-50 active:bg-teal-100 
                                                 transition-colors duration-200"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            {/* Bottom Row */}
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <button
                                    onClick={handleDelete}
                                    className="w-16 h-16 rounded-full bg-gray-200 
                                             text-gray-600 text-xl font-medium
                                             hover:bg-gray-300 active:bg-gray-400 
                                             transition-colors duration-200"
                                >
                                    ×
                                </button>

                                <button
                                    onClick={() => handleNumberPress('0')}
                                    className="w-16 h-16 rounded-full border-2 border-teal-400 
                                             text-gray-900 text-xl font-medium
                                             hover:bg-teal-50 active:bg-teal-100 
                                             transition-colors duration-200"
                                >
                                    0
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className={`w-16 h-16 rounded-full text-white font-medium
                                             transition-all duration-200 
                                             ${canSubmit
                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg'
                                            : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowRight className="w-5 h-5 mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}