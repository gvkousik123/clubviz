# 🔓 PUBLIC APIs - No Authentication Required

## 📋 Complete List of Public APIs

Based on analysis of all service files, here are the APIs that **don't require authentication tokens**:

---

## 🔍 **Search Service** - All Public
*File: `lib/services/search.service.ts`*

| Endpoint | Method | Description | Guest Access |
|----------|--------|-------------|--------------|
| `/search/global` | GET | Global search across venues and events | ✅ YES |
| `/search/balanced` | GET | Balanced search (venues + events + food tags) | ✅ YES |
| `/search/suggestions` | GET | Get search suggestions/autocomplete | ✅ YES |
| `/search/events` | GET | Search for events with details | ✅ YES |
| `/search/categories` | GET | Get available search categories | ✅ YES |
| `/search/clubs` | GET | Search for clubs/venues | ✅ YES |
| `/search/nearby/events` | GET | Find nearby events by location | ✅ YES |
| `/search/nearby/clubs` | GET | Find nearby clubs by location | ✅ YES |
| `/search/smart` | GET | AI-powered smart search | ✅ YES |

---

## 🏢 **Club Service** - Public Club Operations
*File: `lib/services/club.service.ts`*

| Endpoint | Method | Description | Guest Access |
|----------|--------|-------------|--------------|
| `/clubs/search` | GET | Search public clubs by query | ✅ YES |
| `/clubs/public` | GET | Get all public clubs | ✅ YES |
| `/clubs/public/{id}` | GET | Get public club details by ID | ✅ YES |
| `/clubs/public/list` | GET | Paginated public clubs with filters | ✅ YES |
| `/clubs/public/locations` | GET | Get clubs by location | ✅ YES |
| `/clubs/public/category/{category}` | GET | Get clubs by specific category | ✅ YES |
| `/clubs/public/categories` | GET | Get all available club categories | ✅ YES |

---

## 📅 **Event Service** - Public Events (Inferred)
*File: `lib/services/event.service.ts`*

**Note**: Event service doesn't explicitly mark public endpoints, but these likely work for public events:

| Endpoint | Method | Description | Guest Access |
|----------|--------|-------------|--------------|
| `/events/list` | GET | Get events list (public events only) | ⚠️ NEEDS TESTING |
| `/events/{id}` | GET | Get event details (for public events) | ⚠️ NEEDS TESTING |
| `/events/{id}/details` | GET | Get detailed event info (for public events) | ⚠️ NEEDS TESTING |
| `/events/club/{clubId}` | GET | Get events by club (for public clubs) | ⚠️ NEEDS TESTING |

---

## 📚 **Lookup Service** - Reference Data
*File: `lib/services/lookup.service.ts`*

| Endpoint | Method | Description | Guest Access |
|----------|--------|-------------|--------------|
| `/lookup/club/{category}` | GET | Get lookup data by category (facilities, etc.) | ✅ YES |
| `/lookup/club/all` | GET | Get all club lookup reference data | ✅ YES |

---

## 🔐 **Authentication Service** - Public Auth Operations
*File: `lib/services/auth.service.ts`*

| Endpoint | Method | Description | Guest Access |
|----------|--------|-------------|--------------|
| `/auth/signin` | POST | User login (creates token) | ✅ YES |
| `/auth/signup` | POST | User registration | ✅ YES |
| `/auth/password-reset/*` | POST | Password reset operations | ✅ YES |
| `/auth/mobile/verify-firebase-token` | POST | Firebase phone auth | ✅ YES |

---

## ❌ **Private APIs** - Require Authentication

### **User-Specific Operations** 🔒
- `/clubs/owned` - User's owned clubs
- `/clubs/my-clubs` - User's joined clubs  
- `/events/attending` - User's attending events
- `/bookings/*` - All booking operations
- `/profile/*` - User profile operations
- `/admin/*` - Admin operations
- `/superadmin/*` - Super admin operations

### **Modification Operations** 🔒
- Any POST/PUT/DELETE operations (except auth)
- Club membership operations
- Event registration/RSVP
- Media upload operations

---

## 🎯 **Guest Login Implementation**

### **Current Guest Login Behavior**
Looking at your login page (`app/auth/login/page.tsx`), there's a "Guest Login" button that redirects to `/home`.

### **What Should Work for Guests:**

1. ✅ **Browse Public Clubs** - View all clubs and their details
2. ✅ **Search Everything** - Search clubs, events, get suggestions  
3. ✅ **View Public Events** - See event listings and details
4. ✅ **Location-Based Search** - Find nearby venues and events
5. ✅ **Browse Categories** - Filter by club categories
6. ✅ **View Reference Data** - Get facility types, cuisines, etc.

### **What Should NOT Work for Guests:**

1. ❌ **Join Clubs** - Requires authentication
2. ❌ **RSVP to Events** - Requires user account
3. ❌ **Make Bookings** - Requires authentication
4. ❌ **Upload Content** - Requires user account
5. ❌ **Admin Operations** - Requires specific roles

---

## 🛠 **Implementation Notes**

### **API Client Modification Needed**
The current API client (`lib/api-client.ts`) always adds Authorization header if token exists. For true guest access, we may need:

```typescript
// Option 1: Create separate public API client
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // NO Authorization interceptor
});

// Option 2: Add public flag to requests
apiClient.interceptors.request.use((config) => {
  // Skip auth for public endpoints
  if (config.headers?.['x-public-api']) {
    return config;
  }
  
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Testing Strategy**
1. Test each public API without any authentication token
2. Verify guest login flow works end-to-end
3. Ensure private APIs properly reject unauthenticated requests
4. Test that guest users can browse but not modify data

---

## 📝 **Next Steps**
1. ✅ Verify guest login redirects to home page
2. ✅ Test public club browsing without authentication
3. ✅ Test search functionality for guests
4. ✅ Ensure booking/RSVP is properly blocked for guests
5. ✅ Add clear "Login Required" messages for protected actions

This comprehensive list ensures guests can explore and discover content while protecting user-specific and administrative operations! 🎉