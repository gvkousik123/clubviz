"use client";

import { useState } from "react";
import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", email: "" });

    const validateForm = () => {
        const newErrors = { fullName: "", email: "" };
        let isValid = true;

        // Validate full name
        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Update user profile with the provided details
            // This assumes you have an update profile API endpoint
            // You might need to implement this in your auth service

            toast({
                title: "Details saved successfully",
                description: "Welcome to ClubViz!",
            });

            // Navigate to location permission page
            setTimeout(() => {
                router.push('/location/allow');
            }, 800);

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({
                title: "Failed to save details",
                description: error.message || 'Please try again',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const canSubmit = fullName.trim() && email.trim() && !isLoading;

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
                        href="/auth/otp"
                        className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
                    </Link>

                    <button
                        onClick={() => router.push('/location/allow')}
                        className="px-[1rem] py-[0.375rem] rounded-full border border-teal-400/30 text-[0.875rem] text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Skip
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
                            <h1 className="text-[1.5rem] font-semibold text-[#2C1945] mb-[1.25rem] text-center">Enter Your Details</h1>
                        </div>

                        {/* Confirmation text */}
                        <div className="mb-[2rem] text-center">
                            <p className="text-[#2C1945] text-[0.9375rem] font-medium">Enter your required information</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-[1.5rem] mb-[2rem]">
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-[#2C1945] text-[0.9375rem] font-medium mb-[0.5rem]">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                                    }}
                                    placeholder="Enter your full name"
                                    className={`w-full px-[1rem] py-[0.875rem] border-2 rounded-[3.25rem] bg-[#EFEFEF] text-[1rem] placeholder:text-[#999999] transition-colors ${errors.fullName
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-[#0C898B] focus:border-[#0C898B]'
                                        } focus:outline-none`}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-[0.875rem] text-red-500">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-[#2C1945] text-[0.9375rem] font-medium mb-[0.5rem]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                    }}
                                    placeholder="Enter your email"
                                    className={`w-full px-[1rem] py-[0.875rem] border-2 rounded-[3.25rem] bg-[#EFEFEF] text-[1rem] placeholder:text-[#999999] transition-colors ${errors.email
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-[#0C898B] focus:border-[#0C898B]'
                                        } focus:outline-none`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-[0.875rem] text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full py-[0.875rem] rounded-[3.25rem] text-[1rem] font-semibold transition-all duration-200 ${canSubmit
                                    ? 'bg-[#0D7377] hover:bg-[#0A5A5D] text-white'
                                    : 'bg-[#EFEFEF] text-[#999999] cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? 'Saving...' : 'Submit details'}
                        </button>

                        {/* Terms and Conditions */}
                        <div className="mt-auto pt-4">
                            <div className="text-center">
                                <p className="text-black font-semibold text-[14px]">
                                    By proceeding you are agreeing to
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