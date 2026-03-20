'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Camera, Building, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';

type ProfileFormState = {
    fullName: string;
    email: string;
    mobileNumber: string;
    profilePicture: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
};

const INITIAL_FORM_STATE: ProfileFormState = {
    fullName: '',
    email: '',
    mobileNumber: '',
    profilePicture: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
};

export default function EditProfilePage() {
    const router = useRouter();
    const {
        profile,
        currentUser,
        isProfileLoading,
        isLoading,
        loadProfile,
        updateProfile,
    } = useProfile();

    const [profileData, setProfileData] = useState<ProfileFormState>(INITIAL_FORM_STATE);

    // Load profile data on mount
    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // Update form when profile loads - properly map phoneNumber to mobileNumber
    useEffect(() => {
        if (profile || currentUser) {
            const phoneNum = (profile?.phoneNumber || currentUser?.phoneNumber || currentUser?.mobileNumber || '');
            setProfileData({
                fullName: profile?.fullName || currentUser?.fullName || '',
                email: profile?.email || currentUser?.email || '',
                mobileNumber: phoneNum,
                profilePicture: profile?.profilePicture || currentUser?.profilePicture || '',
                address: (profile as any)?.address || (currentUser as any)?.address || '',
                city: (profile as any)?.city || (currentUser as any)?.city || '',
                state: (profile as any)?.state || (currentUser as any)?.state || '',
                country: (profile as any)?.country || (currentUser as any)?.country || '',
                pincode: (profile as any)?.pincode || (currentUser as any)?.pincode || '',
            });
        }
    }, [profile, currentUser]);

    const progress = useMemo(() => {
        const requiredFields = ['fullName', 'email'] as (keyof ProfileFormState)[];
        const filled = requiredFields.filter((field) => profileData[field]?.trim().length > 0).length;
        return Math.min(100, Math.round((filled / requiredFields.length) * 100));
    }, [profileData]);

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = <K extends keyof ProfileFormState>(field: K, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            // Only send non-empty fields
            const updateData: any = {};
            if (profileData.fullName?.trim()) updateData.fullName = profileData.fullName.trim();
            if (profileData.email?.trim()) updateData.email = profileData.email.trim();
            // map mobileNumber field to mobileNumber for backend compatibility
            if (profileData.mobileNumber?.trim()) updateData.mobileNumber = profileData.mobileNumber.trim();
            if (profileData.profilePicture?.trim()) updateData.profilePicture = profileData.profilePicture.trim();
            if (profileData.address?.trim()) updateData.address = profileData.address.trim();
            if (profileData.city?.trim()) updateData.city = profileData.city.trim();
            if (profileData.state?.trim()) updateData.state = profileData.state.trim();
            if (profileData.country?.trim()) updateData.country = profileData.country.trim();
            if (profileData.pincode?.trim()) updateData.pincode = profileData.pincode.trim();

            await updateProfile(updateData);
            router.back();
        } catch (error) {
            // Error is handled by the hook with toast
        }
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            <div className="relative mx-auto  min-h-screen ">
                {/* Header Section with Gradient Background */}
                <div className="relative bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-bl-[30px] rounded-br-[30px] px-4 pt-4 pb-8">


                    {/* Back Button and Title */}
                    <div className="flex items-center justify-between px-4 mb-6">
                        <button
                            onClick={handleGoBack}
                            className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                        >
                            <span className="text-white text-lg font-bold">&lt;</span>
                        </button>
                        <h1 className="text-white text-xl font-manrope font-bold tracking-[0.50px] absolute left-1/2 transform -translate-x-1/2">EDIT PROFILE</h1>
                        <div className="w-[35px]"></div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-4 mb-6 mt-4">
                        <div className="relative">
                            <div className="w-full h-1 bg-white/20 rounded-full"></div>
                            <div
                                className="absolute top-0 left-0 h-1 bg-[#14FFEC] rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className="text-white text-[11px] font-manrope font-semibold tracking-[0.11px]">
                                {progress}% Complete
                            </span>
                        </div>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-[97px] h-[97px] rounded-full border-2 border-[#14FFEC]"></div>
                            {(profile?.profilePicture || currentUser?.profilePicture) ? (
                                <img
                                    className="absolute top-[6px] left-[6px] w-[85px] h-[85px] bg-[#D9D9D9] rounded-full object-cover"
                                    src={profile?.profilePicture || currentUser?.profilePicture}
                                    alt="Profile"
                                />
                            ) : (
                                <div className="absolute top-[6px] left-[6px] w-[85px] h-[85px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-[#021313] rounded-[16px] flex items-center justify-center">
                                <Camera className="w-4 h-4 text-[#14FFEC]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 space-y-6">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-base whitespace-nowrap">Personal Info</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        <div className="space-y-4">
                            {/* Full Name Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={profileData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* Mobile Number Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={profileData.mobileNumber}
                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-base whitespace-nowrap">Address</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        <div className="space-y-4">
                            {/* Address Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Building className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={profileData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* City Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-[#14FFEC]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={profileData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>

                            {/* State and Country */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={profileData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        className="flex-1 bg-transparent text-white text-sm font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                    />
                                </div>
                                <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={profileData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        className="flex-1 bg-transparent text-white text-sm font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Pincode Field */}
                            <div className="bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] px-5 py-3 flex items-center gap-5">
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    value={profileData.pincode}
                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    className="flex-1 bg-transparent text-white text-base font-manrope font-semibold placeholder-[#9D9C9C] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            disabled={isLoading || !profileData.fullName?.trim() || !profileData.email?.trim()}
                            className="w-full bg-[#14FFEC] text-black font-bold py-4 rounded-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
