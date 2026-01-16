// PUBLIC EVENT API - QUICK REFERENCE
// ===================================

// 1. IMPORT THE SERVICE
import { PublicEventService } from '@/lib/services/public.service';

// 2. FETCH EVENTS LIST (with pagination & filters)
const response = await PublicEventService.getPublicEvents({
    page: 0,                // Page number (0-indexed)
    size: 20,               // Items per page
    sortBy: 'startDateTime', // Sort field
    sortOrder: 'asc',       // 'asc' or 'desc'
    category: 'Music',      // Optional: filter by category
    search: 'festival',     // Optional: search query
    status: 'UPCOMING',     // Optional: UPCOMING, ONGOING, COMPLETED, CANCELLED
    startDate: '2026-01-01', // Optional: filter by start date
    endDate: '2026-12-31'   // Optional: filter by end date
});

// Response structure:
// {
//   content: PublicEventListItem[],
//   totalElements: number,
//   totalPages: number,
//   currentPage: number,
//   size: number,
//   hasNext: boolean,
//   hasPrevious: boolean,
//   first: boolean,
//   last: boolean
// }

// 3. FETCH USER'S REGISTERED EVENTS (requires auth)
const myEvents = await PublicEventService.getMyRegistrations({
    page: 0,
    size: 20,
    sortBy: 'startDateTime',
    sortOrder: 'asc'
});

// Returns: Same structure as event list

// 4. FETCH SINGLE EVENT DETAILS
const eventDetails = await PublicEventService.getPublicEventById('694fc45160e31f425dd6171f');

// Returns: PublicEventDetails with full event information

// 5. USING THE CUSTOM HOOK
import { usePublicEvents } from '@/hooks/use-public-events';

function MyComponent() {
    const {
        events,             // Current event list response
        eventDetails,       // Current event details
        myRegistrations,    // User's registered events
        loading,            // Loading state
        error,              // Error message
        fetchEventsList,    // Function to fetch events
        fetchEventDetails,  // Function to fetch event details
        fetchMyRegistrations, // Function to fetch user's events
        clearError,         // Clear error state
        reset              // Reset all state
    } = usePublicEvents();

    // Fetch on mount
    useEffect(() => {
        fetchEventsList({
            page: 0,
            size: 20,
            status: 'UPCOMING'
        });
    }, []);

    // Apply filters
    const handleFilter = (status: string, category: string) => {
        fetchEventsList({
            page: 0,
            size: 20,
            status,
            category
        });
    };

    return (
        <div>
        { loading && <Loader />}
{ error && <Error message={ error } /> }
{
    events?.content.map(event => (
        <EventCard key= { event.id } event = { event } />
      ))
}
</div>
  );
}

// 6. CHECK IF GUEST MODE
import { isGuestMode } from '@/lib/api-client-public';

if (isGuestMode()) {
    // User is not authenticated - use public APIs
    const events = await PublicEventService.getPublicEvents();
} else {
    // User is authenticated - can use my registrations
    const myEvents = await PublicEventService.getMyRegistrations();
}

// 7. EVENT LIST ITEM STRUCTURE
interface PublicEventListItem {
    id: string;
    title: string;
    shortDescription: string;
    imageUrl: string | null;
    location: string;
    startDateTime: string;        // ISO format
    endDateTime: string;          // ISO format
    formattedDate: string;        // e.g., "Jun 15, 2025"
    formattedTime: string;        // e.g., "4:30 PM - 12:30 AM"
    timeUntilEvent: string;       // e.g., "Tomorrow", "In 4 days"
    duration: string;             // e.g., "4h 30m"
    attendeeCount: number;
    maxAttendees: number;
    isRegistered: boolean;
    canRegister: boolean;
    isFull: boolean;
    clubId: string | null;
    clubName: string | null;
    clubLogo: string | null;
    organizerName: string | null;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    isPublic: boolean;
    requiresApproval: boolean;
    capacityPercentage: number;   // 0-100
    attendeeStatus: string;       // e.g., "0/500 attending"
    eventStatusText: string;      // e.g., "Starts in 4 days"
    pastEvent: boolean;
    upcoming: boolean;
    ongoing: boolean;
}

// 8. EVENT DETAILS STRUCTURE
interface PublicEventDetails {
    id: string;
    title: string;
    description: string;          // Full description
    imageUrl: string | null;
    images: string[] | null;      // Multiple images
    location: string;
    startDateTime: string;
    endDateTime: string;
    formattedDate: string;        // e.g., "Sunday, June 15, 2025"
    formattedTime: string;
    timeUntilEvent: string;
    duration: string;
    attendeeCount: number;
    maxAttendees: number;
    isRegistered: boolean;
    canRegister: boolean;
    isFull: boolean;
    rsvpStatus: string;           // e.g., "NOT_REGISTERED", "REGISTERED"
    club: any | null;
    organizer: any | null;
    recentAttendees: any[];
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    isPublic: boolean;
    requiresApproval: boolean;
    createdAt: string;
    updatedAt: string;
    capacityPercentage: number;
    canPerformAction: boolean;
    attendeeStatus: string;
    registerButtonText: string;   // e.g., "Register", "Event Full"
}

// 9. EXAMPLE: EVENTS PAGE WITH FILTERS
function EventsPage() {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState('UPCOMING');
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        loadEvents();
    }, [status, currentPage]);

    const loadEvents = async () => {
        const response = await PublicEventService.getPublicEvents({
            page: currentPage,
            size: 20,
            status,
            sortBy: 'startDateTime',
            sortOrder: 'asc'
        });
        setEvents(response.content);
    };

    return (
        <div>
        <select onChange= {(e) => setStatus(e.target.value)
}>
    <option value="UPCOMING" > Upcoming </option>
        < option value = "ONGOING" > Happening Now </option>
            < option value = "COMPLETED" > Past Events </option>
                </select>

{
    events.map(event => (
        <div key= { event.id } >
        <h3>{ event.title } </h3>
        < p > { event.shortDescription } </p>
        < p > { event.formattedDate } • { event.formattedTime } </p>
        < p > { event.eventStatusText } </p>
        < p > { event.attendeeStatus } </p>
          { event.canRegister && <button>Register </button> }
        </div>
    ))
}

<button 
        onClick={ () => setCurrentPage(p => p + 1) }
disabled = {!response.hasNext}
      >
    Load More
        </button>
        </div>
  );
}

// 10. API ENDPOINTS
// Base URL: https://clubwiz.in
// 
// GET /event-management/events/list?page=0&size=20&sortBy=startDateTime&sortOrder=asc
// GET /event-management/events/my-registrations?page=0&size=20
// GET /event-management/events/{id}/details

// 11. EVENT STATUS HELPERS
const statusColors = {
    UPCOMING: 'blue',
    ONGOING: 'green',
    COMPLETED: 'gray',
    CANCELLED: 'red'
};

const getStatusBadge = (event: PublicEventListItem) => {
    if (event.ongoing) return { text: 'Happening Now', color: 'green' };
    if (event.upcoming) return { text: event.eventStatusText, color: 'blue' };
    if (event.pastEvent) return { text: 'Ended', color: 'gray' };
    return { text: event.status, color: 'gray' };
};

// 12. REGISTRATION HELPERS
const canUserRegister = (event: PublicEventListItem) => {
    return event.canRegister && !event.isFull && !event.isRegistered;
};

const getRegisterButtonText = (event: PublicEventListItem) => {
    if (event.isRegistered) return 'Registered ✓';
    if (event.isFull) return 'Event Full';
    if (!event.canRegister) return 'Registration Closed';
    return 'Register Now';
};

// 13. DATE/TIME FORMATTING
const formatEventDateTime = (event: PublicEventListItem) => {
    return `${event.formattedDate} • ${event.formattedTime}`;
};

const getTimeInfo = (event: PublicEventListItem) => {
    return {
        when: event.timeUntilEvent,       // "Tomorrow", "In 4 days"
        duration: event.duration,          // "4h 30m"
        status: event.eventStatusText      // "Starts in 4 days"
    };
};
