'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface InternalStory {
    id: string;
    image: string;
    duration?: number; // in seconds, default 5
}

interface Story {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    duration?: number; // in seconds, default 5
    internalStories?: InternalStory[]; // Array of internal stories
}

interface StoryViewerProps {
    stories: Story[];
    initialIndex?: number;
    onClose: () => void;
    onNext?: (storyIndex: number, internalIndex: number) => void;
    onPrevious?: (storyIndex: number, internalIndex: number) => void;
}

export function StoryViewer({
    stories,
    initialIndex = 0,
    onClose,
    onNext,
    onPrevious
}: StoryViewerProps) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
    const [currentInternalIndex, setCurrentInternalIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const currentStory = stories[currentStoryIndex];
    const internalStories = currentStory?.internalStories || [{ id: currentStory?.id || '', image: currentStory?.image || '', duration: currentStory?.duration }];
    const currentInternalStory = internalStories[currentInternalIndex];
    const storyDuration = (currentInternalStory?.duration || 5) * 1000; // Convert to milliseconds

    // Auto-progress through stories
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + (100 / (storyDuration / 100));

                if (newProgress >= 100) {
                    // Current internal story completed, move to next
                    if (currentInternalIndex < internalStories.length - 1) {
                        // Move to next internal story within the same story group
                        setCurrentInternalIndex(prev => prev + 1);
                        return 0;
                    } else {
                        // All internal stories completed, move to next story group
                        if (currentStoryIndex < stories.length - 1) {
                            setCurrentStoryIndex(prev => prev + 1);
                            setCurrentInternalIndex(0);
                            onNext?.(currentStoryIndex + 1, 0);
                            return 0;
                        } else {
                            // All stories completed
                            onClose();
                            return 100;
                        }
                    }
                }

                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentStoryIndex, currentInternalIndex, isPaused, stories.length, internalStories.length, storyDuration, onClose, onNext]);

    // Reset progress when story changes
    useEffect(() => {
        setProgress(0);
    }, [currentStoryIndex, currentInternalIndex]);

    const handleNext = useCallback(() => {
        if (currentInternalIndex < internalStories.length - 1) {
            // Move to next internal story within the same story group
            setCurrentInternalIndex(prev => prev + 1);
            setProgress(0);
        } else if (currentStoryIndex < stories.length - 1) {
            // Move to next story group
            setCurrentStoryIndex(prev => prev + 1);
            setCurrentInternalIndex(0);
            onNext?.(currentStoryIndex + 1, 0);
            setProgress(0);
        } else {
            // All stories completed
            onClose();
        }
    }, [currentStoryIndex, currentInternalIndex, stories.length, internalStories.length, onNext, onClose]);

    const handlePrevious = useCallback(() => {
        if (currentInternalIndex > 0) {
            // Move to previous internal story within the same story group
            setCurrentInternalIndex(prev => prev - 1);
            setProgress(0);
        } else if (currentStoryIndex > 0) {
            // Move to previous story group (go to last internal story of previous group)
            const prevStory = stories[currentStoryIndex - 1];
            const prevInternalStories = prevStory?.internalStories || [{ id: prevStory?.id || '', image: prevStory?.image || '', duration: prevStory?.duration }];
            setCurrentStoryIndex(currentStoryIndex - 1);
            setCurrentInternalIndex(prevInternalStories.length - 1);
            onPrevious?.(currentStoryIndex - 1, prevInternalStories.length - 1);
            setProgress(0);
        }
    }, [currentStoryIndex, currentInternalIndex, stories, onPrevious]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            } else if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNext, handlePrevious, onClose]);

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

    if (!currentStory || !currentInternalStory) return null;

    return (
        <div className="fixed inset-0 bg-black z-50">
            <div className="w-full h-full relative overflow-hidden rounded-[20px]" style={{ backgroundImage: `url(${currentInternalStory.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                {/* User Profile Image from story folder */}
                <img
                    className="w-[37px] h-[37px] absolute left-[27px] top-[36px] rounded-full border border-[#E1CAFF] object-cover"
                    src="/vibemeter/Screenshot_2025-05-16_192139-removebg-preview.png"
                    alt="User"
                />

                {/* Progress Bars for Internal Stories */}
                <div className="absolute left-[84px] right-[24px] top-[53px] flex gap-2">
                    {internalStories.map((_, index) => (
                        <div key={index} className="flex-1 h-1 relative max-w-[96px]">
                            <div className="w-full h-1 bg-white/25 rounded-[24px]"></div>
                            <div
                                className="h-1 absolute left-0 top-0 bg-white rounded-[24px] transition-all duration-100 ease-linear"
                                style={{
                                    width: index < currentInternalIndex ? '100%' :
                                        index === currentInternalIndex ? `${progress}%` : '0%'
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Story Title Button */}
                <div className="absolute left-1/2 top-[862px] transform -translate-x-1/2 flex justify-center items-start">
                    <div className="h-[39px] px-4 py-0.5 bg-[#014A4B] rounded-[30px] border-2 border-[#0FD8E2] flex justify-center items-center gap-2.5">
                        <div className="text-white text-xs font-bold font-['Manrope'] leading-5 tracking-[0.12px] text-center whitespace-nowrap">
                            {currentStory.title}
                        </div>
                    </div>
                </div>


                {/* Tap Areas for navigation */}
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
        </div>
    );
}