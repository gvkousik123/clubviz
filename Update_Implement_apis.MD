# 🎉 ClubWiz API Documentation

> A complete reference for the ClubWiz REST API — covering Club Favorites, Event Favorites, Search, and Authentication (OTP).

---

## 📋 Table of Contents

- [Base URL](#-base-url)
- [Authentication](#-authentication)
- [Response Format](#-response-format)
- [Favorites APIs](#-favorites-apis)
  - [Get User Favorites](#1-get-user-favorites)
  - [Add Club to Favorites](#2-add-club-to-favorites)
  - [Remove Club from Favorites](#3-remove-club-from-favorites)
  - [Get Favorite Count](#4-get-favorite-count-for-a-club)
  - [Check Favorite Status](#5-check-if-club-is-favorited)
- [Authentication APIs](#-authentication-apis)
  - [Send Password Reset OTP](#6-send-password-reset-otp)
- [Search APIs](#-search-apis)
  - [Quick Search](#7-quick-search)
  - [Autocomplete Search](#8-autocomplete-search)
  - [Nearby Search](#9-nearby-search)
- [Event Favorites APIs](#-event-favorites-apis)
  - [Get User Favorite Events](#10-get-user-favorite-events)
  - [Add Event to Favorites](#11-add-event-to-favorites)
  - [Remove Event from Favorites](#12-remove-event-from-favorites)
  - [Get Favorite Count for an Event](#13-get-favorite-count-for-an-event)
  - [Check if Event is Favorited](#14-check-if-event-is-favorited)
- [API Summary Table](#-api-summary-table)
- [Error Handling](#-error-handling)

---

## 🌐 Base URL

```
https://clubwiz.in
```

---

## 🔐 Authentication

Most endpoints require a **Bearer Token** in the Authorization header.

```http
Authorization: Bearer <your_jwt_token>
```

> ⚠️ The OTP endpoint does **not** require authentication.

---

## 📦 Response Format

All responses return **JSON**. Standard fields:

| Field | Type | Description |
|-------|------|-------------|
| `message` | `string` | Human-readable result message |
| `clubId` | `string` | The club's unique identifier |
| `favorited` | `boolean` | Whether the club is currently favorited |

---

## ❤️ Favorites APIs

---

### 1. Get User Favorites

Retrieves a paginated list of all clubs favorited by the authenticated user.

```http
GET /clubs/user/favorites
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `0` | Page number (0-indexed) |
| `size` | `integer` | No | `10` | Number of results per page |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/clubs/user/favorites?page=0&size=10' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "size": 10,
  "clubs": [
    {
      "id": "697499d433c602133f2a28b7",
      "name": "DABO BAR AND KITCHEN",
      "description": "A premium nightclub offering excellent ambiance, great food & drinks with a vibrant music scene",
      "logo": "https://clubwiz-images.s3.us-east-1.amazonaws.com/clubs/.../logo.jpg",
      "images": [
        { "type": "food",    "url": "https://clubwiz-images.s3..." },
        { "type": "food",    "url": "https://clubwiz-images.s3..." },
        { "type": "ambiance","url": "https://clubwiz-images.s3..." },
        { "type": "ambiance","url": "https://clubwiz-images.s3..." },
        { "type": "menu",    "url": "https://clubwiz-images.s3..." }
      ],
      "category": "Nightclub",
      "carouselCategories": [],
      "locationText": {
        "address1": "Plot No. 15, Bandra Reclamation",
        "address2": "Near Worli Sea Link",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050"
      },
      "locationMap": {
        "lat": 19.0176,
        "lng": 72.8298
      },
      "contactEmail": "example@gmail.com",
      "contactPhone": "+91-9876543210",
      "foodCuisines": null,
      "facilities": null,
      "music": null,
      "barOptions": null,
      "entryPricing": null,
      "memberCount": 0,
      "maxMembers": 500,
      "isJoined": false,
      "canJoin": true,
      "isFull": false,
      "isActive": true,
      "owner": null,
      "recentMembers": [],
      "admins": [],
      "memberStatus": "0/500 members",
      "capacityPercentage": 0,
      "joinButtonText": "Join Club",
      "canPerformAction": true,
      "createdAt": "2026-01-24T15:37:16.561",
      "updatedAt": "2026-01-24T18:43:35.872"
    }
  ],
  "totalPages": 1,
  "page": 0,
  "totalCount": 3
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `size` | `integer` | Page size requested |
| `clubs` | `array` | List of favorited club objects |
| `totalPages` | `integer` | Total number of pages |
| `page` | `integer` | Current page index |
| `totalCount` | `integer` | Total number of favorited clubs |

---

### 2. Add Club to Favorites

Adds a specific club to the authenticated user's favorites list.

```http
POST /clubs/{clubId}/favorite
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clubId` | `string` | ✅ Yes | Unique ID of the club to favorite |

#### Request

```bash
curl -X POST \
  'https://clubwiz.in/clubs/6978e6579fa7390164ce71d2/favorite' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <your_token>' \
  -d ''
```

#### Response `200 OK`

```json
{
  "message": "Club added to favorites successfully",
  "clubId": "6978e6579fa7390164ce71d2",
  "favorited": true
}
```

---

### 3. Remove Club from Favorites

Removes a specific club from the authenticated user's favorites list.

```http
DELETE /clubs/{clubId}/favorite
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clubId` | `string` | ✅ Yes | Unique ID of the club to unfavorite |

#### Request

```bash
curl -X DELETE \
  'https://clubwiz.in/clubs/6978e6579fa7390164ce71d2/favorite' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "message": "Club removed from favorites successfully",
  "clubId": "6978e6579fa7390164ce71d2",
  "favorited": false
}
```

---

### 4. Get Favorite Count for a Club

Returns the total number of users who have favorited a specific club.

```http
GET /clubs/{clubId}/favorite-count
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clubId` | `string` | ✅ Yes | Unique ID of the club |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/clubs/6978b79d1f9d78611f070186/favorite-count' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "clubId": "6978b79d1f9d78611f070186",
  "favoriteCount": 0
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `clubId` | `string` | The club's unique identifier |
| `favoriteCount` | `integer` | Total number of users who favorited this club |

---

### 5. Check if Club is Favorited

Checks whether the authenticated user has favorited a specific club.

```http
GET /clubs/{clubId}/is-favorited
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clubId` | `string` | ✅ Yes | Unique ID of the club to check |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/clubs/6978e6579fa7390164ce71d2/is-favorited' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK` — (Club is favorited)

```json
{
  "message": "Club is in your favorites",
  "clubId": "6978e6579fa7390164ce71d2",
  "favorited": true
}
```

#### Response `200 OK` — (Club is not favorited)

```json
{
  "message": "Club is not in your favorites",
  "clubId": "6978e6579fa7390164ce71d2",
  "favorited": false
}
```

---

## 🔑 Authentication APIs

---

### 6. Send Password Reset OTP

Sends a one-time password (OTP) to the user's registered email and mobile number for password reset.

```http
POST /notification/api/otp/send-password-reset-otp
```

> 🔓 This endpoint does **not** require an Authorization header.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | ✅ Yes | The user's registered email address |
| `otp` | `string` | ✅ Yes | The OTP code to be sent to the user |

#### Request

```bash
curl -X POST \
  'https://clubwiz.in/notification/api/otp/send-password-reset-otp?email=user@gmail.com&otp=333316' \
  -H 'accept: */*' \
  -d ''
```

#### Response `200 OK`

```json
{
  "returnCode": 101,
  "returnMessage": "OTP sent successfully to your email and mobile.",
  "transactionId": null,
  "jwtToken": null
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `returnCode` | `integer` | Status code — `101` indicates success |
| `returnMessage` | `string` | Human-readable status message |
| `transactionId` | `string\|null` | Transaction reference (if applicable) |
| `jwtToken` | `string\|null` | JWT token returned post-OTP (if applicable) |

---

## 🔍 Search APIs

---

### 7. Quick Search

Search for clubs and events using a text query, with optional geo-filtering and pagination.

```http
GET /search/search/v2/quick
```

> 🔓 No Authorization header required.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | `string` | ✅ Yes | — | Search keyword (e.g. `night`, `jazz`) |
| `lat` | `double` | No | — | User latitude for distance-based sorting |
| `lng` | `double` | No | — | User longitude for distance-based sorting |
| `radiusKm` | `double` | No | — | Search radius in kilometers |
| `searchType` | `string` | No | `ALL` | One of: `ALL`, `CLUBS_ONLY`, `EVENTS_ONLY` |
| `page` | `integer` | No | `0` | Page number (0-indexed) |
| `size` | `integer` | No | `20` | Results per page |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/search/search/v2/quick?query=night&page=0&size=20' \
  -H 'accept: */*'
```

#### Response `200 OK`

```json
{
  "query": "night",
  "totalResults": 2,
  "page": 0,
  "size": 20,
  "totalPages": 1,
  "clubs": [
    {
      "id": "697499d433c602133f2a28b7",
      "name": "DABO BAR AND KITCHEN",
      "description": "A premium nightclub offering excellent ambiance, great food & drinks with a vibrant music scene",
      "logoUrl": "https://clubwiz-images.s3...",
      "images": [
        "https://clubwiz-images.s3.../food.jpg",
        "https://clubwiz-images.s3.../ambiance.jpg",
        "https://clubwiz-images.s3.../menu.jpg"
      ],
      "address": "Plot No. 15, Bandra Reclamation, Mumbai",
      "distanceKm": null,
      "coordinates": {
        "latitude": 19.0176,
        "longitude": 72.8298
      },
      "cuisines": null,
      "facilities": null,
      "musicGenres": null,
      "barOptions": null,
      "coupleEntryPrice": null,
      "groupEntryPrice": null,
      "priceRange": "MODERATE",
      "rating": 0,
      "reviewCount": 0,
      "isPopular": false,
      "isNew": true,
      "openingHours": null,
      "isOpenNow": true,
      "tags": []
    }
  ],
  "events": [],
  "facets": {
    "cuisines": [],
    "musicGenres": [],
    "facilities": [],
    "priceRanges": [
      { "name": "MODERATE", "count": 2 }
    ],
    "areas": null
  },
  "suggestions": [
    "Try searching for 'nightclub'",
    "Try searching for 'live music'",
    "Try searching for events near you"
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `query` | `string` | The search term used |
| `totalResults` | `integer` | Total matching results |
| `page` | `integer` | Current page index |
| `size` | `integer` | Results per page |
| `totalPages` | `integer` | Total number of pages |
| `clubs` | `array` | List of matching club objects |
| `events` | `array` | List of matching event objects |
| `facets` | `object` | Aggregated filter options (cuisines, music, price ranges, areas) |
| `suggestions` | `array` | Search suggestions for the user |

#### Club Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique club ID |
| `name` | `string` | Club name |
| `description` | `string` | Club description |
| `logoUrl` | `string\|null` | URL of the club logo |
| `images` | `array` | List of image URLs |
| `address` | `string\|null` | Full address string |
| `distanceKm` | `double\|null` | Distance from user (if lat/lng provided) |
| `coordinates` | `object\|null` | `{ latitude, longitude }` |
| `priceRange` | `string` | e.g. `MODERATE`, `BUDGET`, `PREMIUM` |
| `rating` | `float` | Average rating (0–5) |
| `reviewCount` | `integer` | Total number of reviews |
| `isPopular` | `boolean` | Whether the club is trending |
| `isNew` | `boolean` | Whether the club was recently added |
| `isOpenNow` | `boolean` | Whether the club is currently open |
| `tags` | `array` | Associated tags |

---

### 8. Autocomplete Search

Returns autocomplete suggestions for a partial search query. Ideal for search-as-you-type UI.

```http
GET /search/search/v2/autocomplete
```

> 🔓 No Authorization header required.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | `string` | ✅ Yes | Partial search text for suggestions |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/search/search/v2/autocomplete?query=re' \
  -H 'accept: */*'
```

#### Response `200 OK`

```json
{
  "query": "re",
  "suggestions": []
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `query` | `string` | The partial query string sent |
| `suggestions` | `array` | List of suggested search terms (empty if no matches) |

---

### 9. Nearby Search

Search for clubs and events near a given geographic location, with optional filters for cuisine, music genre, and more.

```http
GET /search/search/v2/nearby
```

> 🔓 No Authorization header required.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | `double` | ✅ Yes | — | User latitude |
| `lng` | `double` | ✅ Yes | — | User longitude |
| `radiusKm` | `double` | No | — | Search radius in kilometers |
| `cuisines` | `array[string]` | No | — | Filter by cuisines (comma-separated) |
| `musicGenres` | `array[string]` | No | — | Filter by music genres (comma-separated) |
| `page` | `integer` | No | `0` | Page number (0-indexed) |
| `size` | `integer` | No | `20` | Results per page |

#### Request

```bash
curl -X GET \
  'https://clubwiz.in/search/search/v2/nearby?lat=17.40&lng=17.45&radiusKm=10&page=0&size=20' \
  -H 'accept: */*'
```

#### Response `200 OK`

```json
{
  "query": null,
  "totalResults": 0,
  "page": 0,
  "size": 20,
  "totalPages": 0,
  "clubs": [],
  "events": [],
  "facets": {
    "cuisines": [],
    "musicGenres": [],
    "facilities": [],
    "priceRanges": [],
    "areas": null
  },
  "suggestions": []
}
```

> 📌 Response structure is the same as [Quick Search](#7-quick-search). Returns empty arrays when no clubs/events are found within the specified radius.

---

## 🎟️ Event Favorites APIs

---

### 10. Get User Favorite Events

Retrieves a paginated list of all events bookmarked by the authenticated user.

```http
GET /event-management/events/user/favorites
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `0` | Page number (0-indexed) |
| `size` | `integer` | No | `10` | Results per page |

#### Request

```bash
curl -X GET   'https://clubwiz.in/event-management/events/user/favorites?page=0&size=10'   -H 'accept: */*'   -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "size": 10,
  "totalPages": 1,
  "page": 0,
  "totalCount": 1,
  "events": [
    {
      "id": "69751e6e25a97a7e66b5fe87",
      "title": "Bollywood Beats Night",
      "description": "Join us for an incredible night of electronic music with world-class DJs and performers...",
      "imageUrl": null,
      "images": null,
      "location": "Grand Event Venue, Downtown",
      "coordinates": { "lat": 40.7128, "lng": -74.006 },
      "startDateTime": "2026-01-28T16:30:00",
      "endDateTime": "2026-01-29T00:30:00",
      "formattedDate": "Wednesday, January 28, 2026",
      "formattedTime": "4:30 PM - 12:30 AM",
      "timeUntilEvent": "Started",
      "duration": "8 hours",
      "attendeeCount": 0,
      "maxAttendees": 500,
      "isRegistered": false,
      "canRegister": false,
      "isFull": false,
      "rsvpStatus": "NOT_REGISTERED",
      "club": {
        "id": "697499d433c602133f2a28b7",
        "name": "DABO BAR AND KITCHEN",
        "logo": "https://clubwiz-images.s3...",
        "category": "Nightclub"
      },
      "organizer": null,
      "recentAttendees": [],
      "status": "UPCOMING",
      "isPublic": true,
      "requiresApproval": false,
      "maleStagEntry":          { "price": 1000, "fee": null, "description": "Entry for male stag guests" },
      "femaleStagEntry":        { "price": 500,  "fee": null, "description": "Entry for female stag guests" },
      "coupleEntry":            { "price": 1500, "fee": null, "description": "Entry for couples" },
      "earlyBirdMaleStagEntry": { "price": 800,  "fee": null, "description": "Early bird male stag entry (valid till 9 PM)" },
      "earlyBirdFemaleStagEntry":{ "price": 400, "fee": null, "description": "Early bird female stag entry (valid till 9 PM)" },
      "earlyBirdCoupleEntry":   { "price": 1200, "fee": null, "description": "Early bird couple entry (valid till 9 PM)" },
      "ticketTypes": [
        { "name": "General Entry", "price": 50,  "currency": "USD", "quantity": 300, "isActive": true },
        { "name": "VIP Access",    "price": 100, "currency": "USD", "quantity": 100, "isActive": true },
        { "name": "Premium VIP",   "price": 150, "currency": "USD", "quantity": 50,  "isActive": true }
      ],
      "attendeeStatus": "0/500 attending",
      "capacityPercentage": 0,
      "registerButtonText": "Event Ended",
      "canPerformAction": false,
      "createdAt": "2026-01-24T19:33:02.178",
      "updatedAt": "2026-01-24T19:33:05.72"
    }
  ]
}
```

#### Event Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique event ID |
| `title` | `string` | Event title |
| `description` | `string` | Full event description |
| `location` | `string` | Venue name and address |
| `coordinates` | `object` | `{ lat, lng }` of the venue |
| `startDateTime` | `string` | ISO 8601 start timestamp |
| `endDateTime` | `string` | ISO 8601 end timestamp |
| `formattedDate` | `string` | Human-readable date |
| `formattedTime` | `string` | Human-readable time range |
| `duration` | `string` | Total event duration |
| `attendeeCount` | `integer` | Current number of attendees |
| `maxAttendees` | `integer` | Maximum capacity |
| `isRegistered` | `boolean` | Whether the current user is registered |
| `canRegister` | `boolean` | Whether registration is still open |
| `isFull` | `boolean` | Whether event is at capacity |
| `rsvpStatus` | `string` | e.g. `NOT_REGISTERED`, `REGISTERED` |
| `status` | `string` | e.g. `UPCOMING`, `ONGOING`, `ENDED` |
| `isPublic` | `boolean` | Whether event is open to the public |
| `requiresApproval` | `boolean` | Whether registration needs admin approval |
| `club` | `object` | Hosting club summary `{ id, name, logo, category }` |
| `maleStagEntry` | `object` | `{ price, fee, description }` for male stag |
| `femaleStagEntry` | `object` | `{ price, fee, description }` for female stag |
| `coupleEntry` | `object` | `{ price, fee, description }` for couples |
| `earlyBirdMaleStagEntry` | `object` | Early bird male stag pricing |
| `earlyBirdFemaleStagEntry` | `object` | Early bird female stag pricing |
| `earlyBirdCoupleEntry` | `object` | Early bird couple pricing |
| `ticketTypes` | `array` | Ticket tiers: `{ name, price, currency, quantity, isActive }` |
| `attendeeStatus` | `string` | e.g. `"0/500 attending"` |
| `registerButtonText` | `string` | UI label for the register CTA |
| `canPerformAction` | `boolean` | Whether user can take action on this event |

---

### 11. Add Event to Favorites

Adds a specific event to the authenticated user's favorites list.

```http
POST /event-management/events/{eventId}/favorite
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | `string` | Yes | Unique ID of the event to favorite |

#### Request

```bash
curl -X POST   'https://clubwiz.in/event-management/events/69751e6e25a97a7e66b5fe87/favorite'   -H 'accept: */*'   -H 'Authorization: Bearer <your_token>'   -d ''
```

#### Response `200 OK`

```json
{
  "message": "Event added to favorites successfully",
  "eventId": "69751e6e25a97a7e66b5fe87",
  "favorited": true
}
```

---

### 12. Remove Event from Favorites

Removes a specific event from the authenticated user's favorites list.

```http
DELETE /event-management/events/{eventId}/favorite
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | `string` | Yes | Unique ID of the event to unfavorite |

#### Request

```bash
curl -X DELETE   'https://clubwiz.in/event-management/events/69751e6e25a97a7e66b5fe87/favorite'   -H 'accept: */*'   -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "message": "Event removed from favorites successfully",
  "eventId": "69751e6e25a97a7e66b5fe87",
  "favorited": false
}
```

---

### 13. Get Favorite Count for an Event

Returns the total number of users who have favorited a specific event.

```http
GET /event-management/events/{eventId}/favorite-count
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | `string` | Yes | Unique ID of the event |

#### Request

```bash
curl -X GET   'https://clubwiz.in/event-management/events/69751e6e25a97a7e66b5fe87/favorite-count'   -H 'accept: */*'   -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK`

```json
{
  "eventId": "69751e6e25a97a7e66b5fe87",
  "favoriteCount": 1
}
```

---

### 14. Check if Event is Favorited

Checks whether the authenticated user has favorited a specific event.

```http
GET /event-management/events/{eventId}/is-favorited
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | `string` | Yes | Unique ID of the event to check |

#### Request

```bash
curl -X GET   'https://clubwiz.in/event-management/events/69751e6e25a97a7e66b5fe87/is-favorited'   -H 'accept: */*'   -H 'Authorization: Bearer <your_token>'
```

#### Response `200 OK` — (Event is favorited)

```json
{
  "message": "Event is in your favorites",
  "eventId": "69751e6e25a97a7e66b5fe87",
  "favorited": true
}
```

#### Response `200 OK` — (Event is not favorited)

```json
{
  "message": "Event is not in your favorites",
  "eventId": "69751e6e25a97a7e66b5fe87",
  "favorited": false
}
```

---

## 📊 API Summary Table

| # | Method | Endpoint | Description | Auth Required |
|---|--------|----------|-------------|:---:|
| 1 | `GET` | `/clubs/user/favorites` | Get all favorited clubs (paginated) | ✅ |
| 2 | `POST` | `/clubs/{clubId}/favorite` | Add a club to favorites | ✅ |
| 3 | `DELETE` | `/clubs/{clubId}/favorite` | Remove a club from favorites | ✅ |
| 4 | `GET` | `/clubs/{clubId}/favorite-count` | Get total favorite count for a club | ✅ |
| 5 | `GET` | `/clubs/{clubId}/is-favorited` | Check if current user has favorited a club | ✅ |
| 6 | `POST` | `/notification/api/otp/send-password-reset-otp` | Send password reset OTP to user | ❌ |
| 7 | `GET` | `/search/search/v2/quick` | Full-text search for clubs & events | ❌ |
| 8 | `GET` | `/search/search/v2/autocomplete` | Autocomplete suggestions for search input | ❌ |
| 9 | `GET` | `/search/search/v2/nearby` | Search clubs/events by geographic proximity | ❌ |
| 10 | `GET` | `/event-management/events/user/favorites` | Get all favorited events (paginated) | ✅ |
| 11 | `POST` | `/event-management/events/{eventId}/favorite` | Add an event to favorites | ✅ |
| 12 | `DELETE` | `/event-management/events/{eventId}/favorite` | Remove an event from favorites | ✅ |
| 13 | `GET` | `/event-management/events/{eventId}/favorite-count` | Get total favorite count for an event | ✅ |
| 14 | `GET` | `/event-management/events/{eventId}/is-favorited` | Check if current user has favorited an event | ✅ |

---

## ⚠️ Error Handling

All errors follow a standard response structure:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is missing or invalid"
}
```

| Status Code | Meaning |
|-------------|---------|
| `200` | ✅ Success |
| `400` | ❌ Bad Request — Missing or invalid parameters |
| `401` | 🔒 Unauthorized — Invalid or missing Bearer token |
| `404` | 🔍 Not Found — Club ID does not exist |
| `500` | 💥 Internal Server Error |

---

> 📌 **Note:** All timestamps are in `ISO 8601` format (`YYYY-MM-DDTHH:mm:ss.SSS`). All IDs are MongoDB ObjectIds.

---

*Generated for ClubWiz API · Base URL: `https://clubwiz.in`*