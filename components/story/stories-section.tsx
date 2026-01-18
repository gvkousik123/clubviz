'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryCard } from './story-card';

interface Story {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    clubName?: string;
    isViewed?: boolean;
    duration?: number;
}

interface StoriesSectionProps {
    stories: Story[];
    className?: string;
}

export function StoriesSection({ stories, className = '' }: StoriesSectionProps) {
    const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleStoryClick = (storyId: string) => {
        // Mark story as viewed
        setViewedStories(prev => new Set(prev).add(storyId));
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            if (direction === 'left') {
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (!stories || stories.length === 0) {
        return null;
    }

    return (
        <div className={`stories-section ${className}`}>
            {/* Section Header - Vibe Meter */}
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-lg font-semibold text-white">Vibe Meter</h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#14FFEC] rounded-full"></div>
                    <span className="text-sm text-text-tertiary">
                        {stories.length} active
                    </span>
                </div>
            </div>

            {/* Stories Container */}
            <div className="relative px-4">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#14FFEC]/20 hover:bg-[#14FFEC]/40 rounded-full p-1.5 transition-colors"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-[#14FFEC]" />
                </button>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                >
                    {stories.map((story, index) => (
                        <div key={story.id} className="flex-shrink-0">
                            <StoryCard
                                id={story.id}
                                image={story.image}
                                title={story.title}
                                timestamp={story.timestamp}
                                clubName={story.clubName}
                                isViewed={viewedStories.has(story.id) || story.isViewed}
                                index={index}
                                onClick={() => handleStoryClick(story.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#14FFEC]/20 hover:bg-[#14FFEC]/40 rounded-full p-1.5 transition-colors"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-[#14FFEC]" />
                </button>

                {/* Gradient Fade on Right */}
                <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background-primary to-transparent pointer-events-none" />
            </div>
        </div>
    );
}