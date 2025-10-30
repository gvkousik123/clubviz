"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";
import { useToast } from "@/hooks/use-toast";

export default function EmailLoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            toast({
                title: "Validation Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const trimmedEmail = email.trim().toLowerCase();
            const trimmedPassword = password.trim();

            // Use the new signIn method
            const response = await AuthService.signIn(trimmedEmail, trimmedPassword);

            if (response.success) {
                toast({
                    title: "Login successful",
                    description: "Welcome back to ClubViz!",
                });

                // Redirect to home or location page
                router.push('/location/allow');
            }

        } catch (err: any) {
            console.error("Login error:", err);

            // Extract error message - now errors are properly formatted from service
            const errorMessage = err.message || 'Login failed. Please check your credentials.';

            setError(errorMessage);

            toast({
                title: "Login failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* Logo Area - Centered with remaining space */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
                    <ClubVizLogo size="lg" variant="full" />
                </div>

                {/* White Card Container - Form area */}
                <div className="bg-white rounded-t-3xl w-full px-6 pt-6 pb-8 flex flex-col flex-shrink-0">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-[#2C1945] mb-1">Login</h1>
                        <p className="text-[#0C898B] text-sm font-semibold">Good to see you back</p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Email/Username Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Email</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-3.5 px-5 rounded-[36px] border border-[#0C898B] 
                                                     bg-[#EFEFEF] text-gray-900 placeholder-[#A09F99] text-base
                                                     focus:outline-none focus:ring-2 focus:ring-[#0C898B] focus:border-transparent
                                                     transition-all duration-200 h-[55px]"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-[#0C0C0D] font-bold mb-2 text-base">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        {/* Bottom section - Login Button and Register Link */}
                        <div className="space-y-4 pt-2">
                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-[55px] rounded-[30px] font-extrabold text-white border border-white
                                             bg-gradient-to-b from-[#0D7377] to-[#222830] 
                                             transition-all duration-200 text-base
                                             ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>

                            {/* Register Link */}
                            <div className="text-center pb-2 space-y-1">
                                <div className="flex justify-center items-center">
                                    <span className="text-[#2C1945] font-bold text-[15px]">Don't have an account ? </span>
                                    <AuthLink href="/auth/signup" className="text-[#0095FF] font-bold text-[15px] pl-1">Register</AuthLink>
                                </div>
                                <div className="flex justify-center items-center">
                                    <AuthLink href="/auth/forgot-password" className="text-[#0095FF] font-medium text-[14px] underline">
                                        Forgot Password?
                                    </AuthLink>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}