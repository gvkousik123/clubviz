'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StoryViewer } from '@/components/story/story-viewer';

// Mock story data - replace with your actual data source
const mockStories = [
    {
        id: '1',
        image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
        title: 'TECHNO NIGHT',
        timestamp: '2 hours ago',
        duration: 5,
    },
    {
        id: '2',
        image: '/purple-neon-club-interior.jpg',
        title: 'NEON VIBES',
        timestamp: '4 hours ago',
        duration: 5,
    },
    {
        id: '3',
        image: '/upscale-club-interior-with-blue-lighting.jpg',
        title: 'BLUE LOUNGE',
        timestamp: '6 hours ago',
        duration: 5,
    },
    {
        id: '4',
        image: '/red-neon-lounge-interior.jpg',
        title: 'RED ZONE',
        timestamp: '8 hours ago',
        duration: 5,
    },
    {
        id: '5',
        image: '/upscale-bar-interior-with-bottles.jpg',
        title: 'COCKTAIL BAR',
        timestamp: '10 hours ago',
        duration: 5,
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

    const handleNext = (index: number) => {
        // Update URL to reflect current story
        const newStoryId = stories[index]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${index}`, { scroll: false });
        }
    };

    const handlePrevious = (index: number) => {
        // Update URL to reflect current story
        const newStoryId = stories[index]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${index}`, { scroll: false });
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