'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, X, Heart, Share, Download, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

    const galleryImages = [
        {
            id: 1,
            src: "/purple-neon-club-interior.jpg",
            alt: "Purple neon club interior",
            likes: 234,
            category: "Interior"
        },
        {
            id: 2,
            src: "/crowded-nightclub-with-red-lighting-and-people-dan.jpg",
            alt: "Crowded nightclub with red lighting",
            likes: 156,
            category: "Events"
        },
        {
            id: 3,
            src: "/upscale-club-interior-with-blue-lighting.jpg",
            alt: "Upscale club interior with blue lighting",
            likes: 189,
            category: "Interior"
        },
        {
            id: 4,
            src: "/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg",
            alt: "DJ woman with headphones",
            likes: 345,
            category: "DJ"
        },
        {
            id: 5,
            src: "/red-neon-lounge-interior.jpg",
            alt: "Red neon lounge interior",
            likes: 167,
            category: "Interior"
        },
        {
            id: 6,
            src: "/upscale-bar-interior-with-bottles.jpg",
            alt: "Upscale bar interior",
            likes: 223,
            category: "Bar"
        },
        {
            id: 7,
            src: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg",
            alt: "DJ event poster",
            likes: 278,
            category: "Events"
        },
        {
            id: 8,
            src: "/night-party-event-poster-with-purple-and-pink-neon.jpg",
            alt: "Night party event poster",
            likes: 198,
            category: "Events"
        }
    ];

    const categories = ["All", "Interior", "Events", "DJ", "Bar"];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredImages = selectedCategory === "All"
        ? galleryImages
        : galleryImages.filter(img => img.category === selectedCategory);

    const toggleLike = (imageId: number) => {
        setLikedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageId)) {
                newSet.delete(imageId);
            } else {
                newSet.add(imageId);
            }
            return newSet;
        });
    };

    const openImageModal = (index: number) => {
        setSelectedImage(index);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const currentImage = selectedImage !== null ? filteredImages[selectedImage] : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <Link href="/clubs/dabo">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-white text-lg font-semibold">Gallery</h1>
                <div className="w-6" />
            </div>

            {/* Category Filter */}
            <div className="px-6 mb-6">
                <div className="flex space-x-3 pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="px-6 pb-20">
                <div className="grid grid-cols-2 gap-4">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative aspect-square rounded-2xl group cursor-pointer"
                            onClick={() => openImageModal(index)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover rounded-2xl"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute top-3 right-3">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                </div>

                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded-full">
                                            {image.category}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Heart className="w-4 h-4 text-white/80" />
                                            <span className="text-white text-xs">{image.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage !== null && currentImage && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-6">
                        {/* Close Button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-6 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center z-10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Image */}
                        <div className="relative w-full h-full max-w-4xl">
                            <Image
                                src={currentImage.src}
                                alt={currentImage.alt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full">
                                    {currentImage.category}
                                </span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => toggleLike(currentImage.id)}
                                        className={`flex items-center space-x-1 transition-colors ${likedImages.has(currentImage.id) ? 'text-red-400' : 'text-white/80'
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${likedImages.has(currentImage.id) ? 'fill-current' : ''}`}
                                        />
                                        <span className="text-sm">{currentImage.likes}</span>
                                    </button>

                                    <button className="text-white/80 hover:text-white transition-colors">
                                        <Share className="w-5 h-5" />
                                    </button>

                                    <button className="text-white/80 hover:text-white transition-colors">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        {selectedImage > 0 && (
                            <button
                                onClick={() => setSelectedImage(selectedImage - 1)}
                                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center"
                            >
                                <ArrowLeft className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {selectedImage < filteredImages.length - 1 && (
                            <button
                                onClick={() => setSelectedImage(selectedImage + 1)}
                                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center"
                            >
                                <ArrowLeft className="w-6 h-6 text-white rotate-180" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}