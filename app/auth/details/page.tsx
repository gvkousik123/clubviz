"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClubVizLogo } from "@/components/auth/logo";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function UserDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        fullName: "",
        email: ""
    });

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
        <div className="min-h-screen bg-[#031313] relative">
            {/* Background blur effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header with Back button */}
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

                {/* Main content */}
                <div className="flex-1 flex flex-col items-center px-6 pb-8">
                    {/* Logo */}
                    <div className="mb-8">
                        <ClubVizLogo size="md" variant="full" />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-[28px] font-bold text-white mb-2 font-['Manrope']">
                            Enter Your Details
                        </h1>
                        <p className="text-[16px] text-gray-400 font-['Manrope']">
                            Tell us more about yourself
                        </p>
                    </div>

                    {/* Form */}
                    <div className="w-full max-w-sm space-y-6">
                        {/* Full Name Input */}
                        <div className="space-y-2">
                            <label className="block text-[14px] font-medium text-gray-300 font-['Manrope']">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 bg-white/5 border border-teal-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors font-['Manrope']"
                            />
                            {errors.fullName && (
                                <p className="text-red-400 text-sm font-['Manrope']">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-[14px] font-medium text-gray-300 font-['Manrope']">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white/5 border border-teal-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors font-['Manrope']"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm font-['Manrope']">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full max-w-sm mt-12">
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full py-4 rounded-xl font-semibold text-[16px] font-['Manrope'] transition-all duration-200 ${canSubmit
                                    ? 'bg-gradient-to-r from-[#14FFEC] to-[#00B0BD] text-black hover:shadow-lg hover:shadow-teal-500/25 transform hover:scale-[1.02]'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving details...
                                </div>
                            ) : (
                                'Submit details'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}