// PUBLIC CLUB API - QUICK REFERENCE
// ===================================

// 1. IMPORT THE SERVICE
import { PublicClubService } from '@/lib/services/public.service';

// 2. FETCH CLUBS LIST (with pagination & filters)
const response = await PublicClubService.getPublicClubsList({
  page: 0,              // Page number (0-indexed)
  size: 10,             // Items per page
  sortBy: 'createdAt',  // Sort field
  sortDirection: 'desc', // 'asc' or 'desc'
  category: 'Nightclub', // Optional: filter by category
  location: 'Mumbai',    // Optional: filter by location
  query: 'DABO',        // Optional: search query
  hasSpace: true        // Optional: only clubs with space
});

// Response structure:
// {
//   content: PublicClubListItem[],
//   totalElements: number,
//   totalPages: number,
//   currentPage: number,
//   size: number,
//   hasNext: boolean,
//   hasPrevious: boolean,
//   first: boolean,
//   last: boolean,
//   paginationInfo: string,
//   resultsInfo: string
// }

// 3. FETCH SINGLE CLUB DETAILS
const clubDetails = await PublicClubService.getPublicClubById('696a67d25d8fad751e37fbd5');

// Returns: PublicClubDetails with full club information

// 4. FETCH FILTER OPTIONS
const categories = await PublicClubService.getClubCategories();
// Returns: string[] - e.g., ['Nightclub', 'Bar & Lounge', 'Cafe']

const locations = await PublicClubService.getClubLocations();
// Returns: string[] - e.g., ['Mumbai', 'Delhi', 'Bangalore']

// 5. USING THE CUSTOM HOOK
import { usePublicClubs } from '@/hooks/use-public-clubs';

function MyComponent() {
  const {
    clubs,          // Current club list response
    clubDetails,    // Current club details
    categories,     // Available categories
    locations,      // Available locations
    loading,        // Loading state
    error,          // Error message
    fetchClubsList, // Function to fetch clubs
    fetchClubDetails, // Function to fetch club details
    fetchCategories, // Function to fetch categories
    fetchLocations,  // Function to fetch locations
    clearError,     // Clear error state
    reset          // Reset all state
  } = usePublicClubs();

  // Fetch on mount
  useEffect(() => {
    fetchCategories();
    fetchLocations();
    fetchClubsList({ page: 0, size: 20 });
  }, []);

  // Apply filters
  const handleFilter = (category: string, location: string) => {
    fetchClubsList({
      page: 0,
      size: 20,
      category,
      location
    });
  };

  return (
    <div>
      {loading && <Loader />}
      {error && <Error message={error} />}
      {clubs?.content.map(club => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}

// 6. CHECK IF GUEST MODE
import { isGuestMode } from '@/lib/api-client-public';

if (isGuestMode()) {
  // User is not authenticated - use public APIs
  const clubs = await PublicClubService.getPublicClubsList();
} else {
  // User is authenticated - use regular APIs
  const clubs = await ClubService.getClubsList();
}

// 7. CLUB LIST ITEM STRUCTURE
interface PublicClubListItem {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  category: string | null;
  location: string | null;
  memberCount: number;
  maxMembers: number | null;
  isJoined: boolean;
  isFull: boolean;
  isActive: boolean;
  ownerName: string;
  createdAt: string;
  shortDescription: string;
  memberStatus: string;        // e.g., "1/0 members"
  capacityPercentage: number;  // 0-100
}

// 8. CLUB DETAILS STRUCTURE
interface PublicClubDetails {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  images: string[];
  category: string | null;
  locationText: {
    address1: string;
    address2: string;
    state: string;
    city: string;
    pincode: string;
  } | null;
  locationMap: {
    lat: number;
    lng: number;
  } | null;
  contactEmail: string;
  contactPhone: string;
  foodCuisines: string[] | null;
  facilities: string[] | null;
  music: string[] | null;
  barOptions: string[] | null;
  entryPricing: any | null;
  memberCount: number;
  maxMembers: number;
  isJoined: boolean;
  canJoin: boolean;
  isFull: boolean;
  isActive: boolean;
  owner: any | null;
  recentMembers: any[];
  admins: any[];
  createdAt: string;
  updatedAt: string;
  memberStatus: string;
  capacityPercentage: number;
  joinButtonText: string;
  canPerformAction: boolean;
}

// 9. EXAMPLE: CLUBS PAGE WITH FILTERS
function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadClubs();
  }, [selectedCategory, selectedLocation]);

  const loadFilters = async () => {
    const [cats, locs] = await Promise.all([
      PublicClubService.getClubCategories(),
      PublicClubService.getClubLocations()
    ]);
    setCategories(cats);
    setLocations(locs);
  };

  const loadClubs = async () => {
    const response = await PublicClubService.getPublicClubsList({
      page: 0,
      size: 20,
      category: selectedCategory,
      location: selectedLocation,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    });
    setClubs(response.content);
  };

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <select onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="">All Locations</option>
        {locations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {clubs.map(club => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}

// 10. API ENDPOINTS
// Base URL: https://clubwiz.in
// 
// GET /clubs/public/list?page=0&size=10&sortBy=createdAt&sortDirection=desc
// GET /clubs/public/{id}
// GET /clubs/public/categories
// GET /clubs/public/locations
