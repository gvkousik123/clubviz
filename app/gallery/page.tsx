'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GalleryPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ['All', 'Food', 'Drinks', 'Ambience'];

    // Gallery data using actual Frame images
    const galleryItems = [
        {
            id: 1,
            image: '/gallery/Frame 1000001117.jpg',
            category: 'Ambience',
            alt: 'Club ambience and interior'
        },
        {
            id: 2,
            image: '/gallery/Frame 1000001119.jpg',
            category: 'Ambience',
            alt: 'Club lighting and atmosphere'
        },
        {
            id: 3,
            image: '/gallery/Frame 1000001120.jpg',
            category: 'Food',
            alt: 'Club food and cuisine'
        },
        {
            id: 4,
            image: '/gallery/Frame 1000001121.jpg',
            category: 'Drinks',
            alt: 'Club drinks and beverages'
        },
        {
            id: 5,
            image: '/gallery/Frame 1000001123.jpg',
            category: 'Ambience',
            alt: 'Club interior design'
        },
        {
            id: 6,
            image: '/gallery/Frame 1000001124.jpg',
            category: 'Food',
            alt: 'Delicious club food'
        },
        {
            id: 7,
            image: '/gallery/Frame 1000001126.jpg',
            category: 'Drinks',
            alt: 'Cocktails and beverages'
        },
        {
            id: 8,
            image: '/gallery/Frame 1000001127.jpg',
            category: 'Ambience',
            alt: 'Club vibe and atmosphere'
        },
        {
            id: 9,
            image: '/gallery/Frame 1000001128.jpg',
            category: 'Food',
            alt: 'Gourmet club dining'
        },
        {
            id: 10,
            image: '/gallery/Frame 1000001129.jpg',
            category: 'Drinks',
            alt: 'Premium beverages'
        },
        {
            id: 11,
            image: '/gallery/Frame 1000001131.jpg',
            category: 'Ambience',
            alt: 'Club entertainment area'
        },
        {
            id: 12,
            image: '/gallery/Frame 1000001132.jpg',
            category: 'Food',
            alt: 'Fine dining experience'
        },
        {
            id: 13,
            image: '/gallery/Frame 1000001133.jpg',
            category: 'Ambience',
            alt: 'Club social space'
        }
    ];

    // Filter gallery items based on active category
    const filteredItems = activeCategory === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    // Modal functions
    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

    const nextImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
        }
    };

    const prevImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isModalOpen) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isModalOpen, selectedImageIndex, filteredItems.length]);

    return (
        <div className="min-h-screen w-full bg-[#031414] relative">
            {/* Fixed Header with Photos section */}
            <div className="fixed top-0 left-0 w-full h-[16vh] bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-b-[30px] z-40 flex flex-col justify-between">
                {/* Header Content */}
                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="w-[35px] h-[35px] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                    >
                        <span className="text-white text-lg font-bold">&lt;</span>
                    </button>
                </div>
                <div className="text-center px-6 flex-1 flex flex-col justify-center">
                    <div className="text-white text-xl font-['Manrope'] font-bold leading-6 tracking-[0.50px] break-words -mt-2">DABO CLUB & KITCHEN</div>
                    <h2 className="text-white text-lg font-['Manrope'] font-semibold leading-6 tracking-[0.50px] mt-4">Photos</h2>
                </div>
            </div>

            {/* Fixed Filter Section - positioned right below header */}
            <div className="fixed top-[16vh] left-0 w-full h-[6vh] px-6 bg-[#031414] z-30 flex items-center">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`h-8 px-3 py-1 rounded-[20px] border flex items-center justify-center gap-1 whitespace-nowrap transition-colors ${activeCategory === category
                                ? 'bg-[#14FFEC] border-[#004342] text-black font-semibold'
                                : 'bg-[#004342] border-[#14FFEC] text-white font-medium hover:bg-[#005F57]'
                                }`}
                        >
                            <div className="text-xs tracking-[0.5px]">{category}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid starting right below fixed sections */}
            <div className="pt-[22vh] px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                    {filteredItems.map((item, index) => {
                        // Pattern: full (0), half (1,2), half (3,4), full (5), half (6,7), half (8,9), full (10), etc.
                        // Every 5th item starting from 0 is full width: 0, 5, 10, 15...
                        const isFullWidth = index % 5 === 0;

                        return (
                            <div
                                key={item.id}
                                onClick={() => openModal(index)}
                                className={`
                                    ${isFullWidth ? 'col-span-2 h-48' : 'h-32'}
                                    relative overflow-hidden rounded-[15px] cursor-pointer
                                    transition-transform duration-300 hover:scale-105
                                `}
                            >
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay gradient for better text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* Category label - only show when "All" is selected */}
                                {activeCategory === 'All' && (
                                    <div className="absolute bottom-2 left-2">
                                        <span className="bg-[#14FFEC]/20 backdrop-blur-sm text-[#14FFEC] text-xs font-semibold px-2 py-1 rounded-full border border-[#14FFEC]/30">
                                            {item.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Image Viewer Modal */}
            {isModalOpen && selectedImageIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    {/* Modal Header */}
                    <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-10">
                        <h2 className="text-white text-lg font-semibold">All Photos</h2>
                        <button
                            onClick={closeModal}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Main Image */}
                    <div className="relative max-w-4xl max-h-[80vh] mx-6">
                        <img
                            src={filteredItems[selectedImageIndex].image}
                            alt={filteredItems[selectedImageIndex].alt}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeModal}
                    />
                </div>
            )}
        </div>
    );
}
