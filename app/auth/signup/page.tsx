"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function RegisterScreen() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const trimmedFullName = formData.fullName.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();
        const trimmedConfirmPassword = formData.confirmPassword.trim();
        const sanitizedPhoneNumber = formData.phoneNumber.replace(/[^0-9]/g, '');

        // Basic validation
        if (!trimmedFullName || !trimmedEmail || !sanitizedPhoneNumber || !trimmedPassword) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (trimmedPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await AuthService.register({
                fullName: trimmedFullName,
                email: trimmedEmail.toLowerCase(),
                phoneNumber: sanitizedPhoneNumber,
                password: trimmedPassword
            });

            // Store phone number for OTP verification if needed
            localStorage.setItem(STORAGE_KEYS.pendingPhone, sanitizedPhoneNumber);
            localStorage.setItem('pending_email', trimmedEmail.toLowerCase());

            toast({
                title: "Registration successful",
                description: "User registered successfully!",
            });

            // Navigate to login page after successful registration
            router.push('/auth/login');
        } catch (err: any) {
            console.error("Registration error:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setError(errorMessage);

            toast({
                title: "Registration failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

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
                {/* Header with Back and Skip - Fixed position */}
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

                    <div className="bg-white rounded-t-3xl w-full px-6 pt-6 pb-8 overflow-y-auto flex flex-col">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#2C1945] mb-2">Create Account</h1>
                            <p className="text-[#0C898B] text-sm font-semibold">Join the ClubWiz community</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                             bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                             focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                             transition-all duration-200 h-[55px]"
                                    autoFocus
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                             bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                             focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                             transition-all duration-200 h-[55px]"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                             bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                             focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                             transition-all duration-200 h-[55px]"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full py-3.5 px-5 pr-12 rounded-[38px] border border-[#0C898B] 
                                                 bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                                 focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                                 transition-all duration-200 h-[55px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A09F99]"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="w-full py-3.5 px-5 pr-12 rounded-[38px] border border-[#0C898B] 
                                                 bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                                 focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                                 transition-all duration-200 h-[55px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A09F99]"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Register Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full h-[55px] rounded-[30px] font-extrabold text-white border border-white
                                             bg-gradient-to-b from-[#0D7377] to-[#222830] 
                                             transition-all duration-200 text-base
                                             ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center pt-4">
                                <div className="flex justify-center items-center">
                                    <span className="text-[#2C1945] font-bold text-[15px]">Already have an account ?</span>
                                    <AuthLink href="/auth/email" className="text-[#0095FF] font-bold text-[15px]">Login</AuthLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}