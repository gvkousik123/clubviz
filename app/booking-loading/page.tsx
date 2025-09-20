'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Ticket, CreditCard, Calendar } from 'lucide-react';

export default function BookingLoadingPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { icon: CreditCard, text: "Processing payment..." },
        { icon: Calendar, text: "Confirming availability..." },
        { icon: Ticket, text: "Generating your ticket..." }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Redirect to ticket confirmation after completion
                    setTimeout(() => {
                        router.push('/ticket-confirmation');
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        return () => clearInterval(timer);
    }, [router]);

    useEffect(() => {
        if (progress >= 33 && currentStep < 1) {
            setCurrentStep(1);
        } else if (progress >= 66 && currentStep < 2) {
            setCurrentStep(2);
        }
    }, [progress, currentStep]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Loading Animation */}
                <div className="text-center mb-12">
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
                                <Loader2 className="w-12 h-12 text-white animate-spin" />

                                {/* Orbit dots */}
                                <div className="absolute inset-0 rounded-full border-2 border-transparent">
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-white text-2xl font-bold mb-4">Booking Your Ticket</h2>
                    <p className="text-white/60 mb-8">Please wait while we process your booking</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="bg-white/10 rounded-full h-2 mb-4">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-center">
                        <span className="text-white/80 text-sm">{Math.round(progress)}% Complete</span>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div
                                key={index}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${isActive
                                        ? 'bg-white/10 border border-white/20'
                                        : 'bg-white/5 border border-white/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                        ? 'bg-green-500'
                                        : isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            : 'bg-white/10'
                                    }`}>
                                    {isCompleted ? (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/40'}`} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className={`font-medium transition-all duration-500 ${isActive ? 'text-white' : 'text-white/40'
                                        }`}>
                                        {step.text}
                                    </p>
                                </div>

                                {isActive && !isCompleted && (
                                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Text */}
                <div className="mt-12 text-center">
                    <p className="text-white/40 text-sm">
                        This usually takes a few seconds
                    </p>
                </div>
            </div>
        </div>
    );
}