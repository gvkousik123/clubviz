'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    BatteryFull,
    Mail,
    Signal,
    Smartphone,
    Wifi,
} from 'lucide-react';
import { ClubVizLogo } from '@/components/auth/logo';
import GoogleIcon from '@/components/auth/google-icon';
import { useToast } from '@/hooks/use-toast';

const statusIndicators = [
    { id: 'signal', icon: Signal },
    { id: 'wifi', icon: Wifi },
    { id: 'battery', icon: BatteryFull },
];

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement Google OAuth integration
            // For now, showing a message that it's not implemented
            toast({
                title: "Coming Soon",
                description: "Google login will be available soon!",
            });

            // Temporary: Redirect after 1 second for demo
            setTimeout(() => {
                setIsLoading(false);
                // router.push('/home'); // Uncomment when ready
            }, 1000);
        } catch (error: any) {
            console.error("Google login error:", error);
            toast({
                title: "Login failed",
                description: error.message || "Failed to login with Google",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#001013] text-white">
            {/* Background effect */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[#001013]" />
                <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#003336]/30 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col px-0 pb-0 pt-2">
                {/* Status bar */}


                {/* Guest login button */}
                <div className="mt-4 flex justify-end px-6">
                    <Link
                        href="/home"
                        className="inline-flex items-center justify-center rounded-full border border-[#00B0BD]/40 bg-transparent px-5 py-1.5 text-sm font-medium text-white transition hover:bg-[#00B0BD]/10"
                    >
                        Guest Login
                    </Link>
                </div>

                {/* Empty space in the middle */}
                <div className="flex-1"></div>

                {/* Login options with logo and terms */}
                <div>
                    {/* Logo and branding */}
                    <div className="flex-1 flex flex-col items-center justify-end px-6 pb-8">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>

                    {/* Terms text - exact match to design */}
                    <div className="text-center mb-8">
                        <p className="text-[15px] font-normal leading-tight text-white">
                            By login you are agreeing to
                        </p>
                        <p className="text-[15px] font-normal leading-tight mt-1">
                            <Link href="/terms" className="text-[#00DCE5] font-normal">
                                Terms &amp; Condition
                            </Link>
                            <span className="text-white"> and </span>
                            <Link href="/privacy" className="text-[#00DCE5] font-normal">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Login buttons with consistent height and no gaps between them */}
                <div className="w-full">
                    {/* Mobile Login Button */}
                    <div className="relative w-full rounded-t-[30px] overflow-visible bg-gradient-to-b from-white to-[#BCBCBC] z-10 border-t border-white">
                        <Link
                            href="/auth/mobile"
                            className="flex w-full items-center justify-center gap-3 h-[110px] pb-[20px] text-black"
                        >
                            <Smartphone className="h-6 w-6" />
                            <span className="text-[18px] font-semibold font-['Manrope'] leading-[21px] tracking-tight">Login with Mobile</span>
                        </Link>
                    </div>

                    {/* Email Login Button */}
                    <div className="relative w-full -mt-[22px] rounded-t-[30px] overflow-visible bg-gradient-to-b from-[#00B0B3] to-[#005D62] z-20 border-t border-white">
                        <Link
                            href="/auth/email"
                            className="flex w-full items-center justify-center gap-3 h-[115px] pb-[25px] text-white"
                        >
                            <Mail className="h-6 w-6" />
                            <span className="text-[18px] font-semibold font-['Manrope'] leading-[21px]">Login with Email</span>
                        </Link>
                    </div>

                    {/* Google Login Button */}
                    <div className="relative w-full -mt-[22px] rounded-t-[30px] overflow-visible bg-gradient-to-b from-[#FF5757] to-[#993434] z-30 border-t border-white">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-3 h-[95px] pb-[5px] text-white"
                        >
                            {isLoading ? (
                                <svg
                                    className="h-6 w-6 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : (
                                <GoogleIcon className="h-6 w-6" />
                            )}
                            <span className="text-[18px] font-semibold font-['Manrope'] leading-[21px]">
                                {isLoading ? 'Logging in...' : 'Login with Google'}
                            </span>
                        </button>
                    </div>

                    {/* Register Button */}
                    <div className="relative w-full -mt-[22px] rounded-t-[30px] overflow-visible bg-gradient-to-b from-[#00DCE5] to-[#00B0B3] z-40 border-t border-white">
                        <Link
                            href="/auth/signup"
                            className="flex w-full items-center justify-center gap-3 h-[35px] pb-[0px] text-black"
                        >
                            <span className="text-[16px] font-bold font-['Manrope'] leading-[21px]">Don't have an account ?</span>
                            <span className="text-[16px] font-bold font-['Manrope'] leading-[21px]">Register</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}