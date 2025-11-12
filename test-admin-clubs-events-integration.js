/**
 * COMPREHENSIVE ADMIN CLUBS & EVENTS INTEGRATION TEST
 * 
 * This test verifies that all admin CRUD operations for clubs and events are properly
 * integrated and working with the backend API.
 * 
 * Test Coverage:
 * ✓ Clubs - GET, POST, PUT, DELETE
 * ✓ Events - GET, POST, PUT, DELETE
 * ✓ Error Handling
 * ✓ Response Mapping
 * ✓ Authorization
 */

const axios = require('axios');

const BASE_URL = 'https://clubwiz.in/api';

// Superadmin token (update if needed)
const SUPERADMIN_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjk3NDM0MSwiZXhwIjoxNzYzMDYwNzQxfQ.4ngTOGJk5_JwXiatIZ_HerQtkCO92TJ4KwQFgolhsni8AU-A-fOZx1VjBaSwHxCvDc-igv3AiFSjhZ5FeXb1cA';

const makeRequest = async (endpoint, method = 'GET', data = null, label = '') => {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${SUPERADMIN_TOKEN}`
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.data = data;
        }

        const response = await axios(config);

        return {
            success: true,
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            endpoint,
            method,
            label
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 'ERROR',
            statusText: error.response?.statusText || error.message,
            error: error.response?.data?.message || error.message,
            endpoint,
            method,
            label
        };
    }
};

const runTests = async () => {
    console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║     ADMIN CLUBS & EVENTS INTEGRATION TEST - COMPREHENSIVE REPORT              ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

    const results = {
        clubs: [],
        events: [],
        summary: {
            total: 0,
            passed: 0,
            failed: 0
        }
    };

    // ============================================================================
    // CLUBS MANAGEMENT ENDPOINTS
    // ============================================================================
    console.log('🏢 TESTING CLUBS MANAGEMENT ENDPOINTS\n');
    console.log('─'.repeat(88) + '\n');

    const clubTests = [
        {
            endpoint: '/clubs',
            method: 'GET',
            desc: 'Get Authenticated Club Details'
        },
        {
            endpoint: '/clubs/public',
            method: 'GET',
            desc: 'Get All Public Clubs (Legacy)'
        },
        {
            endpoint: '/clubs/search?query=test',
            method: 'GET',
            desc: 'Search Clubs'
        },
        {
            endpoint: '/clubs/list',
            method: 'GET',
            desc: 'Get Club List (Paginated)'
        },
        {
            endpoint: '/clubs/owned',
            method: 'GET',
            desc: 'Get User\'s Owned Clubs'
        },
        {
            endpoint: '/clubs/my-clubs',
            method: 'GET',
            desc: 'Get User\'s Joined Clubs'
        },
        {
            endpoint: '/clubs/690b47de57bb21b58b1fbf27',
            method: 'GET',
            desc: 'Get Specific Club by ID'
        },
        // Create club
        {
            endpoint: '/clubs',
            method: 'POST',
            data: {
                name: 'Test Club',
                description: 'Test club for admin',
                logo: 'https://via.placeholder.com/150',
                category: 'Nightclub',
                maxMembers: 500,
                contactEmail: 'test@club.com',
                contactPhone: '9876543210',
                images: [],
                locationText: { city: 'Mumbai', state: 'MH', pincode: '400001' },
                locationMap: { lat: 19.0760, lng: 72.8777 },
                foodCuisines: [],
                facilities: [],
                music: [],
                barOptions: []
            },
            desc: 'Create New Club (POST)'
        },
        // Update club
        {
            endpoint: '/clubs/690b47de57bb21b58b1fbf27',
            method: 'PUT',
            data: {
                name: 'Updated Test Club',
                description: 'Updated description',
                logo: 'https://via.placeholder.com/150',
                category: 'Bar',
                maxMembers: 600,
                contactEmail: 'updated@club.com',
                contactPhone: '9876543210',
                images: [],
                locationText: { city: 'Mumbai', state: 'MH', pincode: '400001' },
                locationMap: { lat: 19.0760, lng: 72.8777 },
                foodCuisines: [],
                facilities: [],
                music: [],
                barOptions: []
            },
            desc: 'Update Club (PUT /clubs/{id})'
        },
        // Delete club
        {
            endpoint: '/clubs/690b47de57bb21b58b1fbf27',
            method: 'DELETE',
            desc: 'Delete Club'
        },
        // Admin operations
        {
            endpoint: '/clubs/690b47de57bb21b58b1fbf27/suspend',
            method: 'POST',
            desc: 'Suspend Club (Admin)'
        },
        {
            endpoint: '/clubs/690b47de57bb21b58b1fbf27/approve',
            method: 'POST',
            desc: 'Approve Club (Admin)'
        },
        // Admin list
        {
            endpoint: '/clubs/admin/all',
            method: 'GET',
            desc: 'Get All Clubs (Admin)'
        },
        {
            endpoint: '/clubs/admin/690b47de57bb21b58b1fbf27',
            method: 'GET',
            desc: 'Get Club Details (Admin)'
        },
        {
            endpoint: '/clubs/admin/690b47de57bb21b58b1fbf27',
            method: 'DELETE',
            desc: 'Force Delete Club (Super Admin)'
        }
    ];

    for (const test of clubTests) {
        const result = await makeRequest(test.endpoint, test.method, test.data, test.desc);
        results.clubs.push(result);
        results.summary.total++;

        if (result.success) {
            results.summary.passed++;
            console.log(`✅ ${test.method.padEnd(6)} ${test.endpoint.padEnd(50)} [${result.status}] ${test.desc}`);
        } else {
            results.summary.failed++;
            console.log(`❌ ${test.method.padEnd(6)} ${test.endpoint.padEnd(50)} [${result.status}] ${test.desc}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n' + '─'.repeat(88) + '\n');

    // ============================================================================
    // EVENTS MANAGEMENT ENDPOINTS
    // ============================================================================
    console.log('📅 TESTING EVENTS MANAGEMENT ENDPOINTS\n');
    console.log('─'.repeat(88) + '\n');

    const eventTests = [
        {
            endpoint: '/events/list',
            method: 'GET',
            desc: 'Get Events List (Paginated)'
        },
        {
            endpoint: '/events/list?page=0&size=10',
            method: 'GET',
            desc: 'Get Events with Pagination'
        },
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28',
            method: 'GET',
            desc: 'Get Event by ID (Legacy)'
        },
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28/details',
            method: 'GET',
            desc: 'Get Event Details'
        },
        {
            endpoint: '/events/my-registrations',
            method: 'GET',
            desc: 'Get User\'s Registered Events'
        },
        {
            endpoint: '/events/my-organized-events',
            method: 'GET',
            desc: 'Get User\'s Organized Events'
        },
        {
            endpoint: '/events/attending',
            method: 'GET',
            desc: 'Get User\'s Attending Events'
        },
        {
            endpoint: '/events/club/690b47de57bb21b58b1fbf27',
            method: 'GET',
            desc: 'Get Events by Club'
        },
        // Create event
        {
            endpoint: '/events',
            method: 'POST',
            data: {
                title: 'Test Event',
                description: 'Test event description',
                startDateTime: '2025-12-20T20:00:00',
                endDateTime: '2025-12-21T02:00:00',
                location: 'Mumbai',
                clubId: '690b47de57bb21b58b1fbf27',
                maxAttendees: 500,
                isPublic: true,
                requiresApproval: false
            },
            desc: 'Create New Event (POST /events)'
        },
        // Update event
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28',
            method: 'PUT',
            data: {
                title: 'Updated Test Event',
                description: 'Updated event description',
                startDateTime: '2025-12-21T20:00:00',
                endDateTime: '2025-12-22T02:00:00',
                location: 'Updated Mumbai',
                maxAttendees: 600
            },
            desc: 'Update Event (PUT /events/{id})'
        },
        // Delete event
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28',
            method: 'DELETE',
            desc: 'Delete Event'
        },
        // Event attendance
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28/attend',
            method: 'POST',
            desc: 'Attend/Register for Event'
        },
        {
            endpoint: '/events/690b47de57bb21b58b1fbf28/leave',
            method: 'POST',
            desc: 'Leave/Unregister from Event'
        },
        // Admin operations
        {
            endpoint: '/admin/events',
            method: 'GET',
            desc: 'Get All Events (Admin)'
        },
        {
            endpoint: '/admin/events/690b47de57bb21b58b1fbf28',
            method: 'GET',
            desc: 'Get Event Details (Admin)'
        },
        {
            endpoint: '/admin/events/690b47de57bb21b58b1fbf28',
            method: 'DELETE',
            desc: 'Force Delete Event (Super Admin)'
        }
    ];

    for (const test of eventTests) {
        const result = await makeRequest(test.endpoint, test.method, test.data, test.desc);
        results.events.push(result);
        results.summary.total++;

        if (result.success) {
            results.summary.passed++;
            console.log(`✅ ${test.method.padEnd(6)} ${test.endpoint.padEnd(50)} [${result.status}] ${test.desc}`);
        } else {
            results.summary.failed++;
            console.log(`❌ ${test.method.padEnd(6)} ${test.endpoint.padEnd(50)} [${result.status}] ${test.desc}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // ============================================================================
    // SUMMARY REPORT
    // ============================================================================
    console.log('\n' + '═'.repeat(88));
    console.log('📊 INTEGRATION TEST SUMMARY\n');

    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%\n`);

    const clubsPassed = results.clubs.filter(r => r.success).length;
    const clubsFailed = results.clubs.filter(r => !r.success).length;
    const eventsPassed = results.events.filter(r => r.success).length;
    const eventsFailed = results.events.filter(r => !r.success).length;

    console.log('Clubs Tests:');
    console.log(`  ✅ Passed: ${clubsPassed}/${results.clubs.length}`);
    console.log(`  ❌ Failed: ${clubsFailed}/${results.clubs.length}\n`);

    console.log('Events Tests:');
    console.log(`  ✅ Passed: ${eventsPassed}/${results.events.length}`);
    console.log(`  ❌ Failed: ${eventsFailed}/${results.events.length}\n`);

    // ============================================================================
    // DETAILED ANALYSIS
    // ============================================================================
    console.log('═'.repeat(88));
    console.log('🔍 DETAILED ANALYSIS\n');

    const clubsWorking = results.clubs.filter(r => r.success);
    const clubsFailing = results.clubs.filter(r => !r.success);
    const eventsWorking = results.events.filter(r => r.success);
    const eventsFailing = results.events.filter(r => !r.success);

    if (clubsWorking.length > 0) {
        console.log('✅ CLUBS ENDPOINTS WORKING:');
        clubsWorking.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint} [${r.status}]`);
        });
        console.log();
    }

    if (clubsFailing.length > 0) {
        console.log('❌ CLUBS ENDPOINTS FAILING:');
        clubsFailing.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint} [${r.status}] - ${r.error}`);
        });
        console.log();
    }

    if (eventsWorking.length > 0) {
        console.log('✅ EVENTS ENDPOINTS WORKING:');
        eventsWorking.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint} [${r.status}]`);
        });
        console.log();
    }

    if (eventsFailing.length > 0) {
        console.log('❌ EVENTS ENDPOINTS FAILING:');
        eventsFailing.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint} [${r.status}] - ${r.error}`);
        });
        console.log();
    }

    // ============================================================================
    // RECOMMENDATIONS
    // ============================================================================
    console.log('═'.repeat(88));
    console.log('💡 RECOMMENDATIONS\n');

    if (results.summary.passed === results.summary.total) {
        console.log('🎉 ALL ENDPOINTS WORKING - Integration is complete!\n');
    } else {
        const failureRate = ((results.summary.failed / results.summary.total) * 100).toFixed(1);
        console.log(`⚠️  ${results.summary.failed} endpoints failing (${failureRate}%)\n`);

        console.log('Issues by Status Code:');
        const statusCodes = {};
        [...results.clubs, ...results.events].forEach(r => {
            if (!r.success) {
                statusCodes[r.status] = (statusCodes[r.status] || 0) + 1;
            }
        });

        Object.entries(statusCodes).forEach(([status, count]) => {
            console.log(`   • ${status}: ${count} endpoint(s)`);
        });
    }

    console.log('\n' + '═'.repeat(88));
    console.log('✨ Test Complete\n');
};

runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
