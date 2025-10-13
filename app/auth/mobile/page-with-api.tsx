"use client";

import { useState } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { AuthService } from "@/lib/services";
import { toast } from "@/hooks/use-toast";

export default function MobileVerificationScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("+91 XXXXXXXXXX");
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async () => {
        if (!canSubmit || loading) return;

        setLoading(true);
        setError(null);

        try {
            // Format phone number for API call
            const formattedPhone = phoneNumber.replace(/\s/g, '');

            // Check if phone number exists in the system
            const phoneCheckResult = await AuthService.checkPhoneExists(formattedPhone);

            if (phoneCheckResult.success) {
                const phoneExists = phoneCheckResult.data.exists;

                // Send OTP for login or registration
                const otpResult = await AuthService.sendOTP({
                    phone: formattedPhone,
                    type: phoneExists ? 'login' : 'register'
                });

                if (otpResult.success) {
                    // Store phone number and user type in session/local storage for OTP page
                    sessionStorage.setItem('auth_phone', formattedPhone);
                    sessionStorage.setItem('auth_type', phoneExists ? 'login' : 'register');

                    toast({
                        title: "OTP Sent",
                        description: `OTP sent to ${phoneNumber}`,
                    });

                    // Navigate to OTP verification page
                    router.push(`/auth/otp?phone=${encodeURIComponent(formattedPhone)}&type=${phoneExists ? 'login' : 'register'}`);
                } else {
                    setError(otpResult.message || 'Failed to send OTP');
                    toast({
                        title: "Error",
                        description: otpResult.message || 'Failed to send OTP',
                        variant: "destructive",
                    });
                }
            } else {
                setError('Failed to verify phone number');
                toast({
                    title: "Error",
                    description: 'Failed to verify phone number',
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            console.error('Error sending OTP:', err);
            const errorMessage = err.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = !phoneNumber.includes('X') && !loading;

    return (
        <div className="h-screen bg-[#031313] relative">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-6">
                <Link href="/auth/login" className="p-2">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ClubVizLogo size="sm" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 flex-1 flex flex-col justify-between pb-8">
                <div>
                    <div className="text-center mb-12">
                        <h1 className="text-white text-2xl font-bold mb-2">
                            Enter Your Mobile Number
                        </h1>
                        <p className="text-white/70 text-base">
                            We'll send you an OTP to verify your number
                        </p>
                    </div>

                    {/* Phone Number Display */}
                    <div className="mb-12">
                        <div className="bg-[#1a1a1a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <label className="text-white/60 text-sm mb-2 block">
                                Mobile Number
                            </label>
                            <div className="text-white text-2xl font-mono tracking-wider">
                                {phoneNumber}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Number Pad */}
                    <div className="mb-8">
                        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleNumberPress(num.toString())}
                                    disabled={loading}
                                    className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50"
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => handleNumberPress('0')}
                                disabled={loading}
                                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xl font-medium transition-all duration-200 active:scale-95 col-start-2 disabled:opacity-50"
                            >
                                0
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xl font-medium transition-all duration-200 active:scale-95 col-start-3 disabled:opacity-50"
                            >
                                ⌫
                            </button>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="space-y-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending OTP...
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <AuthLink href="/auth/login" className="text-white/60">
                            Back to login options
                        </AuthLink>
                    </div>
                </div>
            </div>
        </div>
    );
}