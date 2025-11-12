// =============================================================================
// ADMIN API ROUTES TEST SUITE
// =============================================================================
// This file tests all /admin/* endpoints to verify authentication and functionality

const axios = require('axios');

// Configuration
const BASE_URL = 'https://clubwiz.in/api';
const TIMEOUT = 10000;

// Test credentials - update these with valid credentials
const TEST_ACCOUNTS = {
    superadmin: {
        username: 'kousik',
        password: 'your_superadmin_password' // Update this
    },
    admin: {
        username: 'test2',
        password: 'your_admin_password' // Update this
    },
    user: {
        username: 'test1',
        password: 'your_user_password' // Update this
    }
};

// Test results storage
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

// Utility functions
const makeApiCall = async (endpoint, method = 'GET', data = null, token = null) => {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            timeout: TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.data = data;
        }

        const response = await axios(config);
        return {
            success: true,
            status: response.status,
            data: response.data,
            headers: response.headers
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            error: error.response?.data || error.message,
            message: error.message
        };
    }
};

const loginUser = async (username, password) => {
    console.log(`🔑 Attempting login for: ${username}`);
    const response = await makeApiCall('/auth/login', 'POST', {
        username,
        password
    });

    if (response.success && response.data?.accessToken) {
        console.log(`✅ Login successful for ${username}`);
        console.log(`   Token: ${response.data.accessToken.substring(0, 20)}...`);
        console.log(`   Roles: ${JSON.stringify(response.data.user?.roles || [])}`);
        return response.data.accessToken;
    } else {
        console.log(`❌ Login failed for ${username}: ${response.error || response.message}`);
        return null;
    }
};

const logResult = (test, success, details) => {
    const result = {
        test,
        success,
        details,
        timestamp: new Date().toISOString()
    };

    results.tests.push(result);
    if (success) {
        results.passed++;
        console.log(`✅ PASS: ${test}`);
    } else {
        results.failed++;
        console.log(`❌ FAIL: ${test}`);
    }

    if (details) {
        console.log(`   Details: ${details}`);
    }
    console.log('');
};

// =============================================================================
// ADMIN ENDPOINT TESTS
// =============================================================================

const testAdminStats = async (token, userType) => {
    console.log(`📊 Testing Admin Stats (${userType})...`);
    const response = await makeApiCall('/admin/stats', 'GET', null, token);

    if (response.success) {
        const stats = response.data;
        logResult(`Admin Stats - ${userType}`, true,
            `Total Users: ${stats.totalUsers}, Active: ${stats.activeUsers}, Admins: ${stats.admins}`);
        return stats;
    } else {
        logResult(`Admin Stats - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
        return null;
    }
};

const testAdminUsers = async (token, userType) => {
    console.log(`👥 Testing Admin Users (${userType})...`);

    // Test 1: Get all users
    let response = await makeApiCall('/admin/users', 'GET', null, token);
    if (response.success) {
        logResult(`Get All Users - ${userType}`, true,
            `Found ${response.data.length} users`);
    } else {
        logResult(`Get All Users - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }

    // Test 2: Get users with pagination
    response = await makeApiCall('/admin/users?page=0&size=10', 'GET', null, token);
    if (response.success) {
        logResult(`Get Users Paginated - ${userType}`, true,
            `Page 0, Size 10: ${response.data.length} users`);
    } else {
        logResult(`Get Users Paginated - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }

    // Test 3: Search users
    response = await makeApiCall('/admin/users/search?query=test', 'GET', null, token);
    if (response.success) {
        logResult(`Search Users - ${userType}`, true,
            `Search results: ${response.data.length} users`);
    } else {
        logResult(`Search Users - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }

    return response.success;
};

const testUserManagement = async (token, userType) => {
    console.log(`⚙️ Testing User Management Operations (${userType})...`);

    // Test getting a specific user (using test1 as example)
    let response = await makeApiCall('/admin/users/test1', 'GET', null, token);
    if (response.success) {
        logResult(`Get User Details - ${userType}`, true,
            `User: ${response.data.username}, Active: ${response.data.isActive}`);

        // Test getting user roles
        response = await makeApiCall('/admin/users/test1/roles', 'GET', null, token);
        if (response.success) {
            logResult(`Get User Roles - ${userType}`, true,
                `Roles: ${JSON.stringify(response.data)}`);
        } else {
            logResult(`Get User Roles - ${userType}`, false,
                `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
        }
    } else {
        logResult(`Get User Details - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }
};

const testRoleManagement = async (token, userType) => {
    console.log(`🔐 Testing Role Management (${userType})...`);

    // Test adding a role (we'll use a test user and then remove it)
    let response = await makeApiCall('/admin/users/test1/roles/USER', 'POST', null, token);
    if (response.success) {
        logResult(`Add Role to User - ${userType}`, true, response.data.message || 'Role added successfully');

        // Test removing the role
        response = await makeApiCall('/admin/users/test1/roles/USER', 'DELETE', null, token);
        if (response.success) {
            logResult(`Remove Role from User - ${userType}`, true, response.data.message || 'Role removed successfully');
        } else {
            logResult(`Remove Role from User - ${userType}`, false,
                `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
        }
    } else {
        logResult(`Add Role to User - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }
};

const testUserActivation = async (token, userType) => {
    console.log(`🔄 Testing User Activation/Deactivation (${userType})...`);

    // Test deactivating a user
    let response = await makeApiCall('/admin/users/test1/deactivate', 'POST', null, token);
    if (response.success) {
        logResult(`Deactivate User - ${userType}`, true, response.data.message || 'User deactivated');

        // Test reactivating the user
        response = await makeApiCall('/admin/users/test1/activate', 'POST', null, token);
        if (response.success) {
            logResult(`Activate User - ${userType}`, true, response.data.message || 'User activated');
        } else {
            logResult(`Activate User - ${userType}`, false,
                `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
        }
    } else {
        logResult(`Deactivate User - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }
};

const testAdminClubs = async (token, userType) => {
    console.log(`🏢 Testing Admin Clubs (${userType})...`);

    const response = await makeApiCall('/admin/clubs', 'GET', null, token);
    if (response.success) {
        logResult(`Get Admin Clubs - ${userType}`, true,
            `Found ${response.data.length} clubs`);
    } else {
        logResult(`Get Admin Clubs - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }
};

const testAdminEvents = async (token, userType) => {
    console.log(`🎉 Testing Admin Events (${userType})...`);

    const response = await makeApiCall('/admin/events', 'GET', null, token);
    if (response.success) {
        logResult(`Get Admin Events - ${userType}`, true,
            `Found ${response.data.length} events`);
    } else {
        logResult(`Get Admin Events - ${userType}`, false,
            `Status: ${response.status}, Error: ${JSON.stringify(response.error)}`);
    }
};

// =============================================================================
// MAIN TEST EXECUTION
// =============================================================================

const runAdminTests = async () => {
    console.log('🎯 ADMIN API TEST SUITE');
    console.log('========================');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Start Time: ${new Date().toISOString()}`);
    console.log('');

    // Step 1: Try to login with different account types
    const tokens = {};

    console.log('🔑 AUTHENTICATION PHASE');
    console.log('=======================');

    // Login as superadmin
    tokens.superadmin = await loginUser(TEST_ACCOUNTS.superadmin.username, TEST_ACCOUNTS.superadmin.password);

    // Login as admin
    tokens.admin = await loginUser(TEST_ACCOUNTS.admin.username, TEST_ACCOUNTS.admin.password);

    // Login as regular user
    tokens.user = await loginUser(TEST_ACCOUNTS.user.username, TEST_ACCOUNTS.user.password);

    console.log('');

    // Step 2: Test admin endpoints with different permission levels
    console.log('📋 ADMIN ENDPOINT TESTING');
    console.log('=========================');

    // Test with superadmin token
    if (tokens.superadmin) {
        console.log('🔴 TESTING WITH SUPERADMIN TOKEN');
        console.log('--------------------------------');
        await testAdminStats(tokens.superadmin, 'SUPERADMIN');
        await testAdminUsers(tokens.superadmin, 'SUPERADMIN');
        await testUserManagement(tokens.superadmin, 'SUPERADMIN');
        await testRoleManagement(tokens.superadmin, 'SUPERADMIN');
        await testUserActivation(tokens.superadmin, 'SUPERADMIN');
        await testAdminClubs(tokens.superadmin, 'SUPERADMIN');
        await testAdminEvents(tokens.superadmin, 'SUPERADMIN');
        console.log('');
    }

    // Test with admin token
    if (tokens.admin) {
        console.log('🟡 TESTING WITH ADMIN TOKEN');
        console.log('---------------------------');
        await testAdminStats(tokens.admin, 'ADMIN');
        await testAdminUsers(tokens.admin, 'ADMIN');
        await testUserManagement(tokens.admin, 'ADMIN');
        await testRoleManagement(tokens.admin, 'ADMIN');
        await testUserActivation(tokens.admin, 'ADMIN');
        await testAdminClubs(tokens.admin, 'ADMIN');
        await testAdminEvents(tokens.admin, 'ADMIN');
        console.log('');
    }

    // Test with regular user token (should fail)
    if (tokens.user) {
        console.log('🟢 TESTING WITH USER TOKEN (Should Fail)');
        console.log('----------------------------------------');
        await testAdminStats(tokens.user, 'USER');
        await testAdminUsers(tokens.user, 'USER');
        console.log('');
    }

    // Test without token (should fail)
    console.log('⚪ TESTING WITHOUT TOKEN (Should Fail)');
    console.log('-------------------------------------');
    await testAdminStats(null, 'NO TOKEN');
    await testAdminUsers(null, 'NO TOKEN');
    console.log('');

    // Step 3: Summary
    console.log('📊 TEST SUMMARY');
    console.log('===============');
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('');

    // Show failed tests
    const failedTests = results.tests.filter(t => !t.success);
    if (failedTests.length > 0) {
        console.log('❌ FAILED TESTS DETAILS');
        console.log('=======================');
        failedTests.forEach(test => {
            console.log(`• ${test.test}: ${test.details}`);
        });
        console.log('');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS');
    console.log('==================');

    if (!tokens.superadmin) {
        console.log('• Update SUPERADMIN credentials in this file');
    }

    if (!tokens.admin) {
        console.log('• Update ADMIN credentials in this file');
    }

    if (failedTests.some(t => t.details.includes('403'))) {
        console.log('• Some 403 errors may indicate insufficient permissions or expired tokens');
    }

    if (failedTests.some(t => t.details.includes('401'))) {
        console.log('• 401 errors indicate authentication issues - check credentials');
    }

    console.log('• For production: Use environment variables for credentials');
    console.log('• Consider implementing token refresh logic');
};

// Export for use in other files
module.exports = {
    makeApiCall,
    loginUser,
    runAdminTests,
    testAdminStats,
    testAdminUsers,
    testUserManagement,
    testRoleManagement,
    testUserActivation,
    testAdminClubs,
    testAdminEvents
};

// Run tests if this file is executed directly
if (require.main === module) {
    console.log('⚠️  IMPORTANT: Update credentials in TEST_ACCOUNTS before running!');
    console.log('   Edit lines 10-20 with your actual login credentials');
    console.log('');

    // Uncomment the line below after updating credentials
    // runAdminTests().catch(console.error);

    console.log('❌ Tests not executed - update credentials first!');
    console.log('   Remove the comment from line 346 after updating credentials');
}