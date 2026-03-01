'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryItem {
    id: number;
    image: string;
    category: string;
    alt: string;
}

export default function GalleryPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
    const [modalCategory, setModalCategory] = useState('All');
    const headerRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [topOffset, setTopOffset] = useState<number>(0);



    const categories = ['All', 'Ambience', 'Food', 'Drinks'];

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
        setModalItems(filteredItems);
        setModalCategory(activeCategory);
        setSelectedImageIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };



    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
        setModalItems([]);
        setModalCategory('All');
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

    const nextImage = () => {
        if (selectedImageIndex !== null && modalItems.length > 0) {
            setSelectedImageIndex((selectedImageIndex + 1) % modalItems.length);
        }
    };

    const prevImage = () => {
        if (selectedImageIndex !== null && modalItems.length > 0) {
            setSelectedImageIndex((selectedImageIndex - 1 + modalItems.length) % modalItems.length);
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
    }, [isModalOpen, selectedImageIndex, modalItems.length]);

    // Measure header + filter heights and set padding for the gallery grid
    useEffect(() => {
        const calcTopOffset = () => {
            const h = headerRef.current?.getBoundingClientRect().height ?? 0;
            const f = filterRef.current?.getBoundingClientRect().height ?? 0;
            setTopOffset(Math.round(h + f));
        };

        calcTopOffset();
        window.addEventListener('resize', calcTopOffset);
        return () => window.removeEventListener('resize', calcTopOffset);
    }, []);


    return (
        <div className="min-h-screen w-full bg-[#031414] relative">
            {/* Fixed Header with Photos section */}
            <div ref={headerRef} className="fixed top-0 left-0 w-full h-[16vh] bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-b-[30px] z-40 flex flex-col justify-between">
                {/* Header Content */}
                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="w-[35px] h-[35px] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                    >
                        <span className="text-white text-lg font-bold">&lt;</span>
                    </button>
                </div>
                <div className="text-center px-6 flex-1 flex items-center justify-center">
                    <h2
                        className="font-extrabold text-[22px] leading-[20px] text-center text-white"
                        style={{
                            fontFamily: 'Anton, Anton SC, sans-serif',
                            fontWeight: 400,
                            fontSize: '24px',
                            letterSpacing: '0.0625em',
                            lineHeight: '32px',
                            textAlign: 'center',
                            color: '#ffffff'
                        }}
                    >
                        PHOTOS
                    </h2>
                </div>
            </div>

            {/* Fixed Filter Section - positioned right below header */}
            <div ref={filterRef} className="fixed top-[16vh] left-0 w-full h-[6vh] px-6 bg-[#031414] z-30 flex items-center">
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
            <div className="px-4 pb-6" style={{ paddingTop: topOffset }}>

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
            {isModalOpen && selectedImageIndex !== null && modalItems.length > 0 && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(13, 31, 31, 0.8)' }}
                >
                    {/* Modal Container */}
                    <div className="relative w-[90vw] max-w-[400px] h-[55vh] bg-[#0D1F1F] rounded-[20px] overflow-hidden flex flex-col shadow-[0_0_20px_rgba(20,255,236,0.3)]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/20 to-transparent">
                            <h2 className="text-white text-lg font-semibold">{modalCategory}</h2>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                            >
                                <img src="/common/Close.svg" alt="Close" className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Main Image Container */}
                        <div className="flex-1 relative flex items-center justify-center p-4">
                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
                            >
                                <img src="/common/CaretCircleLeft.svg" alt="Previous" className="w-8 h-8" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
                            >
                                <img src="/common/CaretCircleRight.svg" alt="Next" className="w-8 h-8" />
                            </button>

                            {/* Main Image */}
                            <img
                                src={modalItems[selectedImageIndex].image}
                                alt={modalItems[selectedImageIndex].alt}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </div>
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
