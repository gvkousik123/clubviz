/**
 * Debug Superadmin Integration
 * This script tests the actual API responses to understand why data isn't loading in the frontend
 */

const axios = require('axios');

const BASE_URL = 'https://clubwiz.in/api';

// Test token (from API-TEST-FINDINGS)
const SUPERADMIN_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjk3NDM0MSwiZXhwIjoxNzYzMDYwNzQxfQ.4ngTOGJk5_JwXiatIZ_HerQtkCO92TJ4KwQFgolhsni8AU-A-fOZx1VjBaSwHxCvDc-igv3AiFSjhZ5FeXb1cA';

const makeRequest = async (endpoint, method = 'GET') => {
    try {
        console.log(`\n📌 Testing: ${method} ${endpoint}`);
        console.log('─'.repeat(60));

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

        const response = await axios(config);

        console.log(`✅ Status: ${response.status}`);
        console.log(`Response Data:`);
        console.log(JSON.stringify(response.data, null, 2));

        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        console.log(`❌ Error: ${error.response?.status || error.message}`);
        console.log(`Message: ${error.response?.data?.message || error.message}`);
        if (error.response?.data) {
            console.log('Full Error Response:');
            console.log(JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, error: error.message, status: error.response?.status };
    }
};

const runTests = async () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   SUPERADMIN INTEGRATION DEBUG TEST                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    const endpoints = [
        // Core endpoints
        { endpoint: '/admin/stats', method: 'GET', desc: 'Get Admin Statistics' },
        { endpoint: '/admin/users', method: 'GET', desc: 'Get All Users' },
        { endpoint: '/admin/users?page=0&size=10', method: 'GET', desc: 'Get Users with Pagination' },
        { endpoint: '/admin/users/test1', method: 'GET', desc: 'Get Single User' },
        { endpoint: '/admin/users/test1/roles', method: 'GET', desc: 'Get User Roles' },

        // Role management endpoints
        { endpoint: '/admin/users/test1/roles/USER', method: 'POST', desc: 'Add Role to User' },
        { endpoint: '/admin/users/test1/roles/USER', method: 'DELETE', desc: 'Remove Role from User' },

        // Status management endpoints
        { endpoint: '/admin/users/test1/activate', method: 'POST', desc: 'Activate User' },
        { endpoint: '/admin/users/test1/deactivate', method: 'POST', desc: 'Deactivate User' },

        // Alternative auth endpoints
        { endpoint: '/auth/roles/test1/add/USER', method: 'POST', desc: 'Add Role (Alt Auth)' },
        { endpoint: '/auth/roles/test1/remove/USER', method: 'POST', desc: 'Remove Role (Alt Auth)' },
    ];

    console.log('\n🔍 TESTING ENDPOINTS:\n');

    const results = [];

    for (const test of endpoints) {
        const result = await makeRequest(test.endpoint, test.method);
        results.push({
            ...test,
            ...result
        });

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   SUMMARY OF RESULTS                                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}\n`);

    console.log('Results by endpoint:');
    results.forEach((r, idx) => {
        const status = r.success ? '✅' : '❌';
        console.log(`${idx + 1}. ${status} ${r.method} ${r.endpoint} - ${r.status || r.error}`);
    });

    // Analysis
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   ANALYSIS & RECOMMENDATIONS                               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const failedEndpoints = results.filter(r => !r.success);
    const successEndpoints = results.filter(r => r.success);

    if (successEndpoints.length > 0) {
        console.log('✅ WORKING ENDPOINTS:');
        successEndpoints.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint}`);
        });
    }

    if (failedEndpoints.length > 0) {
        console.log('\n❌ FAILED ENDPOINTS:');
        failedEndpoints.forEach(r => {
            console.log(`   • ${r.method} ${r.endpoint}`);
            console.log(`     Error: ${r.error || r.status}`);
        });
    }

    // Common issues
    console.log('\n\n🔧 COMMON ISSUES TO CHECK:');
    console.log('');
    console.log('1. TOKEN VALIDITY');
    console.log('   - Token expiration: Check if token is still valid');
    console.log(`   - Current token: ${SUPERADMIN_TOKEN.substring(0, 50)}...`);
    console.log('');
    console.log('2. API ROUTE CONFIGURATION');
    console.log('   - Verify endpoints match backend route definitions');
    console.log('   - Check if /admin/* routes require special authentication');
    console.log('');
    console.log('3. FRONTEND INTEGRATION');
    console.log('   - Verify useSuperAdmin hook is called on mount');
    console.log('   - Check if errors are being caught silently');
    console.log('   - Verify loading states are correct');
    console.log('');
    console.log('4. CORS/HEADERS');
    console.log('   - Ensure Authorization header is being sent');
    console.log('   - Check CORS policies match frontend domain');
    console.log('');
};

runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});