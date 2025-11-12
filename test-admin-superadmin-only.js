/**
 * Admin API Test Suite - Superadmin Routes Only
 * Tests /admin/* endpoints with proper Bearer token format
 */

const axios = require('axios');

const BASE_URL = 'https://clubwiz.in/api';

// Your updated superadmin token
const SUPERADMIN_TOKEN = process.env.SUPERADMIN_TOKEN ||
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjg2NzIzMCwiZXhwIjoxNzYyOTUzNjMwfQ.wO22wniVuVTvdMpKmgi_BJPTkSnEv3jOxjZoWY7FoyJNROSkpZsq1SqsXOFqqRd64f1q4xPqjTj_4SXx3cF10Q';

// Admin endpoints to test
const ADMIN_ENDPOINTS = [
    { path: '/admin/stats', method: 'GET', desc: 'Admin Statistics' },
    { path: '/admin/users', method: 'GET', desc: 'Get All Users' },
    { path: '/admin/users?page=0&size=5', method: 'GET', desc: 'Get Users (Paginated)' },
    { path: '/admin/users/search?query=test', method: 'GET', desc: 'Search Users' },
    { path: '/admin/users/test1', method: 'GET', desc: 'Get Specific User' },
    { path: '/admin/users/test1/roles', method: 'GET', desc: 'Get User Roles' },
    { path: '/admin/clubs', method: 'GET', desc: 'Get Admin Clubs' },
    { path: '/admin/events', method: 'GET', desc: 'Get Admin Events' },
    { path: '/admin/users/test1/activate', method: 'POST', desc: 'Activate User' },
    { path: '/admin/users/test1/deactivate', method: 'POST', desc: 'Deactivate User' },
];

async function makeApiCall(endpoint, method = 'GET', token) {
    try {
        console.log(`   📤 Sending: ${method} ${endpoint}`);
        console.log(`   🔐 Bearer Token: ${token.substring(0, 30)}...${token.substring(token.length - 10)}`);

        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Proper Bearer format
            },
            timeout: 10000
        };

        const response = await axios(config);

        return {
            success: true,
            status: response.status,
            data: response.data,
            statusText: response.statusText
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            statusText: error.response?.statusText || 'Network Error',
            error: error.response?.data || error.message,
            message: error.message
        };
    }
}

function formatResponse(response) {
    if (!response.success) {
        const errorMsg = response.error?.message || response.error || response.message;
        return `❌ [${response.status} ${response.statusText}] ${errorMsg}`;
    }

    // Format successful responses
    if (Array.isArray(response.data)) {
        return `✅ [${response.status}] Array with ${response.data.length} items`;
    } else if (typeof response.data === 'object' && response.data !== null) {
        const keys = Object.keys(response.data);

        // Check for stats response
        if (keys.includes('totalUsers')) {
            const stats = response.data;
            return `✅ [${response.status}] Stats - Total: ${stats.totalUsers}, Active: ${stats.activeUsers}, Admins: ${stats.admins}, Inactive: ${stats.inactiveUsers}`;
        }

        // Check for user response
        if (keys.includes('username')) {
            const user = response.data;
            return `✅ [${response.status}] User: ${user.username}, Active: ${user.isActive}, Roles: [${user.roles?.join(', ') || 'none'}]`;
        }

        // Check for message response
        if (keys.includes('message')) {
            return `✅ [${response.status}] ${response.data.message}`;
        }

        // Generic object response
        return `✅ [${response.status}] Object with keys: [${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}]`;
    } else {
        return `✅ [${response.status}] ${typeof response.data}: ${JSON.stringify(response.data).substring(0, 100)}`;
    }
}

async function testAdminEndpoints() {
    console.log('\n');
    console.log('🎯 ADMIN API TEST SUITE - SUPERADMIN ROUTES ONLY');
    console.log('='.repeat(50));
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Test Time: ${new Date().toISOString()}`);
    console.log(`Token Format: Bearer ${SUPERADMIN_TOKEN.substring(0, 20)}...`);
    console.log('='.repeat(50));
    console.log('');

    console.log('🔑 TESTING SUPERADMIN ENDPOINTS');
    console.log('-'.repeat(50));
    console.log('');

    let passCount = 0;
    let failCount = 0;
    const results = [];

    for (const endpoint of ADMIN_ENDPOINTS) {
        console.log(`📌 ${endpoint.desc}`);
        console.log(`   Endpoint: ${endpoint.method} ${endpoint.path}`);

        const response = await makeApiCall(endpoint.path, endpoint.method, SUPERADMIN_TOKEN);
        const result = formatResponse(response);

        console.log(`   Result: ${result}`);

        if (response.success) {
            passCount++;
            results.push({ endpoint: endpoint.path, success: true, data: response.data });
        } else {
            failCount++;
            results.push({ endpoint: endpoint.path, success: false, error: response.error });
        }

        console.log('');
    }

    // Summary
    console.log('='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${passCount + failCount}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
    console.log('');

    // Detailed results
    console.log('📋 DETAILED RESULTS');
    console.log('='.repeat(50));

    console.log('\n✅ SUCCESSFUL CALLS:');
    results.filter(r => r.success).forEach(r => {
        console.log(`  • ${r.endpoint}: Got ${typeof r.data === 'object' ? JSON.stringify(r.data).substring(0, 50) : r.data}...`);
    });

    console.log('\n❌ FAILED CALLS:');
    results.filter(r => !r.success).forEach(r => {
        console.log(`  • ${r.endpoint}: ${r.error?.message || r.error || 'Unknown error'}`);
    });

    console.log('');
    console.log('='.repeat(50));
    console.log('💡 DIAGNOSIS & RECOMMENDATIONS');
    console.log('='.repeat(50));

    if (passCount === 0) {
        console.log('🔴 CRITICAL: No endpoints are working!');
        console.log('   Possible issues:');
        console.log('   1. Token is invalid or expired');
        console.log('   2. Token format is incorrect (should be "Bearer {token}")');
        console.log('   3. Backend /admin routes are not implemented');
        console.log('   4. CORS issues or backend is down');
    } else if (passCount < ADMIN_ENDPOINTS.length / 2) {
        console.log('🟡 WARNING: Less than 50% of endpoints working');
        console.log('   Possible issues:');
        console.log('   1. Some routes may require different permissions');
        console.log('   2. Some routes may not be implemented yet');
        console.log('   3. Check backend logs for errors');
    } else {
        console.log('🟢 GOOD: Most endpoints are working!');
        console.log('   Next steps:');
        console.log('   1. Fix any failed endpoints');
        console.log('   2. Update your frontend to use this token format');
        console.log('   3. Ensure frontend stores and uses tokens correctly');
    }

    console.log('');
    console.log('🔧 FRONTEND INTEGRATION NOTES');
    console.log('='.repeat(50));
    console.log('Token should be sent in headers as:');
    console.log('  Authorization: Bearer {token}');
    console.log('');
    console.log('Example with axios:');
    console.log(`  axios.get('/admin/stats', {`);
    console.log(`    headers: { Authorization: 'Bearer ' + token }`);
    console.log(`  })`);
    console.log('');
    console.log('Your frontend auth client should automatically add this header');
    console.log('in the request interceptor (like in api-client.ts)');
    console.log('');
}

// Run the test
testAdminEndpoints().catch(error => {
    console.error('❌ Fatal Error:', error.message);
    console.error(error);
});