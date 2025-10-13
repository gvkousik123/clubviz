// Example usage of ClubViz API services
// This file demonstrates how to integrate the APIs into your React components

import { useEffect, useState } from 'react';
import {
    AuthService,
    ClubService,
    EventService,
    BookingService,
    UserService,
    ReviewService,
    MediaService,
    StoryService,
    NotificationService
} from '@/lib/services';
import { Club, Event, Booking, User } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

// Example 1: Authentication Hook
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            if (AuthService.isAuthenticated()) {
                const response = await AuthService.getCurrentUser();
                if (response.success) {
                    setUser(response.data);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone: string, otp: string) => {
        try {
            const response = await AuthService.loginWithOTP({ phone, otp });
            if (response.success) {
                setUser(response.data.user);
                toast({
                    title: "Login successful",
                    description: "Welcome back!",
                });
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
            toast({
                title: "Logged out",
                description: "You have been logged out successfully.",
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return { user, loading, login, logout, checkAuthStatus };
};

// Example 2: Clubs Hook with Search and Filtering
export const useClubs = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const fetchClubs = async (filters?: any) => {
        setLoading(true);
        try {
            const response = await ClubService.getClubs(filters);
            if (response.success) {
                setClubs(response.data.clubs);
            }
        } catch (error) {
            console.error('Failed to fetch clubs:', error);
            toast({
                title: "Error",
                description: "Failed to load clubs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const searchClubs = async (query: string) => {
        setLoading(true);
        try {
            const response = await ClubService.searchClubs(query);
            if (response.success) {
                setClubs(response.data.clubs);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (clubId: string) => {
        try {
            const isFavorite = favorites.includes(clubId);

            if (isFavorite) {
                await ClubService.removeFromFavorites(clubId);
                setFavorites(prev => prev.filter(id => id !== clubId));
            } else {
                await ClubService.addToFavorites(clubId);
                setFavorites(prev => [...prev, clubId]);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const loadFavorites = async () => {
        try {
            const response = await ClubService.getFavoriteClubs();
            if (response.success) {
                setFavorites(response.data.map(club => club.id));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    return {
        clubs,
        loading,
        favorites,
        fetchClubs,
        searchClubs,
        toggleFavorite,
        loadFavorites
    };
};

// Example 3: Booking Flow Component
export const BookingFlowExample = () => {
    const [step, setStep] = useState(1);
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [selectedTable, setSelectedTable] = useState<any>(null);
    const [bookingData, setBookingData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    // Step 1: Select Club and Date
    const handleClubSelection = async (club: Club, dateTime: string, guestCount: number) => {
        setSelectedClub(club);
        setLoading(true);

        try {
            // Get available tables
            const response = await BookingService.getAvailableTables(club.id, dateTime, guestCount);
            if (response.success) {
                setBookingData({
                    clubId: club.id,
                    dateTime,
                    guestCount,
                    availableTables: response.data
                });
                setStep(2);
            }
        } catch (error) {
            console.error('Failed to get tables:', error);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Select Table
    const handleTableSelection = async (table: any) => {
        setSelectedTable(table);
        setLoading(true);

        try {
            // Reserve table temporarily
            const response = await BookingService.reserveTableTemporary(
                table.id,
                bookingData.dateTime,
                30 // 30 minutes hold
            );

            if (response.success) {
                setBookingData(prev => ({
                    ...prev,
                    tableId: table.id,
                    reservationId: response.data.reservationId
                }));
                setStep(3);
            }
        } catch (error) {
            console.error('Failed to reserve table:', error);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Add Contact Info and Create Booking
    const createBooking = async (contactInfo: any) => {
        setLoading(true);

        try {
            const response = await BookingService.createBooking({
                ...bookingData,
                contactInfo,
                bookingType: 'table'
            });

            if (response.success) {
                setStep(4);
                // Proceed to payment
                return response.data;
            }
        } catch (error) {
            console.error('Failed to create booking:', error);
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Process Payment
    const processPayment = async (booking: Booking, paymentDetails: any) => {
        setLoading(true);

        try {
            const response = await BookingService.processPayment({
                bookingId: booking.id,
                amount: booking.finalAmount,
                currency: booking.currency,
                paymentMethod: paymentDetails.method,
                paymentDetails
            });

            if (response.success && response.data.status === 'success') {
                // Generate ticket
                await BookingService.generateTicket(booking.id);

                toast({
                    title: "Booking confirmed!",
                    description: "Your table has been booked successfully.",
                });

                setStep(5);
            }
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return { step, loading, handleClubSelection, handleTableSelection, createBooking, processPayment };
};

// Example 4: Review System
export const useReviews = (clubId?: string, eventId?: string) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            let response;
            if (clubId) {
                response = await ReviewService.getClubReviews(clubId);
            } else if (eventId) {
                response = await ReviewService.getEventReviews(eventId);
            }

            if (response?.success) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (reviewData: any) => {
        try {
            const response = await ReviewService.createReview({
                clubId,
                eventId,
                ...reviewData
            });

            if (response.success) {
                toast({
                    title: "Review submitted",
                    description: "Thank you for your feedback!",
                });

                // Refresh reviews
                fetchReviews();
                return { success: true };
            }
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const markHelpful = async (reviewId: string) => {
        try {
            await ReviewService.markReviewHelpful(reviewId);
            fetchReviews(); // Refresh to show updated count
        } catch (error) {
            console.error('Failed to mark helpful:', error);
        }
    };

    useEffect(() => {
        if (clubId || eventId) {
            fetchReviews();
        }
    }, [clubId, eventId]);

    return { reviews, loading, submitReview, markHelpful };
};

// Example 5: Media Upload Hook
export const useMediaUpload = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File, type: string) => {
        setUploading(true);
        try {
            const response = await MediaService.uploadFile(file, type as any);
            if (response.success) {
                return response.data.url;
            }
            throw new Error('Upload failed');
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const uploadMultipleFiles = async (files: File[], type: string) => {
        setUploading(true);
        try {
            const response = await MediaService.uploadMultipleFiles(files, type);
            if (response.success) {
                return response.data.map(upload => upload.url);
            }
            throw new Error('Upload failed');
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setUploading(false);
        }
    };

    return { uploading, uploadFile, uploadMultipleFiles };
};

// Example 6: Stories Hook
export const useStories = () => {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStories = async (clubId?: string) => {
        setLoading(true);
        try {
            const response = await StoryService.getActiveStories(clubId);
            if (response.success) {
                setStories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewStory = async (storyId: string) => {
        try {
            await StoryService.viewStory(storyId);
        } catch (error) {
            console.error('Failed to record story view:', error);
        }
    };

    const createStory = async (clubId: string, mediaFile: File, title?: string) => {
        try {
            const response = await StoryService.createStory(clubId, mediaFile, title);
            if (response.success) {
                fetchStories(); // Refresh stories
                return response.data;
            }
        } catch (error: any) {
            toast({
                title: "Failed to create story",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return { stories, loading, fetchStories, viewStory, createStory };
};

// Example 7: Notifications Hook
export const useNotifications = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await NotificationService.getNotifications();
            if (response.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await NotificationService.markAsRead(notificationId);
            // Update local state
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
};

// Example 8: Complete Component using multiple hooks
export const ClubDetailPageExample = ({ clubId }: { clubId: string }) => {
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const { reviews, submitReview } = useReviews(clubId);
    const { stories, viewStory } = useStories();
    const { user } = useAuth();

    useEffect(() => {
        fetchClubDetails();
        stories.length === 0 && fetchStories();
    }, [clubId]);

    const fetchClubDetails = async () => {
        try {
            const response = await ClubService.getClubById(clubId);
            if (response.success) {
                setClub(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch club:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStories = async () => {
        try {
            const response = await StoryService.getClubStories(clubId);
            // Handle stories data
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!club) {
        return <div>Club not found</div>;
    }

    return (
        <div>
            <h1>{club.name}</h1>
            <p>{club.description}</p>

            {/* Stories section */}
            <div className="stories">
                {stories.map(story => (
                    <div key={story.id} onClick={() => viewStory(story.id)}>
                        {/* Story component */}
                    </div>
                ))}
            </div>

            {/* Reviews section */}
            <div className="reviews">
                {reviews.map(review => (
                    <div key={review.id}>
                        {/* Review component */}
                    </div>
                ))}
            </div>

            {/* Review form for authenticated users */}
            {user && (
                <div>
                    {/* Review form component */}
                </div>
            )}
        </div>
    );
};

export default {
    useAuth,
    useClubs,
    useReviews,
    useMediaUpload,
    useStories,
    useNotifications,
    BookingFlowExample,
    ClubDetailPageExample
};