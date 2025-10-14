// Common API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Authentication Types
export interface LoginRequest {
  phone: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface OTPRequest {
  phone: string;
  type: 'login' | 'register' | 'forgot_password';
}

export interface OTPVerifyRequest {
  phone: string;
  otp: string;
  type: 'login' | 'register' | 'forgot_password';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// User Types
export interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: number;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  favoriteClubs: string[];
  favoriteEvents: string[];
  musicGenres: string[];
  drinkPreferences: string[];
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  eventReminders: boolean;
  promotions: boolean;
}

// Club Types
export interface Club {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  images: string[];
  logo?: string;
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  categories: string[];
  amenities: string[];
  openingHours: OpeningHours[];
  socialMedia: SocialMedia;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  openTime: string; // "18:00"
  closeTime: string; // "02:00"
  isClosed: boolean;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface ClubsFilter {
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  priceRange?: ('$' | '$$' | '$$$' | '$$$$')[];
  categories?: string[];
  amenities?: string[];
  rating?: number;
  sortBy?: 'name' | 'rating' | 'distance' | 'popularity' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  clubId: string;
  club: Club;
  coverImage: string;
  images: string[];
  startDateTime: string;
  endDateTime: string;
  ticketPrice: {
    min: number;
    max: number;
    currency: string;
  };
  ticketTypes: TicketType[];
  capacity: number;
  soldTickets: number;
  ageRestriction: number;
  dressCode?: string;
  musicGenres: string[];
  performers: Performer[];
  isActive: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  sold: number;
  isActive: boolean;
}

export interface Performer {
  id: string;
  name: string;
  type: 'dj' | 'band' | 'artist' | 'performer';
  image?: string;
  bio?: string;
  socialMedia: SocialMedia;
}

export interface EventsFilter {
  clubId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  musicGenres?: string[];
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  sortBy?: 'date' | 'price' | 'popularity' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Booking Types
export interface BookingRequest {
  eventId?: string;
  clubId?: string;
  bookingType: 'event' | 'table' | 'general';
  dateTime: string;
  guestCount: number;
  tableId?: string;
  ticketTypeId?: string;
  quantity?: number;
  contactInfo: ContactInfo;
  specialRequests?: string;
  promoCode?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  user: User;
  eventId?: string;
  event?: Event;
  clubId: string;
  club: Club;
  bookingType: 'event' | 'table' | 'general';
  dateTime: string;
  guestCount: number;
  tableId?: string;
  table?: Table;
  ticketTypeId?: string;
  ticketType?: TicketType;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  contactInfo: ContactInfo;
  specialRequests?: string;
  promoCode?: string;
  qrCode: string;
  ticket?: TicketInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  floor: string;
  section: string;
  isVip: boolean;
  minimumSpend: number;
  position: {
    x: number;
    y: number;
  };
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
}

export interface TicketInfo {
  ticketNumber: string;
  qrCode: string;
  downloadUrl: string;
  isValid: boolean;
  usedAt?: string;
}

// Payment Types
export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'netbanking';
  paymentDetails: any; // Payment gateway specific data
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  gatewayResponse: any;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: User;
  clubId?: string;
  eventId?: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  response?: ClubResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ClubResponse {
  content: string;
  respondedAt: string;
  respondedBy: string;
}

export interface ReviewRequest {
  clubId?: string;
  eventId?: string;
  rating: number;
  title: string;
  content: string;
  images?: File[];
}

export interface ReviewsFilter {
  clubId?: string;
  eventId?: string;
  rating?: number;
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  page?: number;
  limit?: number;
}

// Story Types
export interface Story {
  id: string;
  clubId: string;
  club: Club;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration: number; // in seconds
  title?: string;
  description?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface StoryView {
  storyId: string;
  userId: string;
  viewedAt: string;
}

// Location Types
export interface LocationSearchRequest {
  query?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in km
  type?: 'club' | 'event' | 'all';
}

export interface LocationResult {
  id: string;
  name: string;
  type: 'club' | 'event';
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // in km
  rating: number;
  image: string;
}

// Analytics Types
export interface Analytics {
  clubViews: number;
  eventViews: number;
  bookings: number;
  revenue: number;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'event' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Upload Types
export interface UploadRequest {
  file: File;
  type: 'avatar' | 'club_image' | 'event_image' | 'review_image' | 'story';
  metadata?: any;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}