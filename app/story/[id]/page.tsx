'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
        title: 'DABO CLUB',
        timestamp: '6 hours ago',
        duration: 5,
    },
    {
        id: '4',
        image: '/upscale-bar-interior-with-bottles.jpg',
        title: 'CAFE BARREL',
        timestamp: '8 hours ago',
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

export default function StoryPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const storyId = params.id as string;
    const initialIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0;

    const [stories, setStories] = useState(mockStories);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        // If storyId is provided, find the story and set initial index
        if (storyId) {
            const storyIndex = stories.findIndex(story => story.id === storyId);
            if (storyIndex !== -1) {
                setCurrentIndex(storyIndex);
            }
        }
    }, [storyId, stories]);

    const handleClose = () => {
        router.back();
    };

    const handleNext = (index: number) => {
        setCurrentIndex(index);
        // Update URL to reflect current story
        const newStoryId = stories[index]?.id;
        if (newStoryId) {
            router.replace(`/story/${newStoryId}?index=${index}`, { scroll: false });
        }
    };

    const handlePrevious = (index: number) => {
        setCurrentIndex(index);
        // Update URL to reflect current story
        const newStoryId = stories[index]?.id;
        if (newStoryId) {
            router.replace(`/story/${newStoryId}?index=${index}`, { scroll: false });
        }
    };

    return (
        <StoryViewer
            stories={stories}
            initialIndex={currentIndex}
            onClose={handleClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
    );
}