/**
 * Quick Admin API Test Suite
 * Tests /admin/* endpoints with existing tokens
 */

const BASE_URL = 'https://clubwiz.in/api';

// Current valid tokens from the main test file
const TOKENS = {
    // superadmin: EXPIRED - will test for 401/403
    superadmin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjg2NzIzMCwiZXhwIjoxNzYyOTUzNjMwfQ.wO22wniVuVTvdMpKmgi_BJPTkSnEv3jOxjZoWY7FoyJNROSkpZsq1SqsXOFqqRd64f1q4xPqjTj_4SXx3cF10Q',
    // admin: VALID - should work for most admin endpoints
    admin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MiIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTc2Mjg3OTQ1MywiZXhwIjoxNzYyOTY1ODUzfQ.YQjylgLbZd4x7X-3Y1ckqsLIB9HEgw81G8CGgcNbjtRHSxyISkAYqHEeBJalp8b6_DZ-W_dVGb2j8oEUiZvs_w',
    // customer: VALID - should fail for admin endpoints
    customer: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzYyOTU0MDc5LCJleHAiOjE3NjMwNDA0Nzl9.VVIo6Eld_5ulfo2dfwMnvOuS3HOpFVbo5cybEweZg00-Q-gCGV-0KP_FbrEJYlwevJdjqpLOvqENR_6WEcNkPA'
};

// Admin endpoints to test
const ADMIN_ENDPOINTS = [
    { path: '/admin/stats', method: 'GET', desc: 'Admin Statistics' },
    { path: '/admin/users', method: 'GET', desc: 'Get All Users' },
    { path: '/admin/users?page=0&size=5', method: 'GET', desc: 'Get Users (Paginated)' },
    { path: '/admin/users/search?query=test', method: 'GET', desc: 'Search Users' },
    { path: '/admin/users/test1', method: 'GET', desc: 'Get Specific User' },
    { path: '/admin/users/test1/roles', method: 'GET', desc: 'Get User Roles' },
    { path: '/admin/clubs', method: 'GET', desc: 'Get Admin Clubs' },
    { path: '/admin/events', method: 'GET', desc: 'Get Admin Events' }
];

async function makeApiCall(endpoint, method = 'GET', token = null) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers
        });

        const data = await response.json();

        return {
            success: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            status: 0,
            error: error.message
        };
    }
}

function formatResponse(response) {
    if (!response.success) {
        return `❌ [${response.status}] ${response.error || 'Error'}`;
    }

    // Format successful responses
    if (Array.isArray(response.data)) {
        return `✅ [${response.status}] Array with ${response.data.length} items`;
    } else if (typeof response.data === 'object' && response.data !== null) {
        const keys = Object.keys(response.data);
        if (keys.includes('totalUsers')) {
            // Stats response
            const stats = response.data;
            return `✅ [${response.status}] Stats - Total: ${stats.totalUsers}, Active: ${stats.activeUsers}, Admins: ${stats.admins}, Inactive: ${stats.inactiveUsers}`;
        } else if (keys.includes('username')) {
            // User response
            const user = response.data;
            return `✅ [${response.status}] User: ${user.username}, Active: ${user.isActive}, Roles: [${user.roles?.join(', ') || 'none'}]`;
        } else {
            return `✅ [${response.status}] Object with keys: [${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}]`;
        }
    } else {
        return `✅ [${response.status}] ${typeof response.data}: ${JSON.stringify(response.data).substring(0, 100)}`;
    }
}

async function testAdminEndpoints() {
    console.log('🎯 ADMIN API QUICK TEST SUITE');
    console.log('==============================');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Test Time: ${new Date().toISOString()}\n`);

    for (const [tokenType, token] of Object.entries(TOKENS)) {
        console.log(`🔑 TESTING WITH ${tokenType.toUpperCase()} TOKEN`);
        console.log('='.repeat(30 + tokenType.length));

        if (tokenType === 'superadmin') {
            console.log('⚠️  Note: This token is expired, expecting 401/403 responses');
        }

        for (const endpoint of ADMIN_ENDPOINTS) {
            const response = await makeApiCall(endpoint.path, endpoint.method, token);
            const result = formatResponse(response);
            console.log(`${endpoint.desc.padEnd(25)} → ${result}`);
        }
        console.log('');
    }

    // Test without token
    console.log('🚫 TESTING WITHOUT TOKEN (Should Fail)');
    console.log('=====================================');
    for (const endpoint of ADMIN_ENDPOINTS.slice(0, 3)) { // Test first 3 only
        const response = await makeApiCall(endpoint.path, endpoint.method, null);
        const result = formatResponse(response);
        console.log(`${endpoint.desc.padEnd(25)} → ${result}`);
    }
    console.log('');

    // Summary and recommendations
    console.log('💡 FINDINGS & RECOMMENDATIONS');
    console.log('=============================');
    console.log('1. If ADMIN token shows ✅ results: Your superadmin UI should work with fresh admin token');
    console.log('2. If ADMIN token shows ❌ 403: Check if admin role has sufficient permissions for stats endpoint');
    console.log('3. If all tokens fail: Backend may require SUPERADMIN role specifically for these endpoints');
    console.log('4. Check your frontend auth service to ensure it properly stores and sends tokens');
    console.log('');

    console.log('📋 NEXT STEPS');
    console.log('=============');
    console.log('1. If admin endpoints work → Check frontend token management');
    console.log('2. If admin endpoints fail → May need to modify backend permissions or use superadmin');
    console.log('3. Generate fresh superadmin token with: POST /auth/login {"username":"kousik","password":"..."}');
    console.log('4. Update your app to handle token refresh/renewal automatically');
}

// Run the test
testAdminEndpoints().catch(console.error);