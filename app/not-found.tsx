'use client';

import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/home');
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4">
                <button onClick={handleGoBack}>
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    {/* Large 404 Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                            404
                        </h1>
                    </div>

                    {/* Club Bottle Illustration */}
                    <div className="relative w-48 h-64 mx-auto">
                        {/* Bottle Shape */}
                        <div className="absolute inset-x-8 top-8 bottom-0 bg-gradient-to-b from-teal-400/20 to-teal-600/40 rounded-full border-2 border-teal-400/30">
                            {/* Bottle Neck */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-teal-400/30 border-2 border-teal-400/30 rounded-t"></div>

                            {/* Bottle Cap */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-yellow-400 rounded-t border border-yellow-500">
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-yellow-500 rounded"></div>
                            </div>

                            {/* CLUBWIZ Label */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -rotate-12">
                                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    CLUBWIZ
                                </div>
                            </div>

                            {/* Liquid Effect */}
                            <div className="absolute bottom-4 left-2 right-2 h-32 bg-gradient-to-t from-cyan-500/60 to-teal-400/40 rounded-full">
                                {/* Bubbles */}
                                <div className="absolute top-2 left-3 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                                <div className="absolute top-6 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-100"></div>
                                <div className="absolute top-10 left-6 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-200"></div>

                                {/* Sad Face in the liquid */}
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                                    <div className="relative">
                                        {/* Eyes */}
                                        <div className="flex space-x-3 mb-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        </div>
                                        {/* Sad mouth */}
                                        <div className="w-4 h-2 border-2 border-yellow-400 border-t-0 rounded-b-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating particles around bottle */}
                        <div className="absolute -top-4 -left-4 w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                        <div className="absolute top-12 -right-6 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-16 -left-8 w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce delay-100"></div>
                        <div className="absolute bottom-8 -right-4 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-200"></div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="text-center mb-8 max-w-sm">
                    <h2 className="text-2xl font-bold text-white mb-2">Error Message here</h2>
                    <h3 className="text-xl font-semibold text-white/90 mb-4">PAGE NOT FOUND</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Oops! The page you're looking for seems to have wandered off to the dance floor.
                        Let's get you back to the party!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-3">
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go to Home</span>
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
                <p className="text-white/50 text-xs">
                    © 2024 ClubViz. Keep the party going!
                </p>
            </div>
        </div>
    );
}