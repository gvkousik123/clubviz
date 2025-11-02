#!/usr/bin/env node

// Test script to verify public APIs work without authentication
const axios = require('axios');

const API_BASE_URL = 'https://98.90.141.103/api';

// Test configuration
const tests = [
    {
        name: 'Search - Global Search',
        method: 'GET',
        url: '/search/global',
        params: { query: 'club' },
        expectAuth: false
    },
    {
        name: 'Search - Balanced Search',
        method: 'GET',
        url: '/search/balanced',
        params: { query: 'music' },
        expectAuth: false
    },
    {
        name: 'Search - Categories',
        method: 'GET',
        url: '/search/categories',
        expectAuth: false
    },
    {
        name: 'Clubs - Public Clubs List',
        method: 'GET',
        url: '/clubs/public',
        expectAuth: false
    },
    {
        name: 'Clubs - Public Categories',
        method: 'GET',
        url: '/clubs/public/categories',
        expectAuth: false
    },
    {
        name: 'Clubs - Search Public Clubs',
        method: 'GET',
        url: '/clubs/search',
        params: { query: 'bar' },
        expectAuth: false
    },
    {
        name: 'Lookup - All Categories',
        method: 'GET',
        url: '/lookup/club/all',
        expectAuth: false
    },
    {
        name: 'Events - Public Events List',
        method: 'GET',
        url: '/events/list',
        params: { page: 0, size: 5 },
        expectAuth: false
    }
];

async function runTest(test) {
    console.log(`\\n🧪 Testing: ${test.name}`);
    console.log(`   URL: ${test.method} ${test.url}`);

    try {
        const config = {
            method: test.method.toLowerCase(),
            url: `${API_BASE_URL}${test.url}`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Skip SSL certificate validation for self-signed certificates
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        };

        // Add query params if present
        if (test.params) {
            config.params = test.params;
        }

        // Note: We're deliberately NOT adding Authorization header to test public access

        const response = await axios(config);

        console.log(`   ✅ SUCCESS - Status: ${response.status}`);

        // Show a preview of the response data
        if (response.data) {
            if (response.data.data) {
                const data = response.data.data;
                if (Array.isArray(data)) {
                    console.log(`   📊 Returned ${data.length} items`);
                    if (data.length > 0) {
                        console.log(`   📄 Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`);
                    }
                } else {
                    console.log(`   📄 Response: ${JSON.stringify(data).substring(0, 100)}...`);
                }
            } else {
                console.log(`   📄 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
            }
        }

        return {
            name: test.name,
            success: true,
            status: response.status,
            dataSize: response.data?.data?.length || 0
        };

    } catch (error) {
        const status = error.response?.status || 'Network Error';
        const message = error.response?.data?.message || error.message;

        if (status === 401 || status === 403) {
            console.log(`   ❌ FAILED - ${status}: ${message}`);
            console.log(`   ⚠️  This endpoint requires authentication (not public)`);
        } else {
            console.log(`   ❌ ERROR - ${status}: ${message}`);
        }

        return {
            name: test.name,
            success: false,
            status,
            error: message
        };
    }
}

async function runAllTests() {
    console.log('🔓 TESTING PUBLIC APIs WITHOUT AUTHENTICATION');
    console.log('==============================================');
    console.log(`🌐 API Base URL: ${API_BASE_URL}`);
    console.log(`📅 Test Time: ${new Date().toISOString()}`);

    const results = [];

    for (const test of tests) {
        const result = await runTest(test);
        results.push(result);

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\\n📊 TEST RESULTS SUMMARY');
    console.log('========================');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);

    if (successful.length > 0) {
        console.log('\\n✅ PUBLIC APIs (Work without authentication):');
        successful.forEach(r => {
            console.log(`   - ${r.name} (${r.status})`);
        });
    }

    if (failed.length > 0) {
        console.log('\\n❌ PROTECTED APIs (Require authentication):');
        failed.forEach(r => {
            console.log(`   - ${r.name} (${r.status}): ${r.error}`);
        });
    }

    console.log('\\n🎯 GUEST LOGIN RECOMMENDATIONS:');
    console.log('===============================');

    if (successful.length > 0) {
        console.log('✅ These features should work for guest users:');
        console.log('   - Browse public clubs and venues');
        console.log('   - Search for clubs and events');
        console.log('   - View club categories and filters');
        console.log('   - Get search suggestions');
        console.log('   - Access reference/lookup data');
    }

    if (failed.length > 0) {
        console.log('\\n⚠️  These features will require login prompts:');
        console.log('   - User-specific content (my clubs, bookings)');
        console.log('   - RSVP to events');
        console.log('   - Join clubs');
        console.log('   - Create content');
        console.log('   - Admin operations');
    }

    console.log('\\n🔧 Implementation Notes:');
    console.log('========================');
    console.log('1. Use PublicClubService, PublicSearchService for guest users');
    console.log('2. Show "Login Required" messages for protected actions');
    console.log('3. Allow browsing but block modifications for guests');
    console.log('4. Redirect to /auth/login when authentication needed');

    return results;
}

// Run the tests
runAllTests().catch(console.error);