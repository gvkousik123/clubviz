'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { StoryViewer } from '@/components/story/story-viewer';

// Mock story data - Using only the 4 story images from /story folder
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
            { id: '3-2', image: '/story/story 2.png', duration: 5 },
            { id: '3-3', image: '/story/story1.png', duration: 5 },
            { id: '3-4', image: '/story/Story2.png', duration: 5 },
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

    const handleNext = (storyIndex: number, internalIndex: number) => {
        setCurrentIndex(storyIndex);
        // Update URL to reflect current story
        const newStoryId = stories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story/${newStoryId}?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
        }
    };

    const handlePrevious = (storyIndex: number, internalIndex: number) => {
        setCurrentIndex(storyIndex);
        // Update URL to reflect current story
        const newStoryId = stories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story/${newStoryId}?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
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