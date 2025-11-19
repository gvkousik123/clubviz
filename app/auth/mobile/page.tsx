"use client";

import { useState, useEffect } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { firebasePhoneAuth } from "@/lib/firebase/phone-auth";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function MobileVerificationScreen() {
    const router = useRouter();
    const { toast } = useToast();
    // Initialize with exactly 10 placeholder X's: +91 XXXXXXXXXX
    const [phoneNumber, setPhoneNumber] = useState(() => {
        const initialPhone = "+91 XXXXXXXXXX";
        console.log("Initial phone state:", initialPhone, "Length:", initialPhone.length);
        return initialPhone;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle guest login
    const handleGuestLogin = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.accessToken);
            localStorage.removeItem(STORAGE_KEYS.user);
            localStorage.removeItem(STORAGE_KEYS.refreshToken);
        }

        // Show success message
        toast({
            title: "Welcome, Guest!",
            description: "You can browse clubs and events without logging in",
        });

        // Navigate to home page as guest
        router.push('/home');
    };

    // Setup reCAPTCHA on component mount
    useEffect(() => {
        try {
            firebasePhoneAuth.setupRecaptcha('recaptcha-container', 'normal');
        } catch (error) {
            console.error("Error setting up reCAPTCHA:", error);
        }

        // Cleanup on unmount
        return () => {
            firebasePhoneAuth.cleanup();
        };
    }, []);

    const handleNumberPress = (num: string) => {
        console.log("Number pressed:", num, "Current phone:", phoneNumber, "Has X?", phoneNumber.includes('X'));
        if (phoneNumber.includes('X')) {
            const newPhone = phoneNumber.replace('X', num);
            console.log("New phone after replace:", newPhone);
            setPhoneNumber(newPhone);
        }
    };

    const handleDelete = () => {
        const lastDigitIndex = phoneNumber.lastIndexOf(/[0-9]/.exec(phoneNumber.split('').reverse().join(''))?.[0] || '');
        if (lastDigitIndex > 3) { // Keep "+91 " format (4 characters)
            setPhoneNumber(prev => {
                const chars = prev.split('');
                for (let i = chars.length - 1; i >= 0; i--) {
                    if (/[0-9]/.test(chars[i]) && i > 3) {
                        chars[i] = 'X';
                        break;
                    }
                }
                return chars.join('');
            });
        }
    };

    const handleSubmit = async () => {
        console.log("=== Mobile Login: handleSubmit called ===");
        console.log("Current phone number:", phoneNumber);

        setIsLoading(true);
        setError(null);

        try {
            // Clean phone number and format for Firebase
            const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

            if (cleanPhone.length !== 12) { // Should be 12 digits (91 + 10 digits)
                setError('Please enter a valid 10-digit mobile number');
                setIsLoading(false);
                return;
            }

            // Convert to international format for Firebase
            const formattedPhone = `+${cleanPhone}`;
            console.log("Formatted phone for Firebase:", formattedPhone);



            // Send OTP using Firebase
            const success = await firebasePhoneAuth.sendOTP(formattedPhone);

            if (success) {
                // Store phone number for OTP verification
                localStorage.setItem(STORAGE_KEYS.pendingPhone, formattedPhone);

                // Show success toast
                toast({
                    title: "OTP sent successfully",
                    description: "Please check your mobile for the verification code",
                });

                // Navigate to OTP verification page
                setTimeout(() => {
                    router.push('/auth/otp');
                }, 800);
            }
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            setError(error.message || 'Failed to send OTP. Please try again.');

            toast({
                title: "Failed to send OTP",
                description: error.message || 'Please check your number and try again',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const canSubmit = !phoneNumber.includes('X') && !isLoading;

    return (
        <div className="min-h-screen bg-[#031313] relative">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 w-[20rem] h-[20rem] bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[12vh] left-1/3 w-[15rem] h-[15rem] bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-[10rem] h-[10rem] bg-teal-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header with Back and Skip */}
                <div className="flex items-center justify-between p-[1rem] pt-[1.5rem] flex-shrink-0">
                    <Link
                        href="/auth/intro"
                        className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
                    </Link>

                    <button
                        onClick={handleGuestLogin}
                        className="px-[1rem] py-[0.375rem] rounded-full border border-teal-400/30 text-[0.875rem] text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Guest Login
                    </button>
                </div>

                {/* White Card Container - Sticks to bottom and takes remaining space */}
                <div className="flex-1 flex flex-col">
                    {/* Logo Area - Now positioned just above the form with increased spacing */}
                    <div className="flex-1 flex flex-col items-center justify-end px-6 pb-8">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>

                    <div className="bg-white rounded-t-3xl w-full px-[1.5rem] pt-[2rem] pb-[2rem] overflow-y-auto flex flex-col">
                        {/* Header */}
                        <div className="mb-[1.5rem]">
                            <h1 className="text-[1.5rem] font-semibold text-[#2C1945] mb-[1.25rem] text-center">Enter your Mobile Number</h1>
                        </div>

                        {/* Phone number display */}
                        <div className="mb-[0.75rem] text-center">
                            <div className="w-full max-w-[23.75rem] h-[4.75rem] mx-auto bg-[#EFEFEF] rounded-[3.25rem] border border-[#0C898B] flex items-center justify-center p-2">
                                <div className="text-[1.125rem] font-mono font-medium text-[#666666] text-center whitespace-nowrap">
                                    {phoneNumber}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation text */}
                        <div className="mb-[2rem] text-center">
                            <p className="text-[#2C1945] text-[0.9375rem] font-medium">We will send you a confirmation code</p>
                        </div>

                        {/* Number Keypad */}
                        <div className="mx-auto w-[17.5rem] space-y-[1rem] mb-[1.5rem]">
                            {/* Keypad Grid */}
                            <div className="grid grid-cols-3 gap-[1rem]">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberPress(num.toString())}
                                        className="w-[4.375rem] h-[4.375rem] rounded-full border border-[#0C898B] 
                                             bg-white text-[#42353B] text-[1.875rem] font-semibold
                                             hover:bg-gray-50 active:bg-gray-100 
                                             flex items-center justify-center"
                                    >
                                        {num}
                                    </button>
                                ))}

                                {/* Bottom Row */}
                                <button
                                    onClick={handleDelete}
                                    className="w-[4.375rem] h-[4.375rem] rounded-full bg-[#EFEFEF] 
                                        text-gray-900 flex items-center justify-center"
                                >
                                    <X className="w-[1rem] h-[1rem]" />
                                </button>

                                <button
                                    onClick={() => handleNumberPress('0')}
                                    className="w-[4.375rem] h-[4.375rem] rounded-full border border-[#0C898B] 
                                        bg-white text-[#42353B] text-[1.875rem] font-semibold
                                        hover:bg-gray-50 active:bg-gray-100
                                        flex items-center justify-center"
                                >
                                    0
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className="w-[4.375rem] h-[4.375rem] rounded-full bg-[#0D7377] 
                                        text-white flex items-center justify-center"
                                >
                                    <ArrowRight className="w-[1.5rem] h-[1.5rem] text-white" />
                                </button>
                            </div>
                        </div>

                        {/* reCAPTCHA Container - Visible for user interaction */}
                        <div className="flex justify-center mb-[1.5rem]">
                            <div id="recaptcha-container"></div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="text-center mb-4">
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Display the phone number status somewhere */}
                        <div className="hidden">
                            Current number: {phoneNumber}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center py-2">
                            <AuthLink
                                href="/auth/forgot-password"
                                className="text-[#0095FF] font-medium text-[14px] underline"
                            >
                                Forgot Password?
                            </AuthLink>
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