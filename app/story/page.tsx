'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Play } from 'lucide-react';

export default function StoryPage() {
    const [currentStory, setCurrentStory] = useState(0);

    const stories = [
        {
            id: 1,
            title: "DABO Club Experience",
            image: "/red-neon-lounge-interior.jpg",
            duration: 15,
            viewed: false
        },
        {
            id: 2,
            title: "Weekend Vibes",
            image: "/purple-neon-club-interior.jpg",
            duration: 10,
            viewed: true
        },
        {
            id: 3,
            title: "DJ Night Special",
            image: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg",
            duration: 20,
            viewed: false
        }
    ];

    const nextStory = () => {
        if (currentStory < stories.length - 1) {
            setCurrentStory(currentStory + 1);
        } else {
            // Navigate back when all stories are viewed
            window.history.back();
        }
    };

    const prevStory = () => {
        if (currentStory > 0) {
            setCurrentStory(currentStory - 1);
        }
    };

    const story = stories[currentStory];

    return (
        <div className="relative h-screen w-full bg-black">
            {/* Story Image/Video */}
            <div className="relative h-full w-full">
                <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover"
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
            </div>

            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
                {stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${index < currentStory
                                    ? 'bg-white w-full'
                                    : index === currentStory
                                        ? 'bg-white w-3/4 animate-pulse'
                                        : 'bg-white/30 w-0'
                                }`}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <img
                            src="/placeholder-logo.svg"
                            alt="Club Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">DABO Club</h3>
                        <p className="text-white/80 text-sm">2h ago</p>
                    </div>
                </div>

                <Link href="/clubs">
                    <X className="w-6 h-6 text-white" />
                </Link>
            </div>

            {/* Story Content */}
            <div className="absolute bottom-20 left-4 right-4">
                <h2 className="text-white text-xl font-bold mb-2">{story.title}</h2>
                <p className="text-white/90 text-sm mb-4">
                    Experience the best nightlife at DABO Club with amazing music, drinks, and atmosphere!
                </p>

                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                    Book Now
                </button>
            </div>

            {/* Navigation Areas */}
            <button
                onClick={prevStory}
                className="absolute left-0 top-0 w-1/3 h-full z-10"
                disabled={currentStory === 0}
            />

            <button
                onClick={nextStory}
                className="absolute right-0 top-0 w-2/3 h-full z-10"
            />

            {/* Play Indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white ml-1" />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex space-x-4">
                    <button className="text-white">
                        ❤️ {Math.floor(Math.random() * 100) + 50}
                    </button>
                    <button className="text-white">
                        💬 {Math.floor(Math.random() * 20) + 5}
                    </button>
                    <button className="text-white">
                        ↗️
                    </button>
                </div>

                <div className="text-white/60 text-xs">
                    {currentStory + 1} of {stories.length}
                </div>
            </div>
        </div>
    );
}