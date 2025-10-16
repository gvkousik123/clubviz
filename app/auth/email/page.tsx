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
            setIsLoading(false);
            return;
        }

        try {
            const trimmedEmail = email.trim().toLowerCase();
            const trimmedPassword = password.trim();

            const response = await AuthService.login({
                usernameOrEmail: trimmedEmail,
                password: trimmedPassword,
            });

            if (response.success) {
                toast({
                    title: "Login successful",
                    description: "Welcome back to ClubViz!",
                });

                router.push('/home');
                return;
            }

            const message = response.message || 'Login failed. Please try again.';
            setError(message);

            toast({
                title: "Login failed",
                description: message,
                variant: "destructive",
            });

        } catch (err: any) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
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
        <div className="min-h-screen bg-[#031313] relative">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-screen flex flex-col">
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
                        className="px-4 py-2 rounded-full border border-teal-400/30 text-sm text-teal-300 hover:bg-teal-500/10 transition"
                    >
                        Skip
                    </Link>
                </div>

                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center px-6 py-4 flex-shrink-0">
                    <ClubVizLogo size="md" variant="full" />
                </div>

                {/* White Card Container - Sticks to bottom and takes remaining space */}
                <div className="flex-1 flex items-end">
                    <div className="bg-white rounded-t-3xl w-full px-6 pt-6 pb-8 overflow-y-auto flex flex-col">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Login</h1>
                            <p className="text-teal-600 text-sm">Good to see you back</p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="mt-auto flex flex-col gap-6" onSubmit={handleSubmit}>
                            {/* Form Fields */}
                            <div className="space-y-4">
                                {/* Email/Username Field */}
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Email or Username</label>
                                    <input
                                        type="text"
                                        placeholder="Email address or username"
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
                            </div>

                            {/* Bottom section - Login Button and Register Link */}
                            <div className="space-y-4 pt-4">
                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 px-6 rounded-2xl font-medium text-white 
                                             header-gradient 
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

                                {/* Register Link */}
                                <div className="text-center pb-2">
                                    <p className="text-gray-600">
                                        Don't have an account? <AuthLink href="/auth/signup">Register</AuthLink>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}