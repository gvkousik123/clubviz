'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Mail } from 'lucide-react';

export default function LoginScreen() {
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = () => {
        window.location.href = showEmailLogin ? '/home' : '/auth/verify';
    };

    const handleBack = () => {
        if (showEmailLogin) {
            setShowEmailLogin(false);
        } else {
            window.location.href = '/auth/intro';
        }
    };

    const handleGuestLogin = () => {
        window.location.href = '/home';
    };

    const handleSkip = () => {
        window.location.href = '/home';
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
            {/* Background with grid pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <button
                    onClick={handleBack}
                    className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center text-white hover:bg-blue-500/30 transition-colors shadow-lg"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-white hover:bg-blue-500/30 transition-all duration-300 font-medium shadow-lg"
                >
                    Skip
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8">
                {/* Logo Section */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl">
                        <div className="text-white text-3xl font-bold tracking-wider">CV</div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
                        CLUBVIZ
                    </h1>
                </div>

                {!showEmailLogin ? (
                    /* Phone Login View */
                    <div className="space-y-8 max-w-sm mx-auto w-full">
                        <div className="text-center mb-10">
                            <p className="text-white/70 text-sm leading-relaxed">
                                By login you are agreeing to{' '}
                                <span className="text-purple-400 underline">Terms & Condition</span>{' '}
                                and <span className="text-purple-400 underline">Privacy Policy</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.href = '/auth/verify'}
                                className="w-full py-5 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center gap-4 hover:bg-white/20 transition-all duration-300"
                            >
                                <Phone className="w-6 h-6" />
                                <span className="font-medium text-lg">Login with Mobile</span>
                            </button>

                            <button
                                onClick={() => setShowEmailLogin(true)}
                                className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center gap-4 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                            >
                                <Mail className="w-6 h-6" />
                                <span className="font-medium text-lg">Login with Email</span>
                            </button>
                        </div>

                        <div className="text-center pt-8">
                            <button
                                onClick={handleGuestLogin}
                                className="text-white/70 hover:text-white transition-colors underline"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Email Login Form */
                    <div className="space-y-8 max-w-sm mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-white/70">Sign in to your account</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 pr-14"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                onClick={handleLogin}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-white/70">
                                Don't have an account?{' '}
                                <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}