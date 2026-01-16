'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, Calendar, Clock, Music, User, Building2, Instagram, Music2, ImageIcon, VideoIcon, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect, Suspense } from 'react';
import './styles.css';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { EventService } from '@/lib/services/event.service';
import { ClubService } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';
import DatePicker from '@/components/common/date-picker';
import { formatDateTimeForAPI } from '@/lib/date-utils';
import { MusicGenreAutocomplete, MusicGenre } from '@/components/ui/music-genre-autocomplete';

interface Club {
    id: string;
    name: string;
    logo?: string;
}

interface TicketType {
    name: string;
    price: number;
    currency: string;
    quantity: number;
    isActive: boolean;
}

function NewEventPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const reelInputRef = useRef<HTMLInputElement>(null);

    // Club management state
    const [clubs, setClubs] = useState<Club[]>([]);
    const [selectedClubId, setSelectedClubId] = useState<string>('');
    const [showClubDropdown, setShowClubDropdown] = useState(false);
    const [loadingClubs, setLoadingClubs] = useState(true);

    const [selectedGenres, setSelectedGenres] = useState<MusicGenre[]>([]);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedRestriction, setSelectedRestriction] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [dialogStage, setDialogStage] = useState<'confirm' | 'creating'>('confirm');
    const [formData, setFormData] = useState({
        eventName: '',
        artistName: '',
        aboutArtist: '',
        instagramHandle: '',
        spotifyHandle: '',
        eventDate: '',
        eventTime: '',
        musicGenre: '',
        description: '',
        organizer: '',
        organizerLogo: null as File | null,
        poster: null as File | null,
        reel: null as File | null,
        hasLimitedTickets: true,
        totalTickets: 0
    });

    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
        { name: 'General Entry', price: 999, currency: 'INR', quantity: 100, isActive: true }
    ]);
    const [newTicket, setNewTicket] = useState<TicketType>({ name: '', price: 0, currency: 'INR', quantity: 0, isActive: true });
    const [isAddingTicket, setIsAddingTicket] = useState(false);

    // Load manageable clubs on component mount
    useEffect(() => {
        const loadClubs = async () => {
            try {
                setLoadingClubs(true);
                console.log('📡 Loading admin clubs from /clubs/admin/all...');
                const response = await ClubService.getAllClubsAdmin();

                // Handle API response
                let clubsList: Club[] = [];
                if (response.success && response.data) {
                    clubsList = Array.isArray(response.data) ? response.data : [];
                } else if (Array.isArray(response)) {
                    clubsList = response;
                }

                console.log('✅ Admin clubs loaded:', clubsList);
                setClubs(clubsList);

                // Check if clubId is in URL (navigated from club page)
                const urlClubId = searchParams.get('clubId');
                if (urlClubId) {
                    const found = clubsList.find(c => c.id === urlClubId);
                    if (found) {
                        setSelectedClubId(urlClubId);
                        // Hide dropdown when navigating from club page
                        setShowClubDropdown(false);
                        console.log('📌 Pre-selected club from URL:', found.name);
                    } else if (clubsList.length > 0) {
                        // Fallback if ID not found
                        setSelectedClubId(clubsList[0].id);
                    }
                }
                // Auto-select first club if available and no URL param
                else if (clubsList.length > 0) {
                    setSelectedClubId(clubsList[0].id);
                    console.log('📌 Auto-selected club:', clubsList[0].name);
                }
            } catch (error) {
                console.error('❌ Error loading clubs:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load clubs. Please try again.',
                    variant: 'destructive'
                });
            } finally {
                setLoadingClubs(false);
            }
        };

        loadClubs();
    }, [toast, searchParams]);

    const handleGoBack = () => {
        router.back();
    };

    const handlePreviewEvent = () => {
        // Close dialog and go back to edit
        setShowConfirmDialog(false);
        setDialogStage('confirm');
        // Could also navigate to a preview page if needed
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileUpload = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, organizerLogo: file });
        }
    };

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, poster: file });
        }
    };

    const handleReelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, reel: file });
        }
    };

    const handleSaveEvent = () => {
        // Validate club selection
        if (!selectedClubId) {
            toast({
                title: 'Error',
                description: 'Please select a club before creating an event',
                variant: 'destructive'
            });
            return;
        }
        // Show confirmation dialog
        setShowConfirmDialog(true);
    };

    const handleConfirmCreate = async () => {
        // Change to creating stage
        setDialogStage('creating');
        setIsCreating(true);

        try {
            // 🔴 CRITICAL: Validate required fields
            if (!formData.eventName.trim()) {
                throw new Error('Event name is required');
            }

            if (!formData.description.trim()) {
                throw new Error('Event description is required');
            }

            if (!formData.organizer.trim()) {
                throw new Error('Event organizer is required');
            }

            if (!selectedClubId) {
                throw new Error('Please select a club for this event');
            }

            // Prepare event data for API
            const startDateTime = formatDateTimeForAPI(formData.eventDate, formData.eventTime);

            if (!startDateTime) {
                throw new Error('Invalid date or time format');
            }

            // Construct payload matching the required JSON structure
            // Note: Image fields are displayed in UI but NOT sent to API
            const eventData: any = {
                title: formData.eventName.trim(),
                name: formData.eventName.trim(),
                description: formData.description.trim(),
                startDateTime: startDateTime,
                endDateTime: startDateTime, // Ideally this should be calculated if duration is known
                location: formData.organizer || "Club Location",
                locationText: "Club Location Text",
                locationMap: {
                    lat: 0,
                    lng: 0
                },
                clubId: selectedClubId,
                maxAttendees: formData.totalTickets || 500,
                isPublic: true,
                requiresApproval: false,
                eventArtistName: formData.artistName,
                aboutEventArtist: formData.aboutArtist,
                instagramHandle: formData.instagramHandle,
                spotifyHandle: formData.spotifyHandle,
                musicGenre: selectedGenres.map(g => g.label).join(', '),
                eventOrganizer: formData.organizer,
                ticketTypes: ticketTypes,
                hasLimitedTickets: formData.hasLimitedTickets,
                totalTickets: formData.totalTickets
                // NOTE: Image fields (eventImage, eventReel, eventOrganizerLogo, galleryImages, performerImages) 
                // are intentionally NOT sent to the API - they are display-only in the UI
            };

            console.log('🚀 Creating event with JSON payload:', JSON.stringify(eventData, null, 2));
            console.log('📡 API Call: POST /events/create-json-with-images');

            // Use the specific endpoint for JSON+Images (even if images are omitted, the structure is expected)
            const response = await EventService.createEventWithImages(eventData);

            if (response && (response.id || (response as any).success)) {
                console.log('✅ Event created successfully:', response);

                toast({
                    title: 'Event Created Successfully',
                    description: `Your event "${formData.eventName}" has been created!`,
                    variant: 'default'
                });

                // Close the dialog and navigate to event preview
                setShowConfirmDialog(false);
                setDialogStage('confirm');
                router.push(`/admin/club/${selectedClubId}/events`); // Go back to club events list
            } else {
                throw new Error('Failed to create event - Invalid response');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create event. Please try again.';
            console.error('❌ Event creation error:', error);

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });

            setDialogStage('confirm');
            setIsCreating(false);
        }
    };

    const handleAddTicket = () => {
        setIsAddingTicket(true);
    };

    const confirmAddTicket = () => {
        if (newTicket.name && newTicket.price > 0) {
            setTicketTypes([...ticketTypes, newTicket]);
            setNewTicket({ name: '', price: 0, currency: 'INR', quantity: 0, isActive: true });
            setIsAddingTicket(false);
        } else {
            toast({
                title: "Error",
                description: "Enter valid ticket name and price",
                variant: 'destructive'
            });
        }
    };

    const handleDeleteTicket = (index: number) => {
        const updated = [...ticketTypes];
        updated.splice(index, 1);
        setTicketTypes(updated);
    };

    const tabs = [
        { id: 'details', label: 'Event Details' },
        { id: 'creatives', label: 'Event Creatives' },
        { id: 'tickets', label: 'Event Tickets' }
    ];

    return (
        <div className="min-h-screen bg-[#021313] text-white relative">
            {/* Fixed Header with gradient background */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-10 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="absolute top-10 left-6">
                    <button
                        onClick={handleGoBack}
                        className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-full transition-all duration-300"
                    >
                        <span className="text-white text-xl font-bold">&lt;</span>
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold text-white">Create new event</h1>
                </div>
            </div>

            {/* Main Content Card - Positioned below fixed header */}
            <div className="px-0 relative mt-[100px] z-40">
                {/* Main Container with rounded corners */}
                <div className="w-full bg-[#021313] rounded-t-[40px] flex flex-col">
                    {/* Fixed header section that stays in place */}
                    <div className="w-full bg-[#021313] rounded-t-[40px]">
                        {/* Club Selector - Only show if not navigated from a club page */}
                        {!searchParams.get('clubId') && (
                            <div className="w-full px-6 pt-6 pb-2">
                                <label className="block text-[#14FFEC] font-semibold text-base mb-2">Select Club *</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowClubDropdown(!showClubDropdown)}
                                        className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-[20px] p-[12px] px-4 flex items-center justify-between text-white hover:bg-[#0F2525] transition-colors"
                                        disabled={loadingClubs}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Building2 size={18} className="text-[#14FFEC]" />
                                            {loadingClubs ? 'Loading clubs...' : (selectedClubId ? clubs.find(c => c.id === selectedClubId)?.name || 'Select a club' : 'Select a club')}
                                        </span>
                                        <ChevronDown size={18} className={`text-[#14FFEC] transition-transform ${showClubDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showClubDropdown && !loadingClubs && clubs.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] z-50 shadow-lg max-h-64 overflow-y-auto">
                                            {clubs.map((club) => (
                                                <button
                                                    key={club.id}
                                                    onClick={() => {
                                                        setSelectedClubId(club.id);
                                                        setShowClubDropdown(false);
                                                        console.log('✅ Selected club:', club.name, '(ID:', club.id + ')');
                                                    }}
                                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b border-[#0C898B] last:border-0 hover:bg-[#0F2525] transition-colors ${selectedClubId === club.id ? 'bg-[#0F2525] border-l-4 border-l-[#14FFEC]' : ''
                                                        }`}
                                                >
                                                    {club.logo && (
                                                        <img src={club.logo} alt={club.name} className="w-8 h-8 rounded-full object-cover" />
                                                    )}
                                                    <span className="text-white font-semibold">{club.name}</span>
                                                    {selectedClubId === club.id && (
                                                        <span className="ml-auto text-[#14FFEC]">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {showClubDropdown && !loadingClubs && clubs.length === 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0D1F1F] border border-[#0C898B] rounded-[15px] p-4 text-center text-gray-400">
                                            No clubs available. Please create a club first.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Heading container */}
                        <div className="w-full pb-2">
                            <div className="flex items-center justify-center pt-8 pb-4">
                                <h2 className="text-[28px] font-bold text-white text-center tracking-wider font-['Anton']">
                                    {selectedClubId ? clubs.find(c => c.id === selectedClubId)?.name || 'EVENT DETAILS' : 'SELECT A CLUB'}
                                </h2>
                            </div>
                        </div>

                        {/* Tab Navigation - horizontal tabs starting from left */}
                        <div className="pl-6 pr-4 pt-1 pb-3 overflow-x-scroll scrollbar-hide bg-[#021313]">
                            <div className="flex items-center gap-4 min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-[8px] rounded-[25px] text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-[#14FFEC] text-black'
                                            : 'bg-[#004342] text-white hover:bg-[#005352]'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Scrollable content area */}
                    <div className="px-6 pb-36 overflow-y-auto h-[calc(100vh-280px)]  scrollbar-hide">
                        {activeTab === 'details' && (
                            <div className="space-y-5">
                                {/* Event Name */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Name *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="text"
                                            value={formData.eventName}
                                            onChange={(e) => handleInputChange('eventName', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* Artist Name */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Artist Name *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <input
                                            type="text"
                                            value={formData.artistName}
                                            onChange={(e) => handleInputChange('artistName', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* About Artist */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">About Event Artist *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-5">
                                        <textarea
                                            value={formData.aboutArtist}
                                            onChange={(e) => handleInputChange('aboutArtist', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none resize-none h-[80px] text-base font-semibold"
                                            placeholder="Artist Name here"
                                        />
                                    </div>
                                </div>

                                {/* Social Handles - in one row */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Artist Social Handle</label>
                                    </div>
                                    <div className="flex gap-4 w-full">
                                        <div className="w-1/2 bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.instagramHandle}
                                                onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Instagram Handle"
                                            />
                                        </div>

                                        <div className="w-1/2 bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="text"
                                                value={formData.spotifyHandle}
                                                onChange={(e) => handleInputChange('spotifyHandle', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Spotify Handle"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Date and Time - in one row */}
                                <div className="flex gap-4 w-full">
                                    <div className="w-1/2 space-y-3">
                                        <DatePicker
                                            value={formData.eventDate}
                                            onChange={(date) => handleInputChange('eventDate', date)}
                                            placeholder="DD/MM/YYYY"
                                            label="Event Date *"
                                        />
                                    </div>

                                    <div className="w-1/2 space-y-3">
                                        <div className="px-5">
                                            <label className="text-[#14FFEC] font-semibold text-base">Start Time *</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="time"
                                                value={formData.eventTime}
                                                onChange={(e) => handleInputChange('eventTime', e.target.value)}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Music Genre */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Music Genre *</label>
                                    </div>
                                    <MusicGenreAutocomplete
                                        musicGenres={[]}
                                        selectedGenres={selectedGenres}
                                        onSelectionChange={setSelectedGenres}
                                        placeholder="Type to search music genres..."
                                    />
                                </div>

                                {/* Event Description */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Description *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none resize-none h-[80px] text-base font-semibold"
                                            placeholder="Write a description of the the event here..."
                                        />
                                    </div>
                                </div>

                                {/* Event Organizer */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Organizer *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                        <div className="flex items-center gap-3">
                                            <Building2 size={20} className="text-[#14FFEC]" />
                                            <input
                                                type="text"
                                                value={formData.organizer}
                                                onChange={(e) => handleInputChange('organizer', e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="Event Organized by"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Event Organizer Logo */}
                                <div className="space-y-3 flex flex-col items-center">
                                    <div className="self-stretch px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Organizer logo</label>
                                    </div>
                                    <div
                                        onClick={() => handleFileUpload(fileInputRef)}
                                        className="w-[120px] h-[120px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-2 cursor-pointer"
                                    >
                                        <img
                                            src="/admin/upload.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mb-2"
                                        />
                                        <p className="text-white text-center text-base font-semibold">Upload logo here</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'creatives' && (
                            <div className="space-y-6 flex flex-col items-center">
                                {/* Event Poster */}
                                <div className="space-y-3 w-full">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Poster *</label>
                                    </div>
                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => handleFileUpload(posterInputRef)}
                                            className="w-[200px] h-[280px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-4 cursor-pointer"
                                        >
                                            <ImageIcon size={40} className="text-[#14FFEC] mb-4" />
                                            <p className="text-white text-center font-semibold">Upload poster here</p>
                                            {formData.poster && (
                                                <p className="text-[#14FFEC] text-sm mt-2 text-center">
                                                    {formData.poster.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={posterInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePosterChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Event Reel */}
                                <div className="space-y-3 w-full">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Event Reel</label>
                                    </div>
                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => handleFileUpload(reelInputRef)}
                                            className="w-[200px] h-[200px] bg-[#0D1F1F] border border-[#14FFEC] rounded-[15px] flex flex-col items-center justify-center p-4 cursor-pointer"
                                        >
                                            <VideoIcon size={40} className="text-[#14FFEC] mb-4" />
                                            <p className="text-white text-center font-semibold">Upload reel here</p>
                                            {formData.reel && (
                                                <p className="text-[#14FFEC] text-sm mt-2 text-center">
                                                    {formData.reel.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={reelInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleReelChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}                        {activeTab === 'tickets' && (
                            <div className="space-y-6">
                                {/* Ticket Types */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Ticket Types *</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <div className="flex flex-col gap-4">
                                            {/* List Existing Tickets */}
                                            {ticketTypes.map((ticket, idx) => (
                                                <div key={idx} className="flex items-center justify-between border-b border-[#0C898B]/30 pb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full border border-[#14FFEC] flex items-center justify-center">
                                                            <div className={`w-3 h-3 bg-[#14FFEC] rounded-full ${ticket.isActive ? '' : 'bg-gray-500'}`}></div>
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-semibold">{ticket.name}</div>
                                                            <div className="text-xs text-gray-400">Qty: {ticket.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#14FFEC] font-semibold">₹ {ticket.price}</span>
                                                        <button
                                                            onClick={() => handleDeleteTicket(idx)}
                                                            className="p-1 rounded-full text-red-500 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add New Ticket Form */}
                                            {isAddingTicket ? (
                                                <div className="bg-[#021313] p-4 rounded-xl space-y-3">
                                                    <input
                                                        placeholder="Ticket Name (e.g. VIP)"
                                                        className="w-full bg-[#0D1F1F] border border-[#0C898B] rounded-lg p-2 text-white"
                                                        value={newTicket.name}
                                                        onChange={e => setNewTicket({ ...newTicket, name: e.target.value })}
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            className="w-1/2 bg-[#0D1F1F] border border-[#0C898B] rounded-lg p-2 text-white"
                                                            value={newTicket.price || ''}
                                                            onChange={e => setNewTicket({ ...newTicket, price: parseInt(e.target.value) || 0 })}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Qty"
                                                            className="w-1/2 bg-[#0D1F1F] border border-[#0C898B] rounded-lg p-2 text-white"
                                                            value={newTicket.quantity || ''}
                                                            onChange={e => setNewTicket({ ...newTicket, quantity: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={confirmAddTicket} className="flex-1 bg-[#14FFEC] text-black py-1 rounded-lg font-bold">Add</button>
                                                        <button onClick={() => setIsAddingTicket(false)} className="flex-1 bg-gray-700 text-white py-1 rounded-lg">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleAddTicket}
                                                    className="flex items-center justify-center gap-2 py-2 border border-dashed border-[#14FFEC] rounded-[15px] text-[#14FFEC] font-semibold"
                                                >
                                                    <span>+</span> Add New Ticket Type
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Availability */}
                                <div className="space-y-3">
                                    <div className="px-5">
                                        <label className="text-[#14FFEC] font-semibold text-base">Ticket Availability</label>
                                    </div>
                                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[15px] px-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-semibold">Limited Tickets</span>
                                            <div
                                                className="relative cursor-pointer"
                                                onClick={() => setFormData({ ...formData, hasLimitedTickets: !formData.hasLimitedTickets })}
                                            >
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.hasLimitedTickets ? 'bg-[#14FFEC]' : 'bg-gray-600'}`}></div>
                                                <div className={`absolute top-0 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.hasLimitedTickets ? 'right-0' : 'left-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Number of Tickets */}
                                {formData.hasLimitedTickets && (
                                    <div className="space-y-3">
                                        <div className="px-5">
                                            <label className="text-[#14FFEC] font-semibold text-base">Total Tickets</label>
                                        </div>
                                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-[30px] p-[10px] px-5">
                                            <input
                                                type="number"
                                                value={formData.totalTickets}
                                                onChange={(e) => setFormData({ ...formData, totalTickets: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-transparent text-white placeholder-[#9D9C9C] outline-none text-base font-semibold"
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Save Button */}
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="w-full h-[80px] relative bg-[#0D1F1F] shadow-[0px_30px_30px_-40px_#00968A_inset] overflow-hidden rounded-t-[40px] border-t-2 border-[#14FFEC]">
                        <div className="flex justify-center items-center px-8 h-full">
                            <div className="w-[220px] h-[45px] bg-[#0F6861] rounded-[30px] flex justify-center items-center">
                                <button
                                    onClick={handleSaveEvent}
                                    className="w-full h-full flex justify-center items-center"
                                >
                                    <span className="text-center text-white text-[16px] font-['Manrope'] font-bold tracking-[0.05px]">
                                        Save & Create Event
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogOverlay />
                <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                    <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px]">
                        {/* Close button in the top-right corner */}
                        <div className="absolute right-3 top-3">
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setDialogStage('confirm'); // Reset to confirm stage when closing
                                }}
                                className="w-8 h-8 flex items-center justify-center text-white bg-transparent rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        {dialogStage === 'confirm' ? (
                            <>
                                <div className="w-[133px] h-[102px] relative overflow-hidden flex items-center justify-center">
                                    <img
                                        src="/admin/confirm1.png"
                                        alt="Confirmation"
                                        width={133}
                                        height={102}
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-[12px]">
                                    <div className="text-[#F9F9F9] text-[20px] font-semibold font-['Manrope']">
                                        Proceed to create event
                                    </div>
                                    <div className="text-center text-[#9D9C9C] text-[16px] font-['Manrope'] leading-[19.20px]">
                                        You are about to create a new event
                                    </div>
                                </div>

                                <div className="flex items-center gap-[14px]">
                                    <button
                                        onClick={handleConfirmCreate}
                                        className="w-[154px] h-[38px] bg-[#007877] rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-[#008c8c] transition-all duration-300"
                                    >
                                        <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                            Create event
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setShowConfirmDialog(false)}
                                        className="w-[154px] h-[38px] border border-[#007877] rounded-[30px] flex justify-center items-center cursor-pointer hover:bg-[#012e2e] transition-all duration-300"
                                    >
                                        <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                            Go back
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Loading animation from booking page */}
                                <div className="w-20 h-20 relative mb-2">
                                    <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-r-transparent animate-spin border-[#14FFEC]"></div>
                                </div>

                                <div className="flex flex-col items-center gap-[12px]">
                                    <div className="text-[#F9F9F9] text-[20px] font-semibold font-['Manrope']">
                                        Creating your event
                                    </div>
                                </div>

                                <div className="flex items-center gap-[14px]">
                                    <button
                                        onClick={handlePreviewEvent}
                                        className="w-[154px] h-[38px] bg-[#007877] rounded-[30px] flex justify-center items-center"
                                    >
                                        <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                            Preview event
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowConfirmDialog(false);
                                            setDialogStage('confirm');
                                        }}
                                        className="w-[154px] h-[38px] border border-[#007877] rounded-[30px] flex justify-center items-center"
                                    >
                                        <div className="text-center text-white text-[16px] font-['Manrope'] font-medium tracking-[0.05px]">
                                            Go back
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function NewEventPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-r-transparent animate-spin border-[#14FFEC]"></div>
            </div>
        }>
            <NewEventPageContent />
        </Suspense>
    );
}
