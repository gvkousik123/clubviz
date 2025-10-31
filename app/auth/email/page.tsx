"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function UserDetailsScreen() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        fullName: "",
        email: ""
    });
    const router = useRouter();
    const { toast } = useToast();

    const validateForm = () => {
        const newErrors = {
            fullName: "",
            email: ""
        };

        // Full name validation
        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return !newErrors.fullName && !newErrors.email;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Store user details
        const userDetails = {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: localStorage.getItem(STORAGE_KEYS.pendingPhone) || "",
            createdAt: new Date().toISOString()
        };

        // Store user details in localStorage
        localStorage.setItem(STORAGE_KEYS.userDetails, JSON.stringify(userDetails));

        // Store dummy authentication tokens
        localStorage.setItem(STORAGE_KEYS.accessToken, 'dummy-auth-token-' + Date.now());
        localStorage.setItem(STORAGE_KEYS.refreshToken, 'dummy-refresh-token-' + Date.now());

        // Show success toast
        toast({
            title: "Details saved",
            description: "Your information has been saved successfully!",
        });

        // Navigate to location confirmation after a short delay
        setTimeout(() => {
            router.push('/location/allow');
            setIsLoading(false);
        }, 800);
    };

    const canSubmit = fullName.trim() && email.trim() && !isLoading;

    return (
        <div className="h-screen bg-[#031313] relative overflow-hidden">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Header with Back and Skip */}
                <div className="flex items-center justify-between p-4 pt-6 flex-shrink-0">
                    <Link
                        href="/auth/otp"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/location/allow"
                        className="px-4 py-1.5 rounded-full border border-teal-400/30 text-sm text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Skip
                    </Link>
                </div>

                {/* Logo Area - Centered with remaining space */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
                    <ClubVizLogo size="lg" variant="full" />
                </div>

                {/* White Card Container - Form area */}
                <div className="bg-white rounded-t-3xl w-full px-6 pt-6 pb-8 flex flex-col flex-shrink-0">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-[#2C1945] mb-2">Enter Your Details</h1>
                        <p className="text-[#0C898B] text-sm font-semibold">Enter your required Information</p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-4">
                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Full name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                                     bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                                     focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                                     transition-all duration-200 h-[55px]"
                                        autoFocus
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                                     bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                                     focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                                     transition-all duration-200 h-[55px]"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit}
                                className={`w-full h-[55px] rounded-[30px] font-extrabold text-white border border-white
                                             transition-all duration-200 text-base
                                             ${canSubmit
                                        ? 'bg-gradient-to-b from-[#0D7377] to-[#222830] active:scale-[0.98]'
                                        : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving details...
                                    </span>
                                ) : (
                                    'Submit details'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}