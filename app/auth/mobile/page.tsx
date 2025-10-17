"use client";

import { useState } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AuthService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function MobileVerificationScreen() {
    const router = useRouter();
    const { toast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState("+91 XXXXXXXXXX");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        console.log("=== Mobile Login: handleSubmit called ===");
        console.log("Current phone number:", phoneNumber);

        setIsLoading(true);

        // Clean phone number (remove formatting and keep only digits)
        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

        if (cleanPhone.length !== 12) { // Should be 12 digits (91 + 10 digits)
            setError('Please enter a valid 10-digit mobile number');
            setIsLoading(false);
            return;
        }

        // Store phone number for OTP verification (using dummy data)
        localStorage.setItem(STORAGE_KEYS.pendingPhone, cleanPhone);

        // Show success toast
        toast({
            title: "OTP sent successfully",
            description: "Please check your mobile for the verification code",
        });

        // Navigate to OTP verification page after a short delay
        setTimeout(() => {
            router.push('/auth/otp');
            setIsLoading(false);
        }, 800);
    };

    const canSubmit = !phoneNumber.includes('X') && !isLoading;

    return (
        <div className="min-h-screen bg-[#031313] relative">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header with Back and Skip */}
                <div className="flex items-center justify-between p-4 pt-6 flex-shrink-0">
                    <Link
                        href="/auth/login"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/auth/login"
                        className="px-4 py-1.5 rounded-full border border-teal-400/30 text-sm text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Skip
                    </Link>
                </div>

                {/* White Card Container - Sticks to bottom and takes remaining space */}
                <div className="flex-1 flex flex-col">
                    {/* Logo Area - Now positioned just above the form with increased spacing */}
                    <div className="flex-1 flex flex-col items-center justify-end px-6 pb-8">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>

                    <div className="bg-white rounded-t-3xl w-full px-6 pt-8 pb-8 overflow-y-auto flex flex-col">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-[24px] font-semibold text-[#2C1945] mb-5 text-center">Enter your Mobile Number</h1>
                        </div>

                        {/* Phone number display */}
                        <div className="mb-3 text-center">
                            <div className="w-full max-w-[380px] h-[76px] mx-auto bg-[#EFEFEF] rounded-[52px] border border-[#0C898B] flex items-center justify-center">
                                <div className="text-[22px] font-medium text-[#666666] text-center">
                                    {phoneNumber}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation text */}
                        <div className="mb-8 text-center">
                            <p className="text-[#2C1945] text-[15px] font-medium">We will send you a confirmation code</p>
                        </div>

                        {/* Number Keypad */}
                        <div className="mx-auto w-[280px] space-y-4 mb-6">
                            {/* Keypad Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberPress(num.toString())}
                                        className="w-[70px] h-[70px] rounded-full border border-[#0C898B] 
                                             bg-white text-[#42353B] text-3xl font-semibold
                                             hover:bg-gray-50 active:bg-gray-100 
                                             flex items-center justify-center"
                                    >
                                        {num}
                                    </button>
                                ))}

                                {/* Bottom Row */}
                                <button
                                    onClick={handleDelete}
                                    className="w-[70px] h-[70px] rounded-full bg-[#EFEFEF] 
                                        text-gray-900 flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleNumberPress('0')}
                                    className="w-[70px] h-[70px] rounded-full border border-[#0C898B] 
                                        bg-white text-[#42353B] text-3xl font-semibold
                                        hover:bg-gray-50 active:bg-gray-100
                                        flex items-center justify-center"
                                >
                                    0
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className="w-[70px] h-[70px] rounded-full bg-[#0D7377] 
                                        text-white flex items-center justify-center"
                                >
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Display the phone number status somewhere */}
                        <div className="hidden">
                            Current number: {phoneNumber}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="mt-auto pt-4">
                            <div className="text-center">
                                <p className="text-black font-semibold text-[14px]">
                                    By login you are agreeing to
                                </p>
                                <p className="text-[14px] font-semibold mt-1">
                                    <AuthLink href="/terms" className="text-[#0095FF] font-semibold underline">Terms & Condition</AuthLink>
                                    <span className="text-black"> and </span>
                                    <AuthLink href="/privacy" className="text-[#0095FF] font-semibold underline">Privacy Policy</AuthLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}