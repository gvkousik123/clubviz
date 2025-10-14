'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Camera,
    User,
    Mail,
    Calendar,
    Music,
    Building,
    MapPin,
    Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type ProfileFormState = {
    name: string;
    email: string;
    gender: string;
    city: string;
    dateOfBirth: string;
    musicGenre: string;
    clubType: string;
};

const INITIAL_FORM_STATE: ProfileFormState = {
    name: '',
    email: '',
    gender: '',
    city: '',
    dateOfBirth: '',
    musicGenre: '',
    clubType: '',
};

export default function EditProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [profileData, setProfileData] = useState<ProfileFormState>(INITIAL_FORM_STATE);

    const progress = useMemo(() => {
        const values = Object.values(profileData);
        const filled = values.filter((value) => value.trim().length > 0).length;
        if (!values.length) return 0;
        return Math.min(100, Math.round((filled / values.length) * 100));
    }, [profileData]);

    const handleGoBack = () => {
        router.back();
    };

    const handleInputChange = <K extends keyof ProfileFormState>(field: K, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProfilePhotoClick = () => {
        toast({
            title: 'Photo upload coming soon',
            description: 'We are wiring up media uploads next.',
        });
    };

    const handleSave = () => {
        toast({
            title: 'Profile updated',
            description: 'Your vibe preferences were captured successfully.',
        });
        router.back();
    };

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[428px] pb-20">
                <div
                    className="pointer-events-none absolute -top-44 right-[-180px] h-[320px] w-[320px] rounded-full bg-[#0891b2]/20 blur-[140px]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute top-[360px] left-[-200px] h-[280px] w-[280px] rounded-full bg-[#14b8a6]/18 blur-[140px]"
                    aria-hidden
                />

                <header className="relative header-gradient rounded-b-[36px] px-5 pb-12 pt-10 shadow-[0px_32px_80px_rgba(6,182,212,0.35)]">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-11 w-11 rounded-full border border-white/15 bg-white/15 text-white hover:bg-white/25"
                            onClick={handleGoBack}
                            aria-label="Go back"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-white/85">Edit profile</h1>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                            {progress}%
                        </span>
                    </div>
                    <div className="mt-6 text-xs text-white/70">Profile completion</div>
                    <div className="progress-track mt-2 h-2">
                        <div className="progress-fill h-full" style={{ width: `${progress}%` }} />
                    </div>
                </header>

                <main className="relative z-10 space-y-10 px-5 pt-10">
                    <section className="-mt-16">
                        <div className="surface-card flex flex-col items-center gap-4 rounded-[32px] border border-white/10 px-6 pb-8 pt-10 text-center shadow-[0px_32px_80px_rgba(6,182,212,0.18)]">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0e7490] text-3xl">
                                        <Sparkles className="h-12 w-12 text-white/80" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleProfilePhotoClick}
                                    className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:bg-black/80"
                                    aria-label="Upload profile photo"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-sm text-white/65">
                                Fresh pics help us vibe-check faster. Drop your best snap whenever you&apos;re ready.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold tracking-wide">Personal info</h2>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-4">
                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <label className="text-xs uppercase tracking-[0.3em] text-white/55">Full name</label>
                                <div className="relative mt-3">
                                    <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                    <Input
                                        value={profileData.name}
                                        onChange={(event) => handleInputChange('name', event.target.value)}
                                        placeholder="Enter your full name"
                                        className="pl-12"
                                    />
                                </div>
                            </div>

                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <label className="text-xs uppercase tracking-[0.3em] text-white/55">Email address</label>
                                <div className="relative mt-3">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(event) => handleInputChange('email', event.target.value)}
                                        placeholder="you@email.com"
                                        className="pl-12"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                    <label className="text-xs uppercase tracking-[0.3em] text-white/55">Gender</label>
                                    <div className="relative mt-3">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/35">⚬</span>
                                        <Input
                                            value={profileData.gender}
                                            onChange={(event) => handleInputChange('gender', event.target.value)}
                                            placeholder="Identify yourself"
                                            className="pl-12"
                                        />
                                    </div>
                                </div>
                                <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                    <label className="text-xs uppercase tracking-[0.3em] text-white/55">City</label>
                                    <div className="relative mt-3">
                                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                        <Input
                                            value={profileData.city}
                                            onChange={(event) => handleInputChange('city', event.target.value)}
                                            placeholder="Where do you party?"
                                            className="pl-12"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <label className="text-xs uppercase tracking-[0.3em] text-white/55">Date of birth</label>
                                <div className="relative mt-3">
                                    <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                    <Input
                                        value={profileData.dateOfBirth}
                                        onChange={(event) => handleInputChange('dateOfBirth', event.target.value)}
                                        placeholder="DD/MM/YYYY"
                                        className="pl-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold tracking-wide">My preferences</h2>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-4">
                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <label className="text-xs uppercase tracking-[0.3em] text-white/55">Signature sound</label>
                                <div className="relative mt-3">
                                    <Music className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                    <Input
                                        value={profileData.musicGenre}
                                        onChange={(event) => handleInputChange('musicGenre', event.target.value)}
                                        placeholder="Techno, Bollytech, House..."
                                        className="pl-12"
                                    />
                                </div>
                            </div>

                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <label className="text-xs uppercase tracking-[0.3em] text-white/55">Club vibe</label>
                                <div className="relative mt-3">
                                    <Building className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                                    <Input
                                        value={profileData.clubType}
                                        onChange={(event) => handleInputChange('clubType', event.target.value)}
                                        placeholder="Rooftop, lounge, warehouse..."
                                        className="pl-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="pb-14">
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                className="h-14 rounded-full text-xs font-semibold uppercase tracking-[0.35em]"
                                onClick={handleSave}
                            >
                                Save changes
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-12 rounded-full text-xs font-semibold uppercase tracking-[0.35em] text-white/70 hover:text-white"
                                onClick={handleGoBack}
                            >
                                Cancel
                            </Button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
} 'use client';
