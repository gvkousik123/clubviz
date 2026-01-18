'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { StoryViewer } from '@/components/story/story-viewer';
import { StoryService } from '@/lib/services/story.service';
import { Story } from '@/lib/api-types';

interface DisplayStory {
    id: string;
    image: string;
    title: string;
    timestamp: string;
    clubName?: string;
    duration: number;
    internalStories: { id: string; image: string; duration: number }[];
}

export default function StoryPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const storyId = params.id as string;
    const initialIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0;

    const [stories, setStories] = useState<DisplayStory[]>([]);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                // Fetch all stories from API
                const response = await StoryService.getStories(0, 50);
                console.log('📚 Story Page - Fetched stories:', response);

                if (response.success && response.data) {
                    const apiStories = response.data as any;
                    const content = Array.isArray(apiStories) ? apiStories : (apiStories.content || []);

                    console.log('📚 Story Page - Content array:', content);

                    // Transform API stories to display format
                    const displayStories: DisplayStory[] = content.map((story: Story) => {
                        const mediaUrl = story.mediaUrl || story.mediaUrl1 || story.mediaUrl2 || story.mediaBase64 || '';
                        return {
                            id: story.id,
                            image: mediaUrl,
                            title: story.title || story.caption || story.club?.name || 'Story',
                            timestamp: new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            clubName: story.club?.name || story.userFullName || 'Story',
                            duration: story.duration || 5,
                            internalStories: [
                                { id: story.id, image: mediaUrl, duration: story.duration || 5 }
                            ]
                        };
                    });

                    console.log('📚 Story Page - Display stories:', displayStories);
                    setStories(displayStories);

                    // Find the current story by ID
                    if (storyId) {
                        const storyIndex = displayStories.findIndex(s => s.id === storyId);
                        if (storyIndex !== -1) {
                            setCurrentIndex(storyIndex);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch stories:', error);
                // Fallback to empty state or error handling
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [storyId]);

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

    if (loading) {
        return (
            <div className="w-full h-screen bg-background-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading story...</p>
                </div>
            </div>
        );
    }

    if (!stories || stories.length === 0) {
        return (
            <div className="w-full h-screen bg-background-primary flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-4">No stories available</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-primary-500 text-white rounded"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

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