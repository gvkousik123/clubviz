'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { ClubVizLogo } from '@/components/auth/logo';
import { usePassword } from '@/hooks/use-password';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const {
        isInitiatingReset,
        isResettingPassword,
        forgotPassword,
        resetPasswordWithOTP,
        validatePassword,
        getPasswordStrength,
        getPasswordStrengthColor,
    } = usePassword();

    // State
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer for OTP resend
    useEffect(() => {
        if (step !== 'otp') return;
        setResendTimer(60);
        setCanResend(false);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step]);

    // Handle back navigation
    const handleGoBack = () => {
        if (step === 'email') {
            router.back();
        } else if (step === 'otp') {
            setStep('email');
        } else if (step === 'reset') {
            setStep('otp');
        } else {
            router.push('/auth/login');
        }
    };

    // Step 1: Submit email → call forgot-password API
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) {
            setOtp(Array(6).fill(''));
            setOtpError(null);
            setStep('otp');
        }
    };

    // Step 2: OTP input handlers
    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (otpError) setOtpError(null);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setOtpError('Please enter all 6 digits');
            return;
        }
        setStep('reset');
    };

    const handleResend = async () => {
        if (!canResend) return;
        await forgotPassword(email);
        setOtp(Array(6).fill(''));
        setOtpError(null);
    };

    // Step 3: Reset password → call reset-password API
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        const success = await resetPasswordWithOTP(email, otpValue, newPassword, confirmPassword);
        if (success) {
            setStep('success');
        }
    };

    // Password validation
    const passwordValidation = validatePassword(newPassword);
    const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;
    const strengthColor = passwordStrength ? getPasswordStrengthColor(passwordStrength) : '';

    return (
        <div className="min-h-screen bg-[#021313] text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <button
                    onClick={handleGoBack}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <ClubVizLogo />
                <div className="w-10 h-10" />
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-8">

                {/* ── Step 1: Email ── */}
                {step === 'email' && (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold">Forgot Password?</h1>
                            <p className="text-gray-400">
                                Enter your registered email and we&apos;ll send you an OTP to reset your password
                            </p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <Mail className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#14FFEC]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isInitiatingReset || !email.trim()}
                                className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isInitiatingReset ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-[#14FFEC] text-sm"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: OTP ── */}
                {step === 'otp' && (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold">Enter OTP</h1>
                            <p className="text-gray-400">
                                We sent a 6-digit code to
                            </p>
                            <p className="text-[#14FFEC] font-semibold">{email}</p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            {/* OTP boxes */}
                            <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={`w-12 h-14 text-center text-xl font-bold bg-[#0D1F1F] border rounded-xl text-white focus:outline-none transition-colors ${
                                            digit
                                                ? 'border-[#14FFEC]'
                                                : 'border-[#14FFEC]/30 focus:border-[#14FFEC]'
                                        }`}
                                    />
                                ))}
                            </div>

                            {otpError && (
                                <p className="text-red-400 text-sm text-center">{otpError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={otp.join('').length !== 6}
                                className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verify OTP
                            </button>
                        </form>

                        {/* Resend */}
                        <div className="text-center text-sm text-gray-400">
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    disabled={isInitiatingReset}
                                    className="text-[#14FFEC] font-semibold"
                                >
                                    {isInitiatingReset ? 'Sending...' : 'Resend OTP'}
                                </button>
                            ) : (
                                <span>
                                    Resend in{' '}
                                    <span className="text-[#14FFEC] font-semibold">{resendTimer}s</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Step 3: New Password ── */}
                {step === 'reset' && (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold">Reset Password</h1>
                            <p className="text-gray-400">
                                Set a new password for your account
                            </p>
                        </div>

                        <form onSubmit={handleResetSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* New Password */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#14FFEC] pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {newPassword && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Password Strength</span>
                                            <span className={`font-semibold ${strengthColor}`}>
                                                {passwordStrength?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    passwordStrength === 'weak'
                                                        ? 'bg-red-500 w-1/3'
                                                        : passwordStrength === 'medium'
                                                        ? 'bg-yellow-500 w-2/3'
                                                        : 'bg-green-500 w-full'
                                                }`}
                                            />
                                        </div>
                                        {!passwordValidation.isValid && (
                                            <div className="text-red-400 text-xs space-y-1">
                                                {passwordValidation.errors.map((err, i) => (
                                                    <div key={i}>• {err}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Confirm Password */}
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-[#0D1F1F] border border-[#14FFEC]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#14FFEC] pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-red-400 text-sm">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isResettingPassword ||
                                    !newPassword ||
                                    !confirmPassword ||
                                    newPassword !== confirmPassword ||
                                    !passwordValidation.isValid
                                }
                                className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Step 4: Success ── */}
                {step === 'success' && (
                    <div className="space-y-8 text-center">
                        <div className="space-y-4">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold">Password Reset Successful!</h1>
                            <p className="text-gray-400">
                                Your password has been reset successfully. You can now login with your new password.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-2xl"
                        >
                            Continue to Login
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
