'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import '../new-event/styles.css';

export default function AddStoryPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeCategory, setActiveCategory] = useState('Music Hashtags');
    const [showRecent, setShowRecent] = useState(true);

    // Gallery images from public/gallery folder
    const galleryImages = [
        '/gallery/Frame 1000001117.jpg',
        '/gallery/Frame 1000001119.jpg',
        '/gallery/Frame 1000001120.jpg',
        '/gallery/Frame 1000001121.jpg',
        '/gallery/Frame 1000001123.jpg',
        '/gallery/Frame 1000001124.jpg',
        '/gallery/Frame 1000001126.jpg',
        '/gallery/Frame 1000001127.jpg',
        '/gallery/Frame 1000001128.jpg'
    ];

    // Sample categories
    const categories = [
        'Music Hashtags',
        'Club Vibes',
        'DJ Performance',
        'Night Life'
    ];

    const handleGoBack = () => {
        router.back();
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

    const toggleRecent = () => {
        setShowRecent(!showRecent);
    };

    const handleCameraUpload = () => {
        fileInputRef.current?.click();
    };

    const handleImageSelect = (imagePath: string) => {
        console.log('Selected image:', imagePath);
        // Here you would handle the image selection logic
    };

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Header */}
            <div className="pt-6 px-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 bg-[#0D1F1F] rounded-full flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-xl font-semibold text-center flex-1 mr-10">Add to Story</h1>
                </div>
            </div>            {/* Category Selection */}
            <div className="mt-4 px-4">
                <div className="flex items-center justify-center">
                    <div className="bg-[#0D1F1F] py-2 px-6 rounded-full">
                        <span className="text-white font-medium">{activeCategory}</span>
                    </div>
                </div>
            </div>

            {/* Recent Toggle */}
            <div className="mt-8 px-6">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleRecent}
                >
                    <span className="text-white font-semibold">Recent</span>
                    <ChevronDown
                        className={`ml-2 text-white w-5 h-5 transition-transform ${showRecent ? 'transform rotate-180' : ''
                            }`}
                    />
                </div>
            </div>

            {/* Image Grid */}
            <div className="px-5 mt-4 pb-24">
                <div className="grid grid-cols-3 gap-2">
                    {/* Camera/Upload Box */}
                    <div
                        className="aspect-[3/5] bg-[#0D1F1F] rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={handleCameraUpload}
                    >
                        <div className="w-10 h-10 bg-[#14FFEC] rounded-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-black" />
                        </div>
                    </div>

                    {/* Gallery Images */}
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className={`aspect-[3/5] bg-[#0D1F1F] rounded-lg overflow-hidden cursor-pointer ${index === 1 ? 'border-2 border-[#14FFEC]' : ''
                                }`}
                            onClick={() => handleImageSelect(image)}
                        >
                            <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}