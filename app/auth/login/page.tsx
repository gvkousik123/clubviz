import { ClubVizLogo } from "@/components/auth/logo";
import { AuthLink } from "@/components/auth/auth-link";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function LoginOptionsScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 relative overflow-hidden">
            {/* Background blur effects with adjusted z-index */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-screen flex flex-col">
                {/* Guest Login Button */}
                <div className="flex justify-end p-4 pt-12 z-40">
                    <button className="px-5 py-2 rounded-full border border-cyan-400 text-sm text-cyan-300 bg-gray-600/40 hover:bg-gray-600/60 transition">
                        Guest Login
                    </button>
                </div>

                {/* Main Content - Logo Area */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 z-40">
                    {/* Logo */}
                    <div className="mb-8">
                        <ClubVizLogo size="lg" variant="full" />
                    </div>
                </div>

                {/* Terms and Conditions - Above buttons */}
                <div className="px-6 mb-4 z-40">
                    <div className="text-center text-sm text-white/70">
                        By login you are agreeing to
                        <br />
                        <AuthLink href="/terms">Terms & Condition</AuthLink> and <AuthLink href="/privacy">Privacy Policy</AuthLink>
                    </div>
                </div>

                {/* Login Options Container - Stacked cards like in HTML */}
                <div className="relative z-30">
                    {/* Login with Mobile - First card */}
                    <div className="bg-gradient-to-b from-white to-gray-200 rounded-t-[30px] border-t border-white px-6 py-6 relative z-30">
                        <Link
                            href="/auth/mobile"
                            className="w-full flex items-center justify-center gap-3 text-black text-lg font-semibold py-2"
                        >
                            <Phone className="w-5 h-5 rotate-180" />
                            Login with Mobile
                        </Link>
                    </div>

                    {/* Login with Email - Second card */}
                    <div className="bg-gradient-to-b from-teal-500 to-teal-700 rounded-t-[30px] border-t border-white px-6 py-6 relative z-20 -mt-4">
                        <Link
                            href="/auth/email"
                            className="w-full flex items-center justify-center gap-3 text-white text-lg font-semibold py-2"
                        >
                            <Mail className="w-5 h-5" />
                            Login with Email
                        </Link>
                    </div>

                    {/* Login with Google - Third card */}
                    <div className="bg-gradient-to-b from-red-500 to-red-700 rounded-t-[30px] border-t border-white px-6 py-6 relative z-10 -mt-4">
                        <Link
                            href="#"
                            className="w-full flex items-center justify-center gap-3 text-white text-lg font-semibold py-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login with Google
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}