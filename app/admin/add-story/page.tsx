'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import '../new-event/styles.css';

export default function AddStoryPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null as File | null
    });

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
        }
    };

    const handleSave = () => {
        console.log('Saving story:', formData);
        router.back();
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Add Club Story</h1>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Fixed header section that stays in place */}
                    <div className="w-full bg-[#021313] rounded-t-[40px]">
                        {/* Heading container */}
                        <div className="w-full pb-2">
                            <div className="flex items-center justify-center pt-8 pb-4">
                                <h2 className="text-[28px] font-bold text-white text-center tracking-wider font-['Anton']">
                                    DABO CLUB & KITCHEN
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Scrollable content area */}
                    <div className="px-6 pb-36 overflow-y-auto h-[calc(100vh-220px)] scrollbar-hide">
                        <div className="space-y-6">
                            {/* Story Title */}
                            <div className="space-y-3">
                                <div className="px-1">
                                    <label className="text-[#14FFEC] font-semibold text-base">Story Title</label>
                                </div>
                                <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                        placeholder="Enter Story Title"
                                    />
                                </div>
                            </div>

                            {/* Story Description */}
                            <div className="space-y-3">
                                <div className="px-1">
                                    <label className="text-[#14FFEC] font-semibold text-base">Story Description</label>
                                </div>
                                <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-[10px] px-5">
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold min-h-[120px]"
                                        placeholder="Enter Story Description"
                                    />
                                </div>
                            </div>

                            {/* Story Image Upload */}
                            <div className="space-y-3">
                                <div className="px-1">
                                    <label className="text-[#14FFEC] font-semibold text-base">Story Image</label>
                                </div>
                                <div
                                    onClick={handleImageUpload}
                                    className="w-full h-[180px] bg-[#0D1F1F] border border-dashed border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center cursor-pointer"
                                >
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14FFEC] mb-2">
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                                            <line x1="16" y1="5" x2="22" y2="5" />
                                            <line x1="19" y1="2" x2="19" y2="8" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                        <p className="text-[#14FFEC] text-sm font-medium">Upload Story Image</p>
                                        <p className="text-gray-400 text-xs mt-1">Click to select image</p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Button */}
                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <div className="w-full h-[80px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                            <div className="flex justify-center items-center px-8 h-full">
                                <div className="w-[220px] h-[45px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                                    <button
                                        onClick={handleSave}
                                        className="w-full h-full flex justify-center items-center cursor-pointer"
                                    >
                                        <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                            Save Story
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}