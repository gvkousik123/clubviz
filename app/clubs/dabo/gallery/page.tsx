'use client';

import React, { useState } from 'react';
import { ArrowLeft, X, Download, Share2, Heart, ZoomIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DaboGalleryPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [currentFilter, setCurrentFilter] = useState('All');

    const galleryImages = [
        {
            id: 1,
            src: '/red-neon-lounge-interior.jpg',
            alt: 'DABO Interior',
            category: 'Interior',
            likes: 234
        },
        {
            id: 2,
            src: '/upscale-bar-interior-with-bottles.jpg',
            alt: 'Bar Area',
            category: 'Bar',
            likes: 189
        },
        {
            id: 3,
            src: '/purple-neon-club-interior.jpg',
            alt: 'Dance Floor',
            category: 'Dance Floor',
            likes: 312
        },
        {
            id: 4,
            src: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
            alt: 'Night Scene',
            category: 'Events',
            likes: 456
        },
        {
            id: 5,
            src: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
            alt: 'DJ Performance',
            category: 'Events',
            likes: 523
        },
        {
            id: 6,
            src: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
            alt: 'VIP Section',
            category: 'VIP',
            likes: 267
        }
    ];

    const filters = ['All', 'Interior', 'Bar', 'Dance Floor', 'Events', 'VIP'];

    const filteredImages = currentFilter === 'All'
        ? galleryImages
        : galleryImages.filter(img => img.category === currentFilter);

    const handleBack = () => {
        router.back();
    };

    const handleImageClick = (index: number) => {
        setSelectedImage(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleShare = (image: any) => {
        if (navigator.share) {
            navigator.share({
                title: `DABO - ${image.alt}`,
                text: 'Check out this amazing photo from DABO!',
                url: window.location.href,
            });
        }
    };

    const selectedImageData = selectedImage !== null ? filteredImages[selectedImage] : null;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
                <button
                    onClick={handleBack}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">DABO Gallery</h1>
                    <p className="text-white/60 text-sm">{filteredImages.length} photos</p>
                </div>

                <div className="w-12"></div>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 mb-6">
                <div className="flex space-x-3 pb-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setCurrentFilter(filter)}
                            className={`px-6 py-3 rounded-2xl whitespace-nowrap font-medium transition-all duration-300 ${currentFilter === filter
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.id}
                            onClick={() => handleImageClick(index)}
                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Like Count */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                <span className="text-white text-sm font-medium">{image.likes}</span>
                            </div>

                            {/* Zoom Icon */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Category Tag */}
                            <div className="absolute top-3 left-3 bg-purple-500/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                                <span className="text-white text-xs font-medium">{image.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage !== null && selectedImageData && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-12 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-60"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Image */}
                    <div className="relative max-w-4xl max-h-[80vh] mx-4">
                        <img
                            src={selectedImageData.src}
                            alt={selectedImageData.alt}
                            className="w-full h-full object-contain rounded-2xl"
                        />
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold text-lg">{selectedImageData.alt}</h3>
                                <p className="text-white/70 text-sm">{selectedImageData.category}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                    <span className="text-white font-medium">{selectedImageData.likes}</span>
                                </div>

                                <button
                                    onClick={() => handleShare(selectedImageData)}
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <Share2 className="w-5 h-5 text-white" />
                                </button>

                                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Download className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation dots */}
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {filteredImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === selectedImage ? 'bg-white' : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}