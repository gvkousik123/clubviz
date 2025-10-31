"use client";

import { useState, useEffect, useRef } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function OTPVerificationScreen() {
    const router = useRouter();
    const { toast } = useToast();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Get phone number from localStorage
        const savedPhone = localStorage.getItem(STORAGE_KEYS.pendingPhone);
        if (!savedPhone) {
            router.push('/auth/mobile');
            return;
        }
        setPhoneNumber(savedPhone);

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }

            // Auto-submit when all digits are entered
            if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
                handleVerifyOTP(newOtp.join(''));
            }
        }
    };

    const handleBackspace = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = (otpCode?: string) => {
        if (!phoneNumber) return;

        const otpValue = otpCode || otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Store dummy authentication tokens
        localStorage.setItem(STORAGE_KEYS.accessToken, 'dummy-auth-token-' + Date.now());
        localStorage.setItem(STORAGE_KEYS.refreshToken, 'dummy-refresh-token-' + Date.now());
        localStorage.removeItem(STORAGE_KEYS.pendingPhone);

        // Show success toast
        toast({
            title: "Login successful",
            description: "Welcome to ClubViz!",
        });

        // Navigate to user details page after a short delay
        setTimeout(() => {
            router.push('/auth/details');
            setIsLoading(false);
        }, 800);
    };

    const handleResendOTP = () => {
        if (!phoneNumber || !canResend) return;

        setIsLoading(true);
        setError(null);

        // Show toast for dummy OTP sent
        toast({
            title: "OTP sent",
            description: "New verification code sent to your mobile",
        });

        // Reset timer
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear current OTP

        // Finish loading after a short delay
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const canSubmit = otp.every(digit => digit !== '') && !isLoading;

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
                        href="/auth/mobile"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/auth/details"
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
                        <div className="mb-8">
                            <h1 className="text-[24px] font-semibold text-[#2C1945] mb-5 text-center">Verification Code</h1>
                            <div className="text-center mb-2">
                                <span className="text-[#2C1945] font-bold">Enter verification code. </span>
                                <button
                                    onClick={handleResendOTP}
                                    disabled={!canResend}
                                    className="text-[#417CFD] font-bold"
                                >
                                    Resend Code
                                </button>
                            </div>
                            {phoneNumber && (
                                <div className="text-center">
                                    <p className="text-sm text-[#6A6A6A]">Code sent to</p>
                                    <p className="text-[#0D7377] font-semibold">+{phoneNumber?.slice(0, 2)} {phoneNumber?.slice(2)}</p>
                                </div>
                            )}
                        </div>

                        {/* OTP Input Display */}
                        <div className="flex justify-center gap-3 mb-6">
                            {otp.map((digit, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 flex items-center justify-center rounded-[12px] 
                                        ${digit ? 'bg-[#EFEFEF] border border-[#0C898B]' : 'bg-[#F7F7F7] border border-[#E0E0E0]'}`}
                                >
                                    <span className="text-xl font-bold text-[#2C1945]">
                                        {digit || ''}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-center mb-4">
                            {!canResend && (
                                <p className="text-[#6A6A6A] font-bold text-[15px]">
                                    Resend code in : {timer} sec
                                </p>
                            )}
                        </div>

                        {/* Number Keypad */}
                        <div className="mx-auto w-[280px] space-y-4 mb-6">
                            {/* Keypad Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            const emptyIndex = otp.findIndex(digit => digit === '');
                                            if (emptyIndex !== -1) {
                                                handleOtpChange(emptyIndex, num.toString());
                                            }
                                        }}
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
                                    onClick={() => {
                                        const lastFilledIndex = [...otp].reverse().findIndex(digit => digit !== '');
                                        if (lastFilledIndex !== -1) {
                                            const index = otp.length - 1 - lastFilledIndex;
                                            handleOtpChange(index, '');
                                            inputRefs.current[index]?.focus();
                                        }
                                    }}
                                    className="w-[70px] h-[70px] rounded-full bg-[#EFEFEF] 
                                        text-gray-900 flex items-center justify-center"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => {
                                        const emptyIndex = otp.findIndex(digit => digit === '');
                                        if (emptyIndex !== -1) {
                                            handleOtpChange(emptyIndex, '0');
                                        }
                                    }}
                                    className="w-[70px] h-[70px] rounded-full border border-[#0C898B] 
                                        bg-white text-[#42353B] text-3xl font-semibold
                                        hover:bg-gray-50 active:bg-gray-100
                                        flex items-center justify-center"
                                >
                                    0
                                </button>

                                <button
                                    onClick={() => handleVerifyOTP()}
                                    disabled={!canSubmit}
                                    className="w-[70px] h-[70px] rounded-full bg-[#0D7377] 
                                        text-white flex items-center justify-center"
                                >
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Display OTP input fields (hidden) */}
                        <div className="hidden">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleBackspace(index, e)}
                                />
                            ))}
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