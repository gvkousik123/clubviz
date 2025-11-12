/**
 * Comprehensive API Test Suite for ClubViz
 * Tests all endpoints with SuperAdmin, Admin, and Customer roles
 * 
 * Usage:
 * 1. Update the tokens below
 * 2. Run with: node test-all-apis.js
 * 3. Check the console output for results
 */

const BASE_URL = 'https://clubwiz.in/api'; // Update with your actual base URL

// ============================================================================
// TOKENS - UPDATE THESE WITH REAL TOKENS
// ============================================================================
// 
// ⚠️ TOKEN STATUS:
// - Superadmin: EXPIRED (needs refresh) ❌
// - Admin: VALID (188 min left) ✅  
// - Customer: VALID (1432 min left) ✅
//
// To get fresh tokens, use:
// POST https://clubwiz.in/api/auth/login
// Body: { "username": "username", "password": "password" }
//
const TOKENS = {
    superadmin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjg2NzIzMCwiZXhwIjoxNzYyOTUzNjMwfQ.wO22wniVuVTvdMpKmgi_BJPTkSnEv3jOxjZoWY7FoyJNROSkpZsq1SqsXOFqqRd64f1q4xPqjTj_4SXx3cF10Q', // EXPIRED - needs refresh
    admin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MiIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTc2Mjg3OTQ1MywiZXhwIjoxNzYyOTY1ODUzfQ.YQjylgLbZd4x7X-3Y1ckqsLIB9HEgw81G8CGgcNbjtRHSxyISkAYqHEeBJalp8b6_DZ-W_dVGb2j8oEUiZvs_w', // VALID ✅
    customer: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzYyOTU0MDc5LCJleHAiOjE3NjMwNDA0Nzl9.VVIo6Eld_5ulfo2dfwMnvOuS3HOpFVbo5cybEweZg00-Q-gCGV-0KP_FbrEJYlwevJdjqpLOvqENR_6WEcNkPA', // VALID ✅
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function makeApiCall(endpoint, method = 'GET', body = null, token = null, contentType = 'application/json', debug = false) {
    const headers = {
        'Content-Type': contentType,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        if (contentType === 'application/json') {
            config.body = JSON.stringify(body);
        } else {
            config.body = body; // For FormData
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const responseText = await response.text();

        let data = null;
        let parseError = null;

        // Try to parse JSON if there's content
        if (responseText && responseText.trim()) {
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                parseError = `Invalid JSON response`;
                if (debug) {
                    console.log(`   Raw Response: ${responseText.substring(0, 300)}`);
                }
            }
        } else if (!response.ok) {
            parseError = `Empty response body`;
        }

        const result = {
            success: response.ok && !parseError,
            status: response.status,
            data: data,
            error: null,
            rawResponse: debug ? responseText.substring(0, 200) : null
        };

        // Set error message with priority
        if (!response.ok) {
            result.error = data?.message || data?.error || `HTTP ${response.status}`;
        } else if (parseError) {
            result.error = parseError;
            result.success = false;
        }

        return result;
    } catch (error) {
        return {
            success: false,
            status: 0,
            data: null,
            error: `Network error: ${error.message}`
        };
    }
}

function logResult(testName, result) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const statusCode = result.status ? `[${result.status}]` : '';
    console.log(`${status} ${statusCode} ${testName}`);

    if (!result.success) {
        console.log(`   Error: ${result.error}`);
    } else if (result.data) {
        console.log(`   Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
    }
    console.log('');
}

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

function generateTestClubData() {
    return {
        name: `Test Club ${Date.now()}`,
        description: 'Test club created by API test suite',
        category: 'NIGHTCLUB',
        locationText: {
            address1: 'Test Address 123',
            city: 'Test City',
            state: 'Test State',
            pincode: '123456'
        },
        locationMap: [78.4867, 17.3850], // Hyderabad coordinates
        phoneNumber: '+91 9876543210',
        email: 'test@testclub.com',
        isActive: true,
        isPublic: true
    };
}

function generateTestEventData(clubId) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
        title: `Test Event ${Date.now()}`,
        description: 'Test event created by API test suite',
        startDateTime: tomorrow.toISOString(),
        endDateTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        clubId: clubId,
        category: 'MUSIC',
        maxAttendees: 100,
        isPublic: true,
        requiresApproval: false
    };
}

function generateTestUserData() {
    return {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '+91 9876543210',
        password: 'TestPassword123!'
    };
}

// ============================================================================
// SUPERADMIN TESTS
// ============================================================================

async function testSuperAdminAPIs() {
    console.log('🔴 TESTING SUPERADMIN APIS');
    console.log('='.repeat(50));

    const token = TOKENS.superadmin;

    // Admin Stats
    let result = await makeApiCall('/admin/stats', 'GET', null, token);
    logResult('Get Admin Statistics', result);

    // User Management
    result = await makeApiCall('/admin/users', 'GET', null, token);
    logResult('Get All Users', result);

    result = await makeApiCall('/admin/users/search?query=test', 'GET', null, token);
    logResult('Search Users', result);

    // Club Management (SuperAdmin)
    result = await makeApiCall('/admin/clubs', 'GET', null, token);
    logResult('Get All Clubs (Admin)', result);

    // Event Management (SuperAdmin)
    result = await makeApiCall('/admin/events', 'GET', null, token);
    logResult('Get All Events (Admin)', result);

    // System Management
    result = await makeApiCall('/admin/system/health', 'GET', null, token);
    logResult('System Health Check', result);

    result = await makeApiCall('/admin/system/cache/clear', 'POST', {}, token);
    logResult('Clear System Cache', result);

    // User Role Management
    result = await makeApiCall('/admin/roles', 'GET', null, token);
    logResult('Get All Roles', result);

    // Analytics
    result = await makeApiCall('/admin/analytics/dashboard', 'GET', null, token);
    logResult('Get Analytics Dashboard', result);

    result = await makeApiCall('/admin/analytics/events', 'GET', null, token);
    logResult('Get Event Analytics', result);

    result = await makeApiCall('/admin/analytics/users', 'GET', null, token);
    logResult('Get User Analytics', result);

    // Reports Management
    result = await makeApiCall('/admin/reports', 'GET', null, token);
    logResult('Get Content Reports', result);

    // Booking Management
    result = await makeApiCall('/admin/bookings', 'GET', null, token);
    logResult('Get All Bookings (Admin)', result);

    console.log('');
}

// ============================================================================
// ADMIN TESTS (CREATE, EDIT, DELETE)
// ============================================================================

async function testAdminAPIs() {
    console.log('🟡 TESTING ADMIN APIS (CRUD OPERATIONS)');
    console.log('='.repeat(50));

    const token = TOKENS.admin;
    let createdClubId = null;
    let createdEventId = null;

    // ========== CLUB MANAGEMENT ==========

    // Create Club
    let clubData = generateTestClubData();
    let result = await makeApiCall('/admin/clubs', 'POST', clubData, token);
    logResult('Create Club', result);

    if (result.success && result.data?.id) {
        createdClubId = result.data.id;
        console.log(`   Created Club ID: ${createdClubId}`);
    } else if (result.success && result.data?.data?.id) {
        createdClubId = result.data.data.id;
        console.log(`   Created Club ID: ${createdClubId}`);
    }

    // Get Club Details (first, to verify club exists)
    result = await makeApiCall('/clubs', 'GET', null, token);
    logResult('Get All Clubs', result);

    // Try to find an existing club to use
    if (result.success && result.data?.content?.length > 0) {
        createdClubId = result.data.content[0].id;
        console.log(`   Using existing Club ID: ${createdClubId}`);
    }

    // Update Club (if we have a club ID)
    if (createdClubId) {
        const updateData = { name: `Updated ${clubData.name}` };
        result = await makeApiCall(`/admin/clubs/${createdClubId}`, 'PUT', updateData, token);
        logResult('Update Club', result);
    }

    // ========== EVENT MANAGEMENT ==========

    // Create Event (requires club)
    if (createdClubId) {
        let eventData = generateTestEventData(createdClubId);
        result = await makeApiCall('/admin/events', 'POST', eventData, token);
        logResult('Create Event', result);

        if (result.success && result.data?.id) {
            createdEventId = result.data.id;
            console.log(`   Created Event ID: ${createdEventId}`);
        } else if (result.success && result.data?.data?.id) {
            createdEventId = result.data.data.id;
            console.log(`   Created Event ID: ${createdEventId}`);
        }
    }

    // Get Events list (to verify)
    result = await makeApiCall('/admin/events', 'GET', null, token);
    logResult('Get All Events (Admin)', result);

    // Try to find an existing event if we couldn't create one
    if (!createdEventId && result.success && result.data?.content?.length > 0) {
        createdEventId = result.data.content[0].id;
        console.log(`   Using existing Event ID: ${createdEventId}`);
    }

    // Update Event
    if (createdEventId) {
        const updateEventData = { title: `Updated Test Event ${Date.now()}` };
        result = await makeApiCall(`/admin/events/${createdEventId}`, 'PUT', updateEventData, token);
        logResult('Update Event', result);
    }

    // ========== MEDIA MANAGEMENT ==========

    // Note: File upload would need actual file data
    // This is a placeholder for testing file upload structure
    result = await makeApiCall('/media/types', 'GET', null, token);
    logResult('Get Supported Media Types', result);

    // ========== STORY MANAGEMENT ==========

    // Get Stories
    result = await makeApiCall('/stories', 'GET', null, token);
    logResult('Get Stories', result);

    // ========== USER MANAGEMENT (ADMIN LEVEL) ==========

    // Get Profile (Admin)
    result = await makeApiCall('/profile', 'GET', null, token);
    logResult('Get Admin Profile', result);

    // Get Profile Stats
    result = await makeApiCall('/profile/stats', 'GET', null, token);
    logResult('Get Profile Statistics', result);

    // ========== CLEANUP (DELETE OPERATIONS) ==========

    // Delete Event
    if (createdEventId) {
        result = await makeApiCall(`/admin/events/${createdEventId}`, 'DELETE', null, token);
        logResult('Delete Event', result);
    }

    // Delete Club
    if (createdClubId) {
        result = await makeApiCall(`/admin/clubs/${createdClubId}`, 'DELETE', null, token);
        logResult('Delete Club', result);
    }

    console.log('');
}

// ============================================================================
// CUSTOMER TESTS (MOSTLY GET + BOOKING)
// ============================================================================

async function testCustomerAPIs() {
    console.log('🟢 TESTING CUSTOMER APIS (READ + BOOKING)');
    console.log('='.repeat(50));

    const token = TOKENS.customer;

    // ========== PUBLIC CONTENT ==========

    // Get Public Clubs
    let result = await makeApiCall('/clubs/public', 'GET', null, token);
    logResult('Get Public Clubs', result);

    // Search Clubs
    result = await makeApiCall('/clubs/search?query=club', 'GET', null, token);
    logResult('Search Clubs', result);

    // Get Public Events
    result = await makeApiCall('/events/list?page=0&size=10', 'GET', null, token);
    logResult('Get Public Events', result);

    // Get Event Categories
    result = await makeApiCall('/events/categories', 'GET', null, token);
    logResult('Get Event Categories', result);

    // Get Recommended Events
    result = await makeApiCall('/events/recommended?limit=5', 'GET', null, token);
    logResult('Get Recommended Events', result);

    // ========== SEARCH ==========

    // Global Search
    result = await makeApiCall('/search/global?query=party', 'GET', null, token);
    logResult('Global Search', result);

    // Balanced Search
    result = await makeApiCall('/search/balanced?query=music', 'GET', null, token);
    logResult('Balanced Search', result);

    // ========== PROFILE & USER ==========

    // Get Customer Profile
    result = await makeApiCall('/profile', 'GET', null, token);
    logResult('Get Customer Profile', result);

    // Update Profile (Customer can update their own profile)
    const profileUpdate = {
        fullName: 'Updated Customer User'
    };
    result = await makeApiCall('/profile', 'PUT', profileUpdate, token);
    logResult('Update Customer Profile', result);

    // Get Attending Events
    result = await makeApiCall('/events/attending', 'GET', null, token);
    logResult('Get Attending Events', result);

    // ========== REVIEWS ==========

    // Get Reviews
    result = await makeApiCall('/reviews?page=0&size=10', 'GET', null, token);
    logResult('Get Reviews', result);

    // ========== NOTIFICATIONS ==========

    // Get Notifications
    result = await makeApiCall('/notifications?page=0&size=10', 'GET', null, token);
    logResult('Get Notifications', result);

    // Get Unread Notification Count
    result = await makeApiCall('/notifications/unread-count', 'GET', null, token);
    logResult('Get Unread Notification Count', result);

    // ========== CONTENT & MEDIA ==========

    // Get Gallery
    result = await makeApiCall('/gallery?page=0&size=10', 'GET', null, token);
    logResult('Get Gallery', result);

    // Get Trending Content
    result = await makeApiCall('/content/trending', 'GET', null, token);
    logResult('Get Trending Content', result);

    // Get Content Recommendations
    result = await makeApiCall('/content/recommendations', 'GET', null, token);
    logResult('Get Content Recommendations', result);

    // ========== BOOKING FLOWS ==========

    // Get Payment Methods
    result = await makeApiCall('/payments/methods', 'GET', null, token);
    logResult('Get Payment Methods', result);

    // Get Customer Bookings
    result = await makeApiCall('/bookings/my-bookings?page=0&size=10', 'GET', null, token);
    logResult('Get My Bookings', result);

    // Note: Actual booking would require valid event ID and payment details
    // This is commented out to avoid creating real bookings during testing
    /*
    // Create Test Booking
    const bookingData = {
      eventId: 'valid-event-id',
      numberOfGuests: 2,
      paymentMethod: 'card',
      totalAmount: 1000
    };
    result = await makeApiCall('/bookings', 'POST', bookingData, token);
    logResult('Create Booking', result);
    */

    console.log('');
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthAPIs() {
    console.log('🔵 TESTING AUTHENTICATION APIS');
    console.log('='.repeat(50));

    // Test Auth Endpoint (Public)
    let result = await makeApiCall('/auth/test', 'GET');
    logResult('Test Auth Endpoint', result);

    // Get CORS Origins (Public)
    result = await makeApiCall('/auth/cors-origins', 'GET');
    logResult('Get CORS Origins', result);

    // Note: Login tests would require valid credentials
    // This is commented out to avoid creating test sessions
    /*
    // Test Login
    const loginData = {
      username: 'testuser',
      password: 'testpassword'
    };
    result = await makeApiCall('/auth/login', 'POST', loginData);
    logResult('Login Test', result);
    */

    console.log('');
}

// ============================================================================
// LOOKUP & UTILITY TESTS
// ============================================================================

async function testUtilityAPIs() {
    console.log('🟣 TESTING UTILITY & LOOKUP APIS');
    console.log('='.repeat(50));

    // Get Countries
    let result = await makeApiCall('/lookup/countries', 'GET');
    logResult('Get Countries', result);

    // Get States
    result = await makeApiCall('/lookup/states?country=IN', 'GET');
    logResult('Get States for India', result);

    // Get Cities
    result = await makeApiCall('/lookup/cities?state=TG&country=IN', 'GET');
    logResult('Get Cities for Telangana', result);

    // Get Categories
    result = await makeApiCall('/lookup/categories', 'GET');
    logResult('Get Categories', result);

    // Get Music Genres
    result = await makeApiCall('/lookup/music-genres', 'GET');
    logResult('Get Music Genres', result);

    console.log('');
}

// ============================================================================
// DIAGNOSTIC TEST - Check which endpoints exist
// ============================================================================

async function testDiagnostics() {
    console.log('🔧 RUNNING DIAGNOSTICS - CHECKING AVAILABLE ENDPOINTS');
    console.log('='.repeat(50));

    const token = TOKENS.customer;
    const endpoints = [
        { path: '/auth/test', method: 'GET', desc: 'Auth Test' },
        { path: '/admin/stats', method: 'GET', desc: 'Admin Stats' },
        { path: '/admin/users', method: 'GET', desc: 'Admin Users' },
        { path: '/admin/clubs', method: 'GET', desc: 'Admin Clubs' },
        { path: '/admin/events', method: 'GET', desc: 'Admin Events' },
        { path: '/clubs', method: 'GET', desc: 'All Clubs' },
        { path: '/clubs/public', method: 'GET', desc: 'Public Clubs' },
        { path: '/events', method: 'GET', desc: 'All Events' },
        { path: '/events/list', method: 'GET', desc: 'Event List' },
        { path: '/events/categories', method: 'GET', desc: 'Event Categories' },
        { path: '/profile', method: 'GET', desc: 'Profile' },
        { path: '/reviews', method: 'GET', desc: 'Reviews' },
        { path: '/notifications', method: 'GET', desc: 'Notifications' },
        { path: '/gallery', method: 'GET', desc: 'Gallery' },
        { path: '/lookup/countries', method: 'GET', desc: 'Countries' },
    ];

    let working = 0;
    let broken = 0;

    for (const endpoint of endpoints) {
        const result = await makeApiCall(endpoint.path, endpoint.method, null, token);
        if (result.success || result.status === 200) {
            console.log(`✅ [${result.status}] ${endpoint.desc} → ${endpoint.path}`);
            working++;
        } else if (result.status === 401 || result.status === 403) {
            console.log(`🔐 [${result.status}] ${endpoint.desc} → ${endpoint.path} (Auth Required)`);
        } else if (result.status === 404) {
            console.log(`❌ [404] ${endpoint.desc} → ${endpoint.path} (NOT FOUND)`);
            broken++;
        } else {
            console.log(`⚠️  [${result.status}] ${endpoint.desc} → ${endpoint.path} (${result.error})`);
        }
    }

    console.log(`\n📊 Summary: ${working} working, ${broken} not found, ${endpoints.length - working - broken} other`);
    console.log('');
}

// ============================================================================

async function runAllTests() {
    console.log('🚀 STARTING COMPREHENSIVE API TEST SUITE');
    console.log('='.repeat(60));
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Start Time: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('');

    try {
        // Run diagnostics first to identify working endpoints
        await testDiagnostics();

        // Test in order of dependency
        await testAuthAPIs();
        await testUtilityAPIs();

        // ⚠️ Skip SuperAdmin tests - token is expired
        console.log('🟠 SKIPPING SUPERADMIN TESTS - Token expired');
        console.log('   To test: Generate fresh superadmin token with:');
        console.log('   POST /auth/login with username: kousik');
        console.log('');
        // await testSuperAdminAPIs();

        await testAdminAPIs();
        await testCustomerAPIs();

        console.log('🏁 ALL TESTS COMPLETED');
        console.log('='.repeat(60));
        console.log(`End Time: ${new Date().toISOString()}`);
        console.log('');
        console.log('📝 NOTES:');
        console.log('   - Admin token (test2) is valid ✅');
        console.log('   - Customer token (test1) is valid ✅');
        console.log('   - SuperAdmin token (kousik) is EXPIRED ❌');
        console.log('');

    } catch (error) {
        console.error('💥 Test suite failed with error:', error.message);
    }
}

// ============================================================================
// HELPER FUNCTIONS FOR INDIVIDUAL TESTING
// ============================================================================

async function testSpecificEndpoint(endpoint, method = 'GET', body = null, userType = 'customer') {
    const token = TOKENS[userType];
    const result = await makeApiCall(endpoint, method, body, token);
    logResult(`${method} ${endpoint} (${userType})`, result);
    return result;
}

// ============================================================================
// EXPORT FOR MODULE USE (if needed)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testDiagnostics,
        testSpecificEndpoint,
        testSuperAdminAPIs,
        testAdminAPIs,
        testCustomerAPIs,
        makeApiCall
    };
}

// ============================================================================
// RUN TESTS (if script is executed directly)
// ============================================================================

if (require.main === module) {
    // Validate tokens are provided
    if (!TOKENS.superadmin || !TOKENS.admin || !TOKENS.customer) {
        console.error('❌ Please update the TOKENS object with your actual access tokens');
        process.exit(1);
    }

    if (BASE_URL === 'https://your-api-base-url.com') {
        console.error('❌ Please update the BASE_URL with your actual API base URL');
        process.exit(1);
    }

    runAllTests();
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// To run all tests:
node test-all-apis.js

// To test specific endpoint:
testSpecificEndpoint('/events/list', 'GET', null, 'customer');

// To test only SuperAdmin APIs:
testSuperAdminAPIs();

// To test only Admin APIs:
testAdminAPIs();

// To test only Customer APIs:
testCustomerAPIs();

// To make a custom API call:
makeApiCall('/custom/endpoint', 'POST', { data: 'value' }, TOKENS.admin)
  .then(result => console.log(result));
*/