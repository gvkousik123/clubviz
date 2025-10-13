'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Smartphone, Chrome } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ClubVizLogo } from '@/components/auth/logo';
import { AuthButton } from '@/components/auth/auth-button';

interface LoginOption {
    icon: React.ElementType;
    label: string;
    href: string;
    gradient: string;
    textColor: string;
    isGoogleLogin?: boolean;
}

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            router.push('/home');
        }, 1000);
    };

    const loginOptions: LoginOption[] = [
        {
            icon: Smartphone,
            label: 'Login with Mobile',
            href: '/auth/mobile',
            gradient: 'from-background-secondary to-background-tertiary',
            textColor: 'text-white'
        },
        {
            icon: Mail,
            label: 'Login with Email',
            href: '/auth/email',
            gradient: 'from-accent-teal to-accent-tealDark',
            textColor: 'text-white'
        },
        {
            icon: Chrome,
            label: 'Login with Google',
            href: '/home', // Direct navigation to home
            gradient: 'from-[#ff5757] to-[#993434]',
            textColor: 'text-white',
            isGoogleLogin: true
        }
    ];

    return (
        <AuthLayout>
            <div className="relative w-full flex flex-col">

                {/* Guest Login Button */}
                <div className="absolute top-4 right-6 z-10">
                    <Link
                        href="/home"
                        className="glass-light border border-accent-cyan text-white text-sm font-medium px-6 py-2 rounded-full hover:glass-standard transition-all duration-300"
                    >
                        Guest Login
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex flex-col justify-center items-center px-6 py-8">
                    {/* Logo Section with Dark Shadows */}
                    <div className="flex flex-col items-center space-y-6 mb-8">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>
                </div>

                {/* Login Options */}
                <div className="w-full px-6 pb-6">
                    {/* Terms and Privacy */}
                    <div className="text-center space-y-1 text-white pb-5">
                        <p className="text-base">
                            By login you are agreeing to
                        </p>
                        <p className="text-base">
                            <Link href="/terms" className="text-cyan-400 underline hover:text-cyan-300 transition-colors">
                                Terms & Condition
                            </Link>
                            <span> and </span>
                            <Link href="/privacy" className="text-cyan-400 underline hover:text-cyan-300 transition-colors">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                    <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                        {loginOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isFirst = index === 0;
                            const isLast = index === loginOptions.length - 1;
                            const isGoogle = option.isGoogleLogin;

                            // For Google login, handle with JS instead of Link
                            if (isGoogle) {
                                return (
                                    <button
                                        key={option.label}
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        className={`
                                          block w-full py-4 mb-3
                                          bg-gradient-to-r ${option.gradient}
                                          ${isLast ? 'mb-0' : ''}
                                          rounded-xl
                                          hover:brightness-110 transition-all duration-300
                                          transform hover:scale-[1.02] hover:shadow-lg
                                          min-w-0 flex-shrink-0
                                          ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
                                          shadow-md
                                        `}
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            {isLoading ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <Icon className={`w-5 h-5 ${option.textColor}`} />
                                            )}
                                            <span className={`text-lg font-semibold ${option.textColor}`}>
                                                {isLoading ? 'Logging in...' : option.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={option.label}
                                    href={option.href}
                                    className={`
                                      block w-full py-4 mb-3
                                      bg-gradient-to-r ${option.gradient}
                                      ${isLast ? 'mb-0' : ''}
                                      rounded-xl
                                      hover:brightness-110 transition-all duration-300
                                      transform hover:scale-[1.02] hover:shadow-lg
                                      min-w-0 flex-shrink-0
                                      shadow-md
                                    `}

                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <Icon
                                            className={`w-5 h-5 ${option.textColor}`}

                                        />
                                        <span
                                            className={`text-lg font-semibold ${option.textColor}`}

                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Register Option */}
                    <div className="mt-6 text-center pb-8">
                        <p className="text-white text-base mb-3">
                            Don't have an account?
                        </p>
                        <Link
                            href="/auth/signup"
                            className="inline-block header-gradient text-white font-semibold px-8 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            style={{
                                boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
                            }}
                        >
                            Register Here
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}