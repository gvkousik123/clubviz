'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StoryViewer } from '@/components/story/story-viewer';

// Mock story data - Updated with story folder images and internal stories
const mockStories = [
    {
        id: '1',
        image: '/story/story1.png',
        title: 'CLUB AMBIENCE',
        timestamp: '2 hours ago',
        duration: 5,
        internalStories: [
            { id: '1-1', image: '/story/story1.png', duration: 5 },
            { id: '1-2', image: '/story/Story2.png', duration: 5 },
            { id: '1-3', image: '/story/story3.png', duration: 5 },
        ],
    },
    {
        id: '2',
        image: '/story/Story2.png',
        title: 'NIGHT VIBES',
        timestamp: '4 hours ago',
        duration: 5,
        internalStories: [
            { id: '2-1', image: '/story/Story2.png', duration: 5 },
            { id: '2-2', image: '/story/story 2.png', duration: 5 },
        ],
    },
    {
        id: '3',
        image: '/story/story3.png',
        title: 'FOOD EXPERIENCE',
        timestamp: '6 hours ago',
        duration: 5,
        internalStories: [
            { id: '3-1', image: '/story/story3.png', duration: 5 },
            { id: '3-2', image: '/story/story1.png', duration: 5 },
            { id: '3-3', image: '/story/Story2.png', duration: 5 },
            { id: '3-4', image: '/story/story 2.png', duration: 5 },
        ],
    },
    {
        id: '4',
        image: '/story/story 2.png',
        title: 'DRINKS & BAR',
        timestamp: '8 hours ago',
        duration: 5,
        internalStories: [
            { id: '4-1', image: '/story/story 2.png', duration: 5 },
            { id: '4-2', image: '/story/story3.png', duration: 5 },
        ],
    },
];

function StoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0;

    const [stories] = useState(mockStories);

    const handleClose = () => {
        router.back();
    };

    const handleNext = (storyIndex: number, internalIndex: number) => {
        // Update URL to reflect current story
        const newStoryId = stories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
        }
    };

    const handlePrevious = (storyIndex: number, internalIndex: number) => {
        // Update URL to reflect current story
        const newStoryId = stories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
        }
    };

    return (
        <StoryViewer
            stories={stories}
            initialIndex={initialIndex}
            onClose={handleClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading stories...</p>
            </div>
        </div>
    );
}

export default function StoriesPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <StoryContent />
        </Suspense>
    );
}