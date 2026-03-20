'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StoryViewer } from './story-viewer';

interface InternalStory {
    id: string;
    image: string;
    duration?: number;
    type?: 'image' | 'video';
}

interface Story {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    duration?: number;
    internalStories?: InternalStory[];
}

interface StoryOverlayProps {
    isOpen: boolean;
    stories: Story[];
    initialIndex?: number;
    onClose: () => void;
}

export function StoryOverlay({
    isOpen,
    stories,
    initialIndex = 0,
    onClose
}: StoryOverlayProps) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentStoryIndex(initialIndex);
    }, [initialIndex, isOpen]);

    if (!isOpen) return null;

    const currentStory = stories[currentStoryIndex];
    const storyCount = currentStory?.internalStories?.length || 1;
    const totalStories = stories.length;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            {/* Story Viewer Container */}
            <div className="w-full h-full max-w-md max-h-screen flex items-center justify-center">
                <StoryViewer
                    stories={stories}
                    initialIndex={currentStoryIndex}
                    onClose={onClose}
                    onNext={(storyIndex) => setCurrentStoryIndex(storyIndex)}
                    onPrevious={(storyIndex) => setCurrentStoryIndex(storyIndex)}
                />
            </div>
        </div>
    );
}
