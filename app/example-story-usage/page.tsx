'use client';

import { StoriesSection } from '@/components/story';

// Example usage of the story components
export default function ExampleHomePage() {
    // Example story data - Using only the 4 story images from /story folder
    const stories = [
        {
            id: '1',
            image: '/story/story1.png',
            title: 'CLUB AMBIENCE',
            timestamp: '2 hours ago',
            clubName: 'Club Gallery',
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
            clubName: 'Gallery Club',
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
            clubName: 'Gallery Lounge',
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
            clubName: 'Gallery Bar',
            duration: 5,
            internalStories: [
                { id: '4-1', image: '/story/story 2.png', duration: 5 },
                { id: '4-2', image: '/story/story3.png', duration: 5 },
            ],
        },
    ];

    return (
        <div className="bg-background-primary min-h-screen">
            {/* Header */}
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                    ClubViz
                </h1>
                <p className="text-text-secondary">
                    Discover the hottest club stories
                </p>
            </div>

            {/* Stories Section */}
            <StoriesSection stories={stories} className="mb-6" />

            {/* Other content would go here */}
            <div className="px-4 py-6">
                <div className="bg-background-secondary rounded-lg p-6 mb-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-2">
                        How to use Stories
                    </h2>
                    <ul className="text-text-secondary space-y-2 text-sm">
                        <li>• Tap on any story circle to view it</li>
                        <li>• Tap left side to go to previous story</li>
                        <li>• Tap right side to go to next story</li>
                        <li>• Hold to pause the story</li>
                        <li>• Tap X to close and return</li>
                    </ul>
                </div>

                <div className="bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-2">
                        Experience the nightlife
                    </h3>
                    <p className="text-white/80 text-sm">
                        Check out the latest stories from the hottest clubs in your city.
                    </p>
                </div>
            </div>
        </div>
    );
}