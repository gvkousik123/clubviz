"use client";

import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailLoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            console.log("Login with:", { email, password });
            // Navigate to home page - no validation, just navigate with any input
            router.push('/home');
        }, 1000);
    };

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
                        href="/auth/login"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/auth/login"
                        className=" py-2 rounded-full border border-teal-400/30 text-sm text-teal-300 hover:bg-teal-500/10 transition"
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

                {/* White Card Container - Bottom half with proper height */}
                <div className="px-0 pb-0">
                    <div className="bg-white rounded-t-3xl px-6 py-6 min-h-[45vh]">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
                            <p className="text-teal-600 text-sm">Good to see you back</p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-4 px-4 rounded-2xl border-2 border-teal-400 
                                             bg-gray-50 text-gray-900 placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                             transition-all duration-200"
                                    autoFocus
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-gray-800 font-medium mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 px-6 rounded-2xl font-medium text-white 
                                         bg-gradient-to-r from-teal-500 to-cyan-500 
                                         hover:from-teal-600 hover:to-cyan-600 
                                         shadow-lg transition-all duration-200
                                         ${isLoading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                                style={{
                                    boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
                                }}
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
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account? <AuthLink href="/auth/register">Register</AuthLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}