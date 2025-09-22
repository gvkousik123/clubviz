'use client';

import { StoriesSection } from '@/components/story';

// Example usage of the story components
export default function ExampleHomePage() {
    // Example story data
    const stories = [
        {
            id: '1',
            image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
            title: 'TECHNO NIGHT',
            timestamp: '2 hours ago',
            clubName: 'Club Neon',
            duration: 5,
        },
        {
            id: '2',
            image: '/purple-neon-club-interior.jpg',
            title: 'NEON VIBES',
            timestamp: '4 hours ago',
            clubName: 'Purple Haze',
            duration: 5,
        },
        {
            id: '3',
            image: '/upscale-club-interior-with-blue-lighting.jpg',
            title: 'BLUE LOUNGE',
            timestamp: '6 hours ago',
            clubName: 'Blue Moon',
            duration: 5,
        },
        {
            id: '4',
            image: '/red-neon-lounge-interior.jpg',
            title: 'RED ZONE',
            timestamp: '8 hours ago',
            clubName: 'Red Light',
            duration: 5,
        },
        {
            id: '5',
            image: '/upscale-bar-interior-with-bottles.jpg',
            title: 'COCKTAIL BAR',
            timestamp: '10 hours ago',
            clubName: 'The Mixer',
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