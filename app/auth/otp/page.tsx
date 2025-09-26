"use client";

import { useState, useEffect, useRef } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OTPVerificationScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
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
    }, []);

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

    const handleBackspace = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            // Handle OTP verification logic
            console.log("Verifying OTP:", otpValue);
            // Navigate to home page on success
            router.push('/home');
        }
    };

    const handleResendOTP = () => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            // Logic to resend OTP
            console.log("Resending OTP");
        }
    };

    const canSubmit = otp.every(digit => digit !== '');

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
                    <div className="bg-white rounded-t-3xl px-6 py-6 min-h-[45vh]">
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
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full py-4 px-6 rounded-2xl font-medium text-white 
                                     transition-all duration-200 
                                     ${canSubmit
                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg active:scale-[0.98]'
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
    );
}