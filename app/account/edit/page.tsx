'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, MapPin, Calendar, Music } from 'lucide-react';

type ProfileFormState = {
    name: string;
    email: string;
    gender: string;
    city: string;
    dateOfBirth: string;
    musicGenre: string;
    clubType: string;
};

const INITIAL_FORM_STATE: ProfileFormState = {
    name: '',
    email: '',
    gender: '',
    city: '',
    dateOfBirth: '',
    musicGenre: '',
    clubType: '',
};

export default function EditProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileFormState>(INITIAL_FORM_STATE);

    const progress = useMemo(() => {
        const values = Object.values(profileData);
        const filled = values.filter((value) => value.trim().length > 0).length;
        if (!values.length) return 0;
        return Math.min(100, Math.round((filled / values.length) * 100));
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

    return (
        <div className="w-full h-full relative bg-[#021313] overflow-hidden rounded-[20px]">
            {/* Header Section with Gradient Background */}
            <div className="w-[430px] h-[276px] absolute left-0 top-0 bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-bl-[30px] rounded-br-[30px]">

                {/* Status Bar */}
                <div className="w-[355px] absolute left-[38px] top-[18px] flex justify-between items-center">
                    <div className="text-[#FFFCFC] text-[15px] font-manrope font-semibold leading-[21px]">9:41</div>
                    <div className="flex justify-start items-start gap-[2px]">
                        <div className="w-5 h-4 relative"></div>
                        <div className="w-4 h-4 relative"></div>
                        <div className="w-[25px] h-4 relative overflow-hidden">
                            <div className="w-[22px] h-[11.33px] absolute left-[1px] top-[2px] opacity-35 rounded-[2.67px] border border-white"></div>
                            <div className="w-[1.33px] h-1 absolute left-6 top-[5.67px] opacity-40 bg-white"></div>
                            <div className="w-[18px] h-[7.33px] absolute left-[3px] top-1 bg-white rounded-[1.33px]"></div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={handleGoBack}
                    className="w-[35px] h-[35px] absolute left-4 top-24 rotate-[-90deg] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                >
                    <ArrowLeft className="w-4 h-2 rotate-90 text-white" strokeWidth={2} />
                </button>

                {/* Title */}
                <div className="w-[132px] absolute left-[149px] top-[77px] text-white text-xl font-manrope font-bold leading-4 tracking-[0.50px]">EDIT PROFILE</div>

                {/* Profile Picture Section */}
                <div className="w-[97px] h-[97px] absolute left-[166px] top-[154px]">
                    <div className="w-[97px] h-[97px] absolute left-0 top-0 rounded-full border-2 border-[#14FFEC]"></div>
                    <img className="w-[85px] h-[85px] absolute left-[6px] top-[6px] bg-[#D9D9D9] rounded-full" src="https://placehold.co/85x85" alt="Profile" />
                    <div className="w-[30px] h-[30px] absolute left-[67px] top-[67px] bg-[#021313] overflow-hidden rounded-2xl flex items-center justify-center">
                        <div className="w-4 h-[14px] bg-[#14FFEC]"></div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="absolute left-[323px] top-[129px] flex justify-center flex-col text-white text-[11.11px] font-manrope font-semibold leading-[21px] tracking-[0.11px]">{progress}% Complete</div>
            </div>

            {/* Personal Info Section */}
            <div className="w-[418px] h-[315px] absolute left-[6px] top-[276px] pt-4 pb-[10px] px-[10px] flex flex-col justify-start items-center gap-4">
                <div className="w-[375px] h-[13px] flex justify-center items-center gap-[10px]">
                    <div className="w-[106px] h-3 flex justify-center flex-col text-[#FFFEFF] text-base font-manrope font-semibold leading-4 tracking-[0.50px]">Personal Info</div>
                    <div className="w-[259px] h-0 border-[1.50px] border-[#0FD8E2]"></div>
                </div>

                <div className="self-stretch flex justify-start items-center gap-4 flex-wrap content-center">
                    {/* Name Field */}
                    <div className="w-[398px] h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <User className="w-[20.25px] h-[17.25px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Name"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="w-[398px] h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <Mail className="w-[20.25px] h-[15.75px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Email"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>

                    {/* Gender Field */}
                    <div className="w-[191px] h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <div className="w-[15.76px] h-[21px] bg-[#14FFEC]"></div>
                        </div>
                        <input
                            type="text"
                            value={profileData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            placeholder="Gender"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>

                    {/* City Field */}
                    <div className="w-[191px] h-[55px] py-[10px] pl-5 pr-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <MapPin className="w-[23.25px] h-[18.75px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="City"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>

                    {/* Date of Birth Field */}
                    <div className="w-[398px] h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <Calendar className="w-[18.75px] h-[20.25px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="text"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* My Preferences Section */}
            <div className="w-[398px] h-[157px] absolute left-4 top-[629px] flex flex-col justify-center items-center gap-4">
                <div className="w-[375px] h-[13px] flex justify-center items-center gap-[10px]">
                    <div className="w-[125px] h-3 flex justify-center flex-col text-[#FFFEFF] text-base font-manrope font-semibold leading-4 tracking-[0.50px]">My Preferences</div>
                    <div className="w-60 h-0 border-[1.50px] border-[#0FD8E2]"></div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    {/* Music Genre Field */}
                    <div className="self-stretch h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <Music className="w-[21.75px] h-[15.75px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="text"
                            value={profileData.musicGenre}
                            onChange={(e) => handleInputChange('musicGenre', e.target.value)}
                            placeholder="Music Genre"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>

                    {/* Club Type Field */}
                    <div className="self-stretch h-[55px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] flex justify-start items-center gap-5">
                        <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                            <Music className="w-[21.75px] h-[15.75px] text-[#14FFEC]" />
                        </div>
                        <input
                            type="text"
                            value={profileData.clubType}
                            onChange={(e) => handleInputChange('clubType', e.target.value)}
                            placeholder="Club Type"
                            className="bg-transparent border-none outline-none text-[#9D9C9C] text-base font-manrope font-semibold leading-4 tracking-[0.50px] flex-1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 
