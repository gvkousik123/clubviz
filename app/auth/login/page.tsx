'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BatteryFull,
    Chrome,
    Mail,
    Signal,
    Smartphone,
    Wifi,
} from 'lucide-react';
import { ClubVizLogo } from '@/components/auth/logo';

interface LoginOption {
    id: string;
    icon: React.ElementType;
    label: string;
    href?: string;
    gradientClass: string;
    textClass: string;
    iconClass: string;
    shadowClass: string;
    isGoogle?: boolean;
    wrapperClass: string;
    contentClass: string;
}

const statusIndicators = [
    { id: 'signal', icon: Signal },
    { id: 'wifi', icon: Wifi },
    { id: 'battery', icon: BatteryFull },
];

const loginOptions: LoginOption[] = [
    {
        id: 'mobile',
        icon: Smartphone,
        label: 'Login with Mobile',
        href: '/auth/mobile',
        gradientClass: 'bg-[linear-gradient(180deg,#f9fbfb_0%,#d1dbdc_100%)]',
        textClass: 'text-[#041317]',
        iconClass: 'text-[#041317]',
        shadowClass: 'shadow-[0_20px_48px_rgba(4,19,23,0.32)]',
        wrapperClass: '',
        contentClass: 'rounded-t-[30px] border-t border-white/40 px-12 py-8',
    },
    {
        id: 'email',
        icon: Mail,
        label: 'Login with Email',
        href: '/auth/email',
        gradientClass: 'bg-[linear-gradient(180deg,#18efd9_0%,#0a82a1_100%)]',
        textClass: 'text-white',
        iconClass: 'text-white',
        shadowClass: 'shadow-[0_24px_46px_rgba(14,149,169,0.42)]',
        wrapperClass: '-mt-16',
        contentClass: 'rounded-t-[30px] border-t border-white/30 px-12 py-7',
    },
    {
        id: 'google',
        icon: Chrome,
        label: 'Login with Google',
        gradientClass: 'bg-[linear-gradient(180deg,#ff6c63_0%,#a82424_100%)]',
        textClass: 'text-white',
        iconClass: 'text-white',
        shadowClass: 'shadow-[0_24px_50px_rgba(167,32,32,0.45)]',
        isGoogle: true,
        wrapperClass: '-mt-16',
        contentClass: 'rounded-t-[30px] border-t border-white/25 px-12 py-6',
    },
];

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            router.push('/home');
        }, 1000);
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#040b0f] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0d2f37_0%,#040b0f_58%,#040b0f_100%)] opacity-90" />
                <div className="absolute bottom-[-140px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#12ffe8_0%,rgba(4,11,15,0.7)_55%,rgba(4,11,15,0)_100%)] blur-[140px] opacity-40" />
                <div className="absolute bottom-0 left-1/2 h-[220px] w-[480px] -translate-x-1/2 bg-[radial-gradient(circle_at_bottom,#0f3c41_0%,rgba(4,11,15,0.85)_58%,rgba(4,11,15,0)_100%)] opacity-70" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col px-6 pb-12 pt-8">
                <header className="flex items-center justify-between text-white/80">
                    <span className="text-sm font-semibold tracking-[0.35em]">9:41</span>
                    <div className="flex items-center gap-2 text-white/70">
                        {statusIndicators.map(({ id, icon: Icon }) => (
                            <Icon key={id} className="h-4 w-4" strokeWidth={2.2} />
                        ))}
                    </div>
                </header>

                <div className="mt-8 flex justify-end">
                    <Link
                        href="/home"
                        className="inline-flex items-center justify-center rounded-full border border-[#12ffe8]/45 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-white/10"
                    >
                        Guest Login
                    </Link>
                </div>

                <div className="mt-14 flex flex-col items-center gap-6 text-center">
                    <ClubVizLogo size="lg" variant="full" />
                    <div className="flex flex-col items-center text-[15px] font-medium leading-tight text-white">
                        <span>By login you are agreeing to</span>
                        <span className="mt-1">
                            <Link href="/terms" className="text-[#12ffe8] underline underline-offset-4">
                                Terms &amp; Condition
                            </Link>
                            <span className="text-white"> and </span>
                            <Link href="/privacy" className="text-[#12ffe8] underline underline-offset-4">
                                Privacy Policy
                            </Link>
                        </span>
                    </div>
                </div>

                <div className="mt-14 flex flex-1 flex-col justify-end">
                    <div className="mx-auto flex w-full max-w-[430px] flex-col">
                        {loginOptions.map((option) => {
                            const Icon = option.icon;

                            if (option.isGoogle) {
                                return (
                                    <div key={option.id} className={option.wrapperClass}>
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}
                                            className={`flex w-full items-center justify-center gap-3 rounded-[28px] text-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12ffe8] ${option.gradientClass} ${option.shadowClass} ${option.contentClass} ${isLoading ? 'cursor-not-allowed opacity-80' : 'hover:-translate-y-0.5 hover:shadow-[0_32px_48px_rgba(162,38,38,0.5)]'}`}
                                        >
                                            {isLoading ? (
                                                <svg
                                                    className="h-5 w-5 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                            ) : (
                                                <Icon className={`h-5 w-5 ${option.iconClass}`} />
                                            )}
                                            <span className={option.textClass}>
                                                {isLoading ? 'Logging in...' : option.label}
                                            </span>
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div key={option.id} className={option.wrapperClass}>
                                    <Link
                                        href={option.href ?? '#'}
                                        className={`group flex w-full items-center justify-center gap-3 rounded-[28px] text-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12ffe8] ${option.gradientClass} ${option.shadowClass} ${option.contentClass} hover:-translate-y-0.5 hover:shadow-[0_28px_46px_rgba(11,138,153,0.45)]`}
                                    >
                                        <Icon className={`h-5 w-5 ${option.iconClass}`} />
                                        <span className={option.textClass}>{option.label}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
