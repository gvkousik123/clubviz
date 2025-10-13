'use client';

import { StoriesSection } from '@/components/story';

// Example usage of the story components
export default function ExampleHomePage() {
    // Example story data - Updated with gallery Frame images
    const stories = [
        {
            id: '1',
            image: '/gallery/Frame 1000001117.jpg',
            title: 'CLUB AMBIENCE',
            timestamp: '2 hours ago',
            clubName: 'Club Gallery',
            duration: 5,
        },
        {
            id: '2',
            image: '/gallery/Frame 1000001119.jpg',
            title: 'NIGHT VIBES',
            timestamp: '4 hours ago',
            clubName: 'Gallery Club',
            duration: 5,
        },
        {
            id: '3',
            image: '/gallery/Frame 1000001120.jpg',
            title: 'DINING EXPERIENCE',
            timestamp: '6 hours ago',
            clubName: 'Gallery Lounge',
            duration: 5,
        },
        {
            id: '4',
            image: '/gallery/Frame 1000001121.jpg',
            title: 'DRINKS & BAR',
            timestamp: '8 hours ago',
            clubName: 'Gallery Bar',
            duration: 5,
        },
        {
            id: '5',
            image: '/gallery/Frame 1000001123.jpg',
            title: 'INTERIOR DESIGN',
            timestamp: '10 hours ago',
            clubName: 'Design Club',
            duration: 5,
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