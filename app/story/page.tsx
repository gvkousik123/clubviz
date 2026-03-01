'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StoryViewer } from '@/components/story/story-viewer';
import { useStories } from '@/hooks/use-stories';
import { Story } from '@/lib/api-types';

function StoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { stories, loading, fetchStories } = useStories();

    const initialIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0;

    useEffect(() => {
        // Fetch all active stories on mount
        fetchStories(0, 100);
    }, [fetchStories]);

    // Convert API stories to viewer format
    const viewerStories = stories.map((story: Story) => ({
        id: story.id,
        image: story.mediaUrl || '',
        title: story.caption || 'Story',
        timestamp: formatTimestamp(story.createdAt),
        duration: story.mediaType === 'VIDEO' ? undefined : 5, // Let video use its actual duration
        internalStories: [
            {
                id: story.id,
                image: story.mediaUrl || '',
                duration: story.mediaType === 'VIDEO' ? undefined : 5, // Let video use its actual duration
                type: story.mediaType === 'VIDEO' ? 'video' : 'image'
            }
        ],
    }));

    function formatTimestamp(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        }
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }
        return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) !== 1 ? 's' : ''} ago`;
    }

    const handleClose = () => {
        router.back();
    };

    const handleNext = (storyIndex: number, internalIndex: number) => {
        // Update URL to reflect current story
        const newStoryId = viewerStories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
        }
    };

    const handlePrevious = (storyIndex: number, internalIndex: number) => {
        // Update URL to reflect current story
        const newStoryId = viewerStories[storyIndex]?.id;
        if (newStoryId) {
            router.replace(`/story?index=${storyIndex}&internal=${internalIndex}`, { scroll: false });
        }
    };

    if (loading && stories.length === 0) {
        return <LoadingFallback />;
    }

    if (!loading && viewerStories.length === 0) {
        return (
            <div className="min-h-screen bg-[#021313] flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-white text-2xl font-bold mb-4">No Active Stories</h2>
                    <p className="text-gray-400 mb-6">Check back later for new stories</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-[#14FFEC] text-black rounded-lg font-semibold hover:bg-[#14FFEC]/80 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <StoryViewer
            stories={viewerStories}
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