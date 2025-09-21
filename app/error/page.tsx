'use client';

import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage() {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                {/* Error Icon */}
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                </div>

                {/* Error Message */}
                <h1 className="text-white text-2xl font-bold mb-4">Oops! Something went wrong</h1>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                    We're having trouble connecting to our servers. Please check your internet connection and try again.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleRetry}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Try Again</span>
                    </button>

                    <Link
                        href="/home"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go to Home</span>
                    </Link>
                </div>

                {/* Error Code */}
                <div className="mt-8 text-white/40 text-sm">
                    Error Code: 500
                </div>
            </div>
        </div>
    );
}