'use client';

import React from 'react';
import Link from 'next/link';
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
}

export default function LoginPage(): JSX.Element {
    const loginOptions: LoginOption[] = [
        {
            icon: Smartphone,
            label: 'Login with Mobile',
            href: '/auth/mobile',
            gradient: 'from-gray-100 to-gray-300',
            textColor: 'text-gray-900'
        },
        {
            icon: Mail,
            label: 'Login with Email',
            href: '/auth/email',
            gradient: 'from-[#00afb2] to-[#005c61]',
            textColor: 'text-white'
        },
        {
            icon: Chrome,
            label: 'Login with Google',
            href: '/auth/google',
            gradient: 'from-[#ff5757] to-[#993434]',
            textColor: 'text-white'
        }
    ];

    return (
        <AuthLayout>
            <div className="relative w-full h-screen max-h-screen flex flex-col ">

                {/* Guest Login Button */}
                <div className="absolute top-16 right-6 p-4 z-10">
                    <Link
                        href="/auth/intro"
                        className="bg-gray-600/40 border border-cyan-400 text-white text-sm font-medium px-6 py-2 rounded-full backdrop-blur-sm hover:bg-gray-600/60 transition-all duration-300"
                    >
                        Guest Login
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center items-center ">
                    {/* Logo Section with Dark Shadows */}
                    <div className="flex flex-col items-center space-y-6">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>
                </div>

                {/* Login Options - Full Width */}
                <div className="w-screen relative left-1/2 -ml-[50vw]">
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
                    <div className="w-full">
                        {loginOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isFirst = index === 0;
                            const isLast = index === loginOptions.length - 1;

                            return (
                                <Link
                                    key={option.label}
                                    href={option.href}
                                    className={`
                      block w-full py-6  
                      bg-gradient-to-b ${option.gradient}
                      ${isFirst ? 'rounded-t-[30px]' : ''}
                      ${isLast ? 'pb-8 min-h-[40px]' : ''}
                      border-t border-white/20
                      hover:brightness-110 transition-all duration-300
                      transform hover:scale-[1.02] hover:shadow-lg
                      min-w-0 flex-shrink-0
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
                </div>
            </div>
        </AuthLayout>
    );
}