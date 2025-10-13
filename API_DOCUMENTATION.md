# ClubViz API Documentation

This document provides a comprehensive overview of all API endpoints available in the ClubViz application. The APIs are organized by functionality and include examples for each endpoint.

## Table of Contents

1. [API Configuration](#api-configuration)
2. [Authentication APIs](#authentication-apis)
3. [Club APIs](#club-apis)
4. [Event APIs](#event-apis)
5. [Booking APIs](#booking-apis)
6. [User Profile APIs](#user-profile-apis)
7. [Review APIs](#review-apis)
8. [Media & Upload APIs](#media--upload-apis)
9. [Story APIs](#story-apis)
10. [Notification APIs](#notification-apis)
11. [Content & Search APIs](#content--search-apis)
12. [Error Handling](#error-handling)
13. [Usage Examples](#usage-examples)

## API Configuration

**Base URL:** `https://98.90.141.103/api`

**Authentication:** Bearer Token in Authorization header

**Content-Type:** `application/json` (except file uploads which use `multipart/form-data`)

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://98.90.141.103/api
```

## Authentication APIs

### Send OTP
**POST** `/auth/send-otp`

Send OTP for login, registration, or password reset.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "type": "login" // "login" | "register" | "forgot_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpSent": true,
    "message": "OTP sent to +919876543210"
  }
}
```

### Verify OTP
**POST** `/auth/verify-otp`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "type": "login"
}
```

### Login with Password
**POST** `/auth/login`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "userPassword123"
}
```

### Login with OTP
**POST** `/auth/login-otp`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

### Register User
**POST** `/auth/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

### Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### Get Current User
**GET** `/auth/me`

### Logout
**POST** `/auth/logout`

### Update Password
**PUT** `/auth/update-password`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

### Check Phone Exists
**POST** `/auth/check-phone`

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

### Delete Account
**DELETE** `/auth/delete-account`

**Request Body:**
```json
{
  "password": "userPassword123"
}
```

## Club APIs

### Get All Clubs
**GET** `/clubs`

**Query Parameters:**
- `latitude` (number): User's latitude
- `longitude` (number): User's longitude
- `radius` (number): Search radius in km
- `priceRange` (string): Comma-separated price ranges (e.g., "$,$$")
- `categories` (string): Comma-separated categories
- `amenities` (string): Comma-separated amenities
- `rating` (number): Minimum rating
- `sortBy` (string): "name" | "rating" | "distance" | "popularity" | "price"
- `sortOrder` (string): "asc" | "desc"
- `page` (number): Page number
- `limit` (number): Items per page

**Example Request:**
```
GET /clubs?latitude=21.1458&longitude=79.0882&radius=10&sortBy=rating&sortOrder=desc&page=1&limit=10
```

### Get Club by ID
**GET** `/clubs/{clubId}`

**Example Request:**
```
GET /clubs/club_123
```

### Get Featured Clubs
**GET** `/clubs/featured`

**Query Parameters:**
- `limit` (number): Number of clubs to return

### Get Nearby Clubs
**GET** `/clubs/nearby`

**Query Parameters:**
- `latitude` (number): Required
- `longitude` (number): Required
- `radius` (number): Radius in km (default: 10)
- `limit` (number): Number of clubs (default: 20)

### Search Clubs
**GET** `/clubs/search`

**Query Parameters:**
- `q` (string): Search query
- All filter parameters from Get All Clubs

### Get Club Categories
**GET** `/clubs/categories`

### Get Club Amenities
**GET** `/clubs/amenities`

### Add/Remove Club from Favorites
**POST** `/clubs/{clubId}/favorite`
**DELETE** `/clubs/{clubId}/favorite`

### Get User's Favorite Clubs
**GET** `/user/favorite-clubs`

### Check if Club is Favorite
**GET** `/clubs/{clubId}/favorite/status`

### Get Club Tables
**GET** `/clubs/{clubId}/tables`

**Query Parameters:**
- `date` (string): Date in YYYY-MM-DD format

### Get Club Gallery
**GET** `/clubs/{clubId}/gallery`

### Get Club Opening Hours
**GET** `/clubs/{clubId}/hours`

### Check Club Status
**GET** `/clubs/{clubId}/status`

### Get Clubs by City
**GET** `/clubs/city/{city}`

### Get Popular Clubs
**GET** `/clubs/popular`

### Get Recommended Clubs
**GET** `/clubs/recommendations`

### Report Club
**POST** `/clubs/{clubId}/report`

**Request Body:**
```json
{
  "reason": "inappropriate_content",
  "description": "Optional description"
}
```

## Event APIs

### Get All Events
**GET** `/events`

**Query Parameters:**
- `clubId` (string): Filter by club
- `startDate` (string): Start date filter (YYYY-MM-DD)
- `endDate` (string): End date filter (YYYY-MM-DD)
- `minPrice` (number): Minimum ticket price
- `maxPrice` (number): Maximum ticket price
- `musicGenres` (string): Comma-separated genres
- `latitude` (number): User's latitude
- `longitude` (number): User's longitude
- `radius` (number): Search radius in km
- `sortBy` (string): "date" | "price" | "popularity" | "name"
- `sortOrder` (string): "asc" | "desc"
- `page` (number): Page number
- `limit` (number): Items per page

### Get Event by ID
**GET** `/events/{eventId}`

### Get Featured Events
**GET** `/events/featured`

### Get Upcoming Events
**GET** `/events/upcoming`

### Get Events by Club
**GET** `/clubs/{clubId}/events`

### Search Events
**GET** `/events/search`

**Query Parameters:**
- `q` (string): Search query
- All filter parameters from Get All Events

### Get Popular Events
**GET** `/events/popular`

### Get Events by Date Range
**GET** `/events/date-range`

**Query Parameters:**
- `startDate` (string): Required
- `endDate` (string): Required

### Get Events by Genre
**GET** `/events/genre/{genre}`

### Get Music Genres
**GET** `/events/genres`

### Add/Remove Event from Favorites
**POST** `/events/{eventId}/favorite`
**DELETE** `/events/{eventId}/favorite`

### Get User's Favorite Events
**GET** `/user/favorite-events`

### Get Event Ticket Types
**GET** `/events/{eventId}/tickets`

### Get Event Performers
**GET** `/events/{eventId}/performers`

### Get Nearby Events
**GET** `/events/nearby`

### Get Today's Events
**GET** `/events/today`

### Get Weekend Events
**GET** `/events/weekend`

### Get Recommended Events
**GET** `/events/recommendations`

### Check Event Availability
**GET** `/events/{eventId}/availability`

### Get Events by Performer
**GET** `/performers/{performerId}/events`

## Booking APIs

### Create Booking
**POST** `/bookings`

**Request Body:**
```json
{
  "eventId": "event_123",
  "clubId": "club_123",
  "bookingType": "event",
  "dateTime": "2024-12-25T20:00:00Z",
  "guestCount": 4,
  "tableId": "table_5",
  "ticketTypeId": "ticket_vip",
  "quantity": 2,
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  },
  "specialRequests": "Birthday celebration",
  "promoCode": "SAVE20"
}
```

### Get Booking by ID
**GET** `/bookings/{bookingId}`

### Get User's Bookings
**GET** `/user/bookings`

**Query Parameters:**
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Items per page

### Update Booking
**PUT** `/bookings/{bookingId}`

### Cancel Booking
**POST** `/bookings/{bookingId}/cancel`

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

### Confirm Booking
**POST** `/bookings/{bookingId}/confirm`

### Get Available Tables
**GET** `/clubs/{clubId}/tables/available`

**Query Parameters:**
- `dateTime` (string): Required
- `guestCount` (number): Required

### Reserve Table Temporarily
**POST** `/tables/{tableId}/reserve-temp`

**Request Body:**
```json
{
  "dateTime": "2024-12-25T20:00:00Z",
  "duration": 30
}
```

### Release Table Reservation
**DELETE** `/reservations/{reservationId}`

### Get Booking Pricing
**POST** `/bookings/pricing`

**Request Body:**
```json
{
  "eventId": "event_123",
  "ticketTypeId": "ticket_vip",
  "quantity": 2,
  "promoCode": "SAVE20"
}
```

### Apply Promo Code
**POST** `/promos/validate`

**Request Body:**
```json
{
  "promoCode": "SAVE20",
  "eventId": "event_123",
  "quantity": 2
}
```

### Process Payment
**POST** `/payments/process`

**Request Body:**
```json
{
  "bookingId": "booking_123",
  "amount": 2500.00,
  "currency": "INR",
  "paymentMethod": "card",
  "paymentDetails": {
    "cardToken": "card_token_here"
  }
}
```

### Verify Payment
**POST** `/payments/verify`

**Request Body:**
```json
{
  "transactionId": "txn_123",
  "bookingId": "booking_123"
}
```

### Get Payment Methods
**GET** `/payments/methods`

### Generate Ticket
**POST** `/bookings/{bookingId}/ticket`

### Download Ticket
**GET** `/bookings/{bookingId}/ticket/download`

### Validate Ticket
**POST** `/tickets/validate`

**Request Body:**
```json
{
  "ticketNumber": "TKT123456",
  "qrCode": "qr_code_data"
}
```

### Use Ticket
**POST** `/tickets/use`

### Get Upcoming Bookings
**GET** `/user/bookings/upcoming`

### Get Past Bookings
**GET** `/user/bookings/past`

### Reschedule Booking
**PUT** `/bookings/{bookingId}/reschedule`

**Request Body:**
```json
{
  "newDateTime": "2024-12-26T20:00:00Z"
}
```

### Get Cancellation Policy
**GET** `/clubs/{clubId}/cancellation-policy`

### Request Refund
**POST** `/bookings/{bookingId}/refund`

**Request Body:**
```json
{
  "reason": "Event cancelled"
}
```

## User Profile APIs

### Get User Profile
**GET** `/user/profile`

### Update User Profile
**PUT** `/user/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

### Update User Avatar
**POST** `/user/avatar`

**Request Body:** FormData with 'avatar' file

### Update User Preferences
**PUT** `/user/preferences`

**Request Body:**
```json
{
  "favoriteClubs": ["club_1", "club_2"],
  "favoriteEvents": ["event_1", "event_2"],
  "musicGenres": ["techno", "house", "bollywood"],
  "drinkPreferences": ["cocktails", "beer"],
  "notifications": {
    "email": true,
    "sms": false,
    "push": true,
    "eventReminders": true,
    "promotions": false
  }
}
```

### Get User Preferences
**GET** `/user/preferences`

### Update Notification Settings
**PUT** `/user/notifications/settings`

### Get User Activity
**GET** `/user/activity`

### Get User Statistics
**GET** `/user/stats`

## Review APIs

### Create Review
**POST** `/reviews`

**Request Body:** FormData
- `clubId` (string): Optional
- `eventId` (string): Optional
- `rating` (number): 1-5
- `title` (string): Review title
- `content` (string): Review content
- `images` (File[]): Optional image files

### Get Reviews
**GET** `/reviews`

**Query Parameters:**
- `clubId` (string): Filter by club
- `eventId` (string): Filter by event
- `rating` (number): Filter by rating
- `sortBy` (string): "newest" | "oldest" | "rating_high" | "rating_low" | "helpful"
- `page` (number): Page number
- `limit` (number): Items per page

### Get Club Reviews
**GET** `/clubs/{clubId}/reviews`

### Get Event Reviews
**GET** `/events/{eventId}/reviews`

### Get User's Reviews
**GET** `/user/reviews`

### Update Review
**PUT** `/reviews/{reviewId}`

### Delete Review
**DELETE** `/reviews/{reviewId}`

### Mark Review as Helpful
**POST** `/reviews/{reviewId}/helpful`

### Remove Helpful Mark
**DELETE** `/reviews/{reviewId}/helpful`

### Report Review
**POST** `/reviews/{reviewId}/report`

**Request Body:**
```json
{
  "reason": "spam",
  "description": "This review is spam"
}
```

### Get Club Review Statistics
**GET** `/clubs/{clubId}/reviews/stats`

### Get Event Review Statistics
**GET** `/events/{eventId}/reviews/stats`

### Check if User Can Review
**GET** `/reviews/can-review`

**Query Parameters:**
- `clubId` (string): Optional
- `eventId` (string): Optional

### Get Featured Reviews
**GET** `/reviews/featured`

### Get Recent Reviews
**GET** `/reviews/recent`

## Media & Upload APIs

### Upload File
**POST** `/media/upload`

**Request Body:** FormData
- `file` (File): File to upload
- `type` (string): "avatar" | "club_image" | "event_image" | "review_image" | "story" | "document"
- `metadata` (string): Optional JSON metadata

### Upload Multiple Files
**POST** `/media/upload-multiple`

**Request Body:** FormData
- `files` (File[]): Files to upload
- `type` (string): File type
- `metadata` (string): Optional JSON metadata

### Delete File
**DELETE** `/media/delete`

**Request Body:**
```json
{
  "fileUrl": "https://example.com/image.jpg"
}
```

### Get File Metadata
**GET** `/media/metadata`

**Query Parameters:**
- `url` (string): File URL

### Generate Thumbnail
**POST** `/media/thumbnail`

**Request Body:**
```json
{
  "fileUrl": "https://example.com/image.jpg",
  "width": 200,
  "height": 200
}
```

### Resize Image
**POST** `/media/resize`

**Request Body:**
```json
{
  "fileUrl": "https://example.com/image.jpg",
  "width": 800,
  "height": 600,
  "quality": 80
}
```

## Story APIs

### Create Story
**POST** `/stories`

**Request Body:** FormData
- `mediaFile` (File): Story media file
- `clubId` (string): Club ID
- `title` (string): Optional
- `description` (string): Optional
- `duration` (number): Duration in seconds (default: 24 hours)

### Get Active Stories
**GET** `/stories/active`

**Query Parameters:**
- `clubId` (string): Optional club filter

### Get Story by ID
**GET** `/stories/{storyId}`

### Get Club Stories
**GET** `/clubs/{clubId}/stories`

### View Story
**POST** `/stories/{storyId}/view`

### Get Story Views
**GET** `/stories/{storyId}/views`

### Delete Story
**DELETE** `/stories/{storyId}`

### Get Story Analytics
**GET** `/stories/{storyId}/analytics`

### Archive Story
**POST** `/stories/{storyId}/archive`

### Get Archived Stories
**GET** `/clubs/{clubId}/stories/archived`

## Notification APIs

### Get Notifications
**GET** `/notifications`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unreadOnly` (boolean): Show only unread notifications

### Mark as Read
**PUT** `/notifications/{notificationId}/read`

### Mark All as Read
**PUT** `/notifications/read-all`

### Delete Notification
**DELETE** `/notifications/{notificationId}`

### Get Unread Count
**GET** `/notifications/unread-count`

### Subscribe to Push Notifications
**POST** `/notifications/push/subscribe`

### Unsubscribe from Push Notifications
**POST** `/notifications/push/unsubscribe`

## Content & Search APIs

### Search Content
**GET** `/search`

**Query Parameters:**
- `q` (string): Search query
- `type` (string): "clubs" | "events" | "users" | "all"
- Additional filter parameters

### Location Search
**POST** `/search/location`

**Request Body:**
```json
{
  "query": "nightclub",
  "latitude": 21.1458,
  "longitude": 79.0882,
  "radius": 10,
  "type": "club"
}
```

### Get Trending Content
**GET** `/content/trending`

### Get Content Recommendations
**GET** `/content/recommendations`

### Report Content
**POST** `/content/report`

**Request Body:**
```json
{
  "contentType": "club",
  "contentId": "club_123",
  "reason": "inappropriate_content",
  "description": "Optional description"
}
```

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Phone number is required",
      "field": "phone"
    }
  ]
}
```

### Common HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **422** - Validation Error
- **500** - Internal Server Error

## Usage Examples

### Authentication Flow

```typescript
import { AuthService } from '@/lib/services/auth.service';

// Send OTP for login
const otpResult = await AuthService.sendOTP({
  phone: '+919876543210',
  type: 'login'
});

// Login with OTP
const loginResult = await AuthService.loginWithOTP({
  phone: '+919876543210',
  otp: '123456'
});

// Use the token for subsequent requests
console.log('Token:', loginResult.data.token);
```

### Booking Flow

```typescript
import { BookingService } from '@/lib/services/booking.service';
import { ClubService } from '@/lib/services/club.service';

// Get available tables
const tablesResult = await BookingService.getAvailableTables(
  'club_123',
  '2024-12-25T20:00:00Z',
  4
);

// Create booking
const bookingResult = await BookingService.createBooking({
  clubId: 'club_123',
  bookingType: 'table',
  dateTime: '2024-12-25T20:00:00Z',
  guestCount: 4,
  tableId: 'table_5',
  contactInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+919876543210'
  }
});

// Process payment
const paymentResult = await BookingService.processPayment({
  bookingId: bookingResult.data.id,
  amount: 2500.00,
  currency: 'INR',
  paymentMethod: 'card',
  paymentDetails: { cardToken: 'card_token' }
});
```

### Search and Filter

```typescript
import { ClubService } from '@/lib/services/club.service';
import { EventService } from '@/lib/services/event.service';

// Search clubs with filters
const clubsResult = await ClubService.getClubs({
  location: {
    latitude: 21.1458,
    longitude: 79.0882,
    radius: 10
  },
  priceRange: ['$$', '$$$'],
  categories: ['nightclub', 'lounge'],
  sortBy: 'rating',
  sortOrder: 'desc',
  page: 1,
  limit: 10
});

// Search events
const eventsResult = await EventService.searchEvents('techno party', {
  dateRange: {
    startDate: '2024-12-20',
    endDate: '2024-12-31'
  },
  priceRange: {
    min: 500,
    max: 3000
  },
  musicGenres: ['techno', 'house']
});
```

### File Upload

```typescript
import { MediaService } from '@/lib/services/media.service';

// Upload user avatar
const file = event.target.files[0];
const uploadResult = await MediaService.uploadFile(
  file,
  'avatar',
  { userId: 'user_123' }
);

console.log('Uploaded URL:', uploadResult.data.url);
```

---

**Note:** This documentation covers all the API endpoints implemented in the ClubViz application. Make sure to handle errors appropriately and implement proper loading states in your frontend components when calling these APIs.

For any questions or issues with the API, please refer to the service files in `/lib/services/` directory.