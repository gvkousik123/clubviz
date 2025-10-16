"use client";

import { useState, useEffect, useRef } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

    const handleVerifyOTP = async (otpCode?: string) => {
        if (!phoneNumber) return;

        const otpValue = otpCode || otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.verifyOTP({
                phone: phoneNumber,
                otp: otpValue,
                type: 'login'
            });

            if (response.data.verified && response.data.token) {
                // Store authentication tokens
                localStorage.setItem(STORAGE_KEYS.accessToken, response.data.token);
                const maybeRefresh = (response.data as Record<string, unknown>).refreshToken;
                if (typeof maybeRefresh === 'string' && maybeRefresh) {
                    localStorage.setItem(STORAGE_KEYS.refreshToken, maybeRefresh);
                }
                localStorage.removeItem(STORAGE_KEYS.pendingPhone);

                toast({
                    title: "Login successful",
                    description: "Welcome to ClubViz!",
                });

                router.push('/home');
            } else {
                throw new Error('OTP verification failed');
            }
        } catch (err: any) {
            console.error("OTP verification error:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
            setError(errorMessage);

            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!phoneNumber || !canResend) return;

        setIsLoading(true);
        setError(null);

        try {
            await AuthService.sendOTP({
                phone: phoneNumber,
                type: 'login'
            });

            toast({
                title: "OTP sent",
                description: "New verification code sent to your mobile",
            });

            // Reset timer
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']); // Clear current OTP

        } catch (err: any) {
            console.error("Resend OTP error:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.';
            setError(errorMessage);

            toast({
                title: "Failed to resend OTP",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
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

            {/* Content - Scrollable with hidden scrollbar */}
            <div className="relative z-10 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
                <div className="flex flex-col min-h-screen">
                    {/* Header with Back and Skip */}
                    <div className="flex items-center justify-between p-4 pt-8 flex-shrink-0">
                        <Link
                            href="/auth/mobile"
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

                    {/* Logo Area */}
                    <div className="flex flex-col items-center justify-center px-6 py-6 flex-shrink-0">
                        <ClubVizLogo size="md" variant="full" />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="px-6 pb-4 flex-shrink-0">
                        <div className="text-center text-sm text-white/70">
                            By login you are agreeing to
                            <br />
                            <AuthLink href="/terms">Terms & Condition</AuthLink> and <AuthLink href="/privacy">Privacy Policy</AuthLink>
                        </div>
                    </div>

                    {/* White Card Container */}
                    <div className="flex-1 min-h-0 pb-8">
                        <div className="bg-white rounded-t-3xl px-6 py-8 min-h-full">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">Enter Verification Code</h1>
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    We've sent a 6-digit code to<br />
                                    <span className="font-medium text-teal-600">+91 84567XXXXX</span>
                                </p>
                            </div>

                            {/* OTP Input Fields */}
                            <div className="mb-6">
                                <div className="flex justify-center gap-3 mb-4">
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
                                            className="w-12 h-12 text-center text-xl font-semibold border-2 border-teal-400 
                                                 rounded-2xl bg-gray-50 text-gray-900 
                                                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                                 transition-all duration-200"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center mb-6">
                                {!canResend ? (
                                    <p className="text-gray-600 text-sm">
                                        Resend code in <span className="font-medium text-teal-600">{timer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOTP}
                                        className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={() => handleVerifyOTP()}
                                disabled={!canSubmit}
                                className={`w-full py-4 px-6 rounded-2xl font-medium text-white 
                                     transition-all duration-200 
                                     ${canSubmit
                                        ? 'header-gradient hover:from-teal-600 hover:to-cyan-600 shadow-lg active:scale-[0.98]'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                style={{
                                    boxShadow: canSubmit ? '0 4px 20px rgba(20, 184, 166, 0.3)' : 'none',
                                }}
                            >
                                {canSubmit ? 'Verify & Login' : 'Enter Complete Code'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}