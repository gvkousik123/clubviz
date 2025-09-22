'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface Story {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    duration?: number; // in seconds, default 5
}

interface StoryViewerProps {
    stories: Story[];
    initialIndex?: number;
    onClose: () => void;
    onNext?: (index: number) => void;
    onPrevious?: (index: number) => void;
}

export function StoryViewer({
    stories,
    initialIndex = 0,
    onClose,
    onNext,
    onPrevious
}: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const currentStory = stories[currentIndex];
    const storyDuration = (currentStory?.duration || 5) * 1000; // Convert to milliseconds

    // Auto-progress through stories
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + (100 / (storyDuration / 100));

                if (newProgress >= 100) {
                    // Story completed, move to next
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        onNext?.(currentIndex + 1);
                        return 0;
                    } else {
                        // All stories completed
                        onClose();
                        return 100;
                    }
                }

                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, stories.length, storyDuration, onClose, onNext]);

    // Reset progress when story changes
    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            onNext?.(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    }, [currentIndex, stories.length, onNext, onClose]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            onPrevious?.(currentIndex - 1);
            setProgress(0);
        }
    }, [currentIndex, onPrevious]);

    const handleTapLeft = () => {
        handlePrevious();
    };

    const handleTapRight = () => {
        handleNext();
    };

    const handleTouchStart = () => {
        setIsPaused(true);
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
    };

    if (!currentStory) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                {stories.map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                    >
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{
                                width: index < currentIndex ? '100%' :
                                    index === currentIndex ? `${progress}%` : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
                <X size={20} />
            </button>

            {/* Story Image */}
            <div className="relative flex-1">
                <Image
                    src={currentStory.image}
                    alt={currentStory.title}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                {/* Tap Areas */}
                <div className="absolute inset-0 flex">
                    {/* Left tap area (previous) */}
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={handleTapLeft}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />

                    {/* Right tap area (next) */}
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={handleTapRight}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-8 left-4 right-4 z-10">
                <div className="bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full px-6 py-3 inline-block">
                    <h2 className="text-white font-semibold text-lg tracking-wide uppercase">
                        {currentStory.title}
                    </h2>
                </div>

                {/* Story Info */}
                <div className="mt-4 text-white/80 text-sm">
                    <p>{currentStory.timestamp}</p>
                </div>
            </div>

            {/* Navigation Indicators (Optional) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrevious}
                        className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}

                <div className="px-3 py-1 bg-black/50 rounded-full text-white/70 text-xs font-medium">
                    {currentIndex + 1} / {stories.length}
                </div>
            </div>
        </div>
    );
}