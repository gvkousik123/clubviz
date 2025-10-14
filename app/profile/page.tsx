'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Edit,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Sparkles,
    Star,
    Music,
    Wine,
    Bell,
    ShieldCheck,
    ChevronRight,
    Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/api-types';
import { UserService } from '@/lib/services/user.service';
import { useToast } from '@/hooks/use-toast';

type StatCard = {
    label: string;
    value: number;
    icon: typeof Star;
};

const placeholderLocation = 'Location not added yet';

export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [avatarFailed, setAvatarFailed] = useState(false);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await UserService.getUserProfile();
            setUser(response.data);
        } catch (err: any) {
            console.error('Error fetching user profile:', err);
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load profile';
            setError(errorMessage);

            toast({
                title: 'Failed to load profile',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        setAvatarFailed(false);
    }, [user?.avatar]);

    const fullName = useMemo(() => {
        if (!user) return 'Guest User';
        const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
        if (name.length) {
            return name;
        }
        if (user.username) {
            return user.username;
        }
        return 'Guest User';
    }, [user]);

    const displayInitial = useMemo(() => {
        if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
        if (user?.lastName) return user.lastName.charAt(0).toUpperCase();
        if (user?.username) return user.username.charAt(0).toUpperCase();
        return 'U';
    }, [user]);

    const memberSince = useMemo(() => {
        if (!user?.createdAt) return null;
        try {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
            });
        } catch (error) {
            return null;
        }
    }, [user?.createdAt]);

    const dateOfBirth = useMemo(() => {
        if (!user?.dateOfBirth) return null;
        try {
            return new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch (error) {
            return null;
        }
    }, [user?.dateOfBirth]);

    const completionPercent = useMemo(() => {
        const completionFields = [
            user?.firstName,
            user?.lastName,
            user?.email,
            user?.phone,
            user?.preferences?.musicGenres?.length ? 'music' : null,
            user?.preferences?.drinkPreferences?.length ? 'drink' : null,
        ];

        const total = completionFields.length;
        const filled = completionFields.filter(Boolean).length;

        if (!total) return 0;
        return Math.min(100, Math.round((filled / total) * 100));
    }, [user]);

    const stats: StatCard[] = useMemo(
        () => [
            {
                label: 'Saved clubs',
                value: user?.preferences?.favoriteClubs?.length ?? 0,
                icon: Star,
            },
            {
                label: 'Saved events',
                value: user?.preferences?.favoriteEvents?.length ?? 0,
                icon: Ticket,
            },
            {
                label: 'Music moods',
                value: user?.preferences?.musicGenres?.length ?? 0,
                icon: Music,
            },
        ],
        [user?.preferences?.favoriteClubs, user?.preferences?.favoriteEvents, user?.preferences?.musicGenres],
    );

    const musicGenres = user?.preferences?.musicGenres ?? [];
    const drinkPreferences = user?.preferences?.drinkPreferences ?? [];
    const favouriteClubs = user?.preferences?.favoriteClubs ?? [];
    const favouriteEvents = user?.preferences?.favoriteEvents ?? [];
    const notifications = user?.preferences?.notifications;

    const notificationSettings = [
        { label: 'Email updates', value: notifications?.email },
        { label: 'SMS alerts', value: notifications?.sms },
        { label: 'Push notifications', value: notifications?.push },
        { label: 'Event reminders', value: notifications?.eventReminders },
        { label: 'Promotions', value: notifications?.promotions },
    ];

    const locationLabel = favouriteClubs.length ? `${favouriteClubs[0]} regular` : placeholderLocation;

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#031313] text-white">
                <div className="relative mx-auto flex min-h-screen max-w-[428px] items-center justify-center">
                    <div className="space-y-4 text-center">
                        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-2 border-white/20 border-t-[#14b8a6]" />
                        <p className="text-sm text-white/70">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#031313] text-white">
                <div className="relative mx-auto flex min-h-screen max-w-[428px] items-center justify-center px-6">
                    <div className="surface-card w-full rounded-[28px] border border-white/10 p-6 text-center">
                        <h2 className="text-lg font-semibold text-red-300">Unable to load profile</h2>
                        <p className="mt-2 text-sm text-white/65">{error}</p>
                        <Button
                            variant="primary"
                            className="mt-6 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em]"
                            onClick={fetchUserProfile}
                        >
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[428px] pb-20">
                <div
                    className="pointer-events-none absolute -top-40 right-[-180px] h-[320px] w-[320px] rounded-full bg-[#0891b2]/20 blur-[140px]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute top-[380px] left-[-200px] h-[280px] w-[280px] rounded-full bg-[#14b8a6]/20 blur-[140px]"
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
                        <h1 className="text-xs font-semibold uppercase tracking-[0.4em] text-white/85">My account</h1>
                        <Link href="/profile/edit" className="shrink-0">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full border border-white/15 bg-white/15 px-4 text-[11px] uppercase tracking-[0.35em] text-white/85"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-white/70">
                        Keep your details fresh to unlock smarter recommendations and faster bookings.
                    </p>
                </header>

                <main className="relative z-10 space-y-10 px-5 pt-10">
                    <section className="-mt-20">
                        <div className="surface-card rounded-[32px] border border-white/10 px-6 pb-8 pt-12 text-center shadow-[0px_32px_80px_rgba(6,182,212,0.18)]">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 p-1">
                                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10">
                                    {user?.avatar && !avatarFailed ? (
                                        <img
                                            src={user.avatar}
                                            alt={fullName}
                                            className="h-full w-full object-cover"
                                            onError={() => setAvatarFailed(true)}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#14b8a6] to-[#0e7490] text-3xl font-bold">
                                            {displayInitial}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h2 className="mt-5 text-[22px] font-semibold leading-tight">{fullName}</h2>
                            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-white/70">
                                <MapPin className="h-4 w-4 text-cyan-300" />
                                <span>{locationLabel}</span>
                            </div>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[11px] uppercase tracking-[0.35em] text-white/70">
                                <Sparkles className="h-4 w-4 text-cyan-200" />
                                Clubwiz insider
                            </div>
                            {memberSince && (
                                <p className="mt-3 text-xs text-white/50">Member since {memberSince}</p>
                            )}
                            <div className="mt-6 text-left">
                                <div className="flex items-center justify-between text-xs text-white/55">
                                    <span>Profile completion</span>
                                    <span>{completionPercent}%</span>
                                </div>
                                <div className="progress-track mt-2 h-2">
                                    <div className="progress-fill h-full" style={{ width: `${completionPercent}%` }} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Your vibe stats</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="surface-panel flex flex-col items-center gap-2 rounded-[22px] border border-white/10 px-3 py-4 text-center"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                        <stat.icon className="h-5 w-5 text-cyan-300" />
                                    </div>
                                    <span className="text-xl font-bold text-white">{stat.value}</span>
                                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/55">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Contact details</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-3">
                            <div className="surface-panel flex items-center gap-4 rounded-[24px] border border-white/10 px-5 py-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <Phone className="h-5 w-5 text-cyan-300" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Phone</p>
                                    <p className="mt-1 text-sm font-medium text-white">{user?.phone || 'Add your number'}</p>
                                </div>
                            </div>
                            <div className="surface-panel flex items-center gap-4 rounded-[24px] border border-white/10 px-5 py-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <Mail className="h-5 w-5 text-cyan-300" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Email</p>
                                    <p className="mt-1 text-sm font-medium text-white">{user?.email || 'Add your email'}</p>
                                </div>
                            </div>
                            <div className="surface-panel flex items-center gap-4 rounded-[24px] border border-white/10 px-5 py-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <Calendar className="h-5 w-5 text-cyan-300" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Date of birth</p>
                                    <p className="mt-1 text-sm font-medium text-white">{dateOfBirth || 'Add your birthday'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Preferences</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="space-y-3">
                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <Music className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">Music moods</h4>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {musicGenres.length ? (
                                        musicGenres.map((genre) => (
                                            <span key={genre} className="badge-tag" data-variant="primary">
                                                {genre}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="rounded-full border border-dashed border-white/20 px-4 py-2 text-xs text-white/50">
                                            Add your favourite genres
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <Wine className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">Drinks</h4>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {drinkPreferences.length ? (
                                        drinkPreferences.map((drink) => (
                                            <span key={drink} className="badge-tag" data-variant="secondary">
                                                {drink}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="rounded-full border border-dashed border-white/20 px-4 py-2 text-xs text-white/50">
                                            Tell us what you sip
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <Star className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">Favourites</h4>
                                </div>
                                <div className="mt-4 space-y-2 text-sm text-white/70">
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.3em] text-white/45">Clubs</span>
                                        <p className="mt-1">
                                            {favouriteClubs.length ? favouriteClubs.join(', ') : 'Add clubs you love'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.3em] text-white/45">Events</span>
                                        <p className="mt-1">
                                            {favouriteEvents.length ? favouriteEvents.join(', ') : 'Save events to curate your feed'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Notifications</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="surface-panel rounded-[24px] border border-white/10 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                    <Bell className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">Stay in the loop</h4>
                                    <p className="mt-1 text-xs text-white/55">Control how we nudge you about drops, bookings, and perks.</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-2">
                                {notificationSettings.map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3"
                                    >
                                        <span className="text-sm text-white/75">{label}</span>
                                        <span
                                            className={`text-xs font-semibold uppercase tracking-[0.3em] ${value ? 'text-[#5eead4]' : 'text-white/40'
                                                }`}
                                        >
                                            {value ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="pb-12">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-wide">Account controls</h3>
                            <div className="divider-line w-16" />
                        </div>
                        <div className="mt-4 space-y-3">
                            {[
                                {
                                    title: 'Privacy & security',
                                    description: 'Manage visibility, data usage, and safeguard your account.',
                                    icon: ShieldCheck,
                                },
                                {
                                    title: 'Notification preferences',
                                    description: 'Fine-tune how and when we reach out to you.',
                                    icon: Bell,
                                },
                                {
                                    title: 'Support & feedback',
                                    description: 'Need help? Tell us what should get better.',
                                    icon: Sparkles,
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="surface-panel flex items-center justify-between gap-4 rounded-[24px] border border-white/10 px-5 py-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                            <item.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                                            <p className="mt-1 text-xs text-white/55">{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/40" />
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}