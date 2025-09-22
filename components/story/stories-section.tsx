'use client';

import { useState } from 'react';
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

    const handleStoryClick = (storyId: string) => {
        // Mark story as viewed
        setViewedStories(prev => new Set(prev).add(storyId));
    };

    if (!stories || stories.length === 0) {
        return null;
    }

    return (
        <div className={`stories-section ${className}`}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-lg font-semibold text-text-primary">Stories</h2>
                <span className="text-sm text-text-tertiary">
                    {stories.length} active
                </span>
            </div>

            {/* Stories Container */}
            <div className="relative px-4">
                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
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

                {/* Gradient Fade on Right */}
                <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background-primary to-transparent pointer-events-none" />
            </div>
        </div>
    );
}