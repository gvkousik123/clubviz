"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";

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
            localStorage.setItem('pending_phone', sanitizedPhoneNumber);
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

            {/* Content - Scrollable with hidden scrollbar */}
            <div className="relative z-10 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
                <div className="flex flex-col min-h-screen">
                    {/* Header with Back and Skip */}
                    <div className="flex items-center justify-between p-4 pt-12 flex-shrink-0">
                        <Link
                            href="/auth/login"
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
                    <div className="flex flex-col items-center justify-center px-6 py-8 flex-shrink-0">
                        {/* Logo */}
                        <div className="mb-8">
                            <ClubVizLogo size="md" variant="full" />
                        </div>
                    </div>

                    {/* White Card Container */}
                    <div className="flex-1 min-h-0 pb-8">
                        <div className="bg-white rounded-t-3xl px-6 py-6 min-h-full">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h1>
                                <p className="text-teal-600 text-sm">Join the ClubWiz community</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Registration Form */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Full Name Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="w-full py-4 px-4 rounded-2xl border-2 border-teal-400 
                                             bg-gray-50 text-gray-900 placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                             transition-all duration-200"
                                        autoFocus
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full py-4 px-4 rounded-2xl border-2 border-teal-400 
                                             bg-gray-50 text-gray-900 placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                             transition-all duration-200"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full py-4 px-4 rounded-2xl border-2 border-teal-400 
                                             bg-gray-50 text-gray-900 placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                             transition-all duration-200"
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="w-full py-4 px-4 pr-12 rounded-2xl border-2 border-teal-400 
                                                 bg-gray-50 text-gray-900 placeholder-gray-400
                                                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                                 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="w-full py-4 px-4 pr-12 rounded-2xl border-2 border-teal-400 
                                                 bg-gray-50 text-gray-900 placeholder-gray-400
                                                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                                 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 rounded-2xl font-medium text-white 
                                         header-gradient 
                                         hover:from-teal-600 hover:to-cyan-600 
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         shadow-lg active:scale-[0.98] transition-all duration-200"
                                    style={{
                                        boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
                                    }}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center pb-4">
                                <p className="text-gray-600">
                                    Already have an account? <AuthLink href="/auth/email">Login</AuthLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}