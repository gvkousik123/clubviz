# ClubViz API Integration Documentation

## Overview
This document outlines the complete API integration for the ClubViz application, based on the provided API screenshots and requirements.

## API Base URL
```
https://98.90.141.103/api
```

## Integrated Endpoints

### 1. Authentication APIs

#### Mobile Authentication
- **POST** `/auth/mobile/verify-firebase-token` - Verify Firebase token
- **POST** `/auth/google` - Google Sign-In with ID token

#### Password Reset
- **POST** `/auth/password-reset/initiate/mobile` - Send OTP to mobile
- **POST** `/auth/password-reset/initiate/email` - Send OTP to email  
- **POST** `/auth/password-reset/verify/token` - Verify OTP token
- **POST** `/auth/password-reset/reset/mobile` - Reset password with mobile OTP

#### Basic Authentication
- **POST** `/auth/signin` - Login with username/email and password
- **POST** `/auth/signup` - Register new user
- **POST** `/auth/refresh` - Refresh access token
- **POST** `/auth/logout` - Logout user

### 2. Search APIs

#### Smart Search
- **GET** `/search/smart?query={query}` - AI-powered smart search
  - Returns mixed results (clubs and events) with relevance scores
  - Includes suggested queries for better user experience

#### Other Search Endpoints  
- **GET** `/search/global?query={query}` - Global search across all content
- **GET** `/search/balanced?query={query}` - Balanced search with venues, events, and food tags
- **GET** `/search/suggestions?query={query}` - Search autocomplete suggestions
- **GET** `/search/categories` - Get available search categories

### 3. Role Management APIs

#### User Role Operations
- **POST** `/admin/users/{username}/roles/{role}` - Add role to user
- **POST** `/auth/roles/{username}/add/{role}` - Alternative add role endpoint
- **POST** `/auth/roles/{username}/remove/{role}` - Remove role from user
- **DELETE** `/admin/users/{username}/roles/{role}` - Delete role from user

#### User Management
- **GET** `/admin/users` - Get all users (paginated)
- **GET** `/admin/users/{username}` - Get specific user
- **POST** `/admin/users/{username}/activate` - Activate user
- **POST** `/admin/users/{username}/deactivate` - Deactivate user
- **DELETE** `/admin/users/{username}` - Delete user

### 4. Session Management APIs

#### Session Operations
- **GET** `/auth/sessions` - Get user's active sessions
- **DELETE** `/auth/sessions/{id}` - Delete specific session
- **DELETE** `/auth/sessions` - Revoke all sessions (logout from all devices)

#### CORS Management
- **GET** `/auth/cors-origins` - Get CORS origins and settings

### 5. Admin & Statistics APIs

#### Admin Dashboard
- **GET** `/admin/stats` - Get admin dashboard statistics
  - Total users, active users, admins, super admins
  - Total clubs, events, bookings

## Service Classes

### 1. AuthService (`lib/services/auth.service.ts`)
Handles all authentication operations including:
- Email/password login and registration
- Google OAuth integration
- Token refresh and logout
- Session management

### 2. SearchService (`lib/services/search.service.ts`) 
Provides comprehensive search functionality:
- Smart AI-powered search
- Global and balanced search
- Nearby location-based search
- Search suggestions and categories

### 3. SuperAdminService (`lib/services/superadmin.service.ts`)
Manages administrative operations:
- User management (CRUD operations)
- Role assignment and removal
- User activation/deactivation
- Admin statistics and reporting

### 4. MobileAuthService (`lib/services/mobile-auth.service.ts`)
Handles mobile-specific authentication:
- Firebase token verification
- OTP generation and verification
- Password reset via mobile/email

### 5. SessionService (`lib/services/session.service.ts`)
Manages user sessions and CORS:
- Session listing and management
- Session revocation
- CORS origins configuration
- Authentication state utilities

## API Response Structure

All APIs follow a consistent response structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  pagination?: PaginationMeta;
}
```

## Authentication

### Bearer Token
All authenticated requests include:
```
Authorization: Bearer {accessToken}
```

### Token Storage
- Access tokens stored in `localStorage` with key `accessToken`
- Complete user data stored with key `user`

## Error Handling

### HTTP Status Codes
- **200** - Success
- **400** - Bad Request (Invalid role or user not found)
- **401** - Unauthorized (Invalid/expired token)
- **403** - Forbidden (Insufficient permissions - SUPERADMIN required)
- **404** - Not Found
- **500** - Server Error

### Error Response Format
```typescript
{
  success: false,
  message: "Error description",
  errors: ["Detailed error messages"]
}
```

## Security & Permissions

### Role Hierarchy
1. **USER** - Basic user permissions
2. **ADMIN** - Club/event management permissions  
3. **SUPERADMIN** - Full system administration

### Protected Endpoints
- Role management endpoints require **SUPERADMIN** role
- Admin statistics require **ADMIN** or **SUPERADMIN** role
- User management requires appropriate permissions

## Smart Search Response Example

```json
{
  "query": "club",
  "totalResults": 17,
  "results": [
    {
      "id": "68f8ab1cf880f077cedf95c2",
      "type": "event",
      "title": "Electronic Dance Party",
      "description": "Get ready to dance the night away...",
      "imageUrl": "https://example.com/images/edm-night.jpg",
      "category": "Nightclub",
      "location": "Pablo Club, Dharampeth, Nagpur",
      "relevanceScore": 149,
      "clubId": "68f89c98f880f077cedf95bd",
      "clubName": "Pablo - The Art Cafe Lounge"
    }
  ],
  "suggestedQueries": [
    "Cyclone – Modern Dine In & Club",
    "Suraburdi Club",
    "Open Mic Comedy Night"
  ]
}
```

## Usage Examples

### Smart Search
```typescript
import { SearchService } from '@/lib/services';

const results = await SearchService.smartSearch('nightclub');
console.log(results.results); // Array of clubs and events
console.log(results.suggestedQueries); // AI-suggested related queries
```

### Role Management  
```typescript
import { SuperAdminService } from '@/lib/services';

// Add admin role to user
await SuperAdminService.addRole('john_doe', 'ADMIN');

// Remove role from user  
await SuperAdminService.removeRole('jane_smith', 'USER');
```

### Session Management
```typescript
import { SessionService } from '@/lib/services';

// Get all user sessions
const sessions = await SessionService.getUserSessions();

// Logout from all devices
await SessionService.revokeAllSessions();
```

## Removed Features

As requested, all `/test-data` and test API endpoints have been removed from the application.

## Testing

A comprehensive API testing interface is available at `/api-demo` which allows testing all integrated endpoints with a user-friendly interface.

## Notes

- All services include proper TypeScript types and interfaces
- Error handling follows consistent patterns across all services
- Token management is handled automatically by axios interceptors
- Local storage is used for client-side authentication state
- All APIs support proper CORS configuration