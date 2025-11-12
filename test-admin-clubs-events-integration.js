/**
 * TEST ADMIN EVENTS AND CLUBS APIs
 * Check: CREATE, READ, UPDATE, DELETE, PREVIEW
 * Verify all operations are properly integrated
 */

const axios = require('axios');

const BASE_URL = 'https://clubwiz.in/api';

// Test token 
const SUPERADMIN_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjk3NDM0MSwiZXhwIjoxNzYzMDYwNzQxfQ.4ngTOGJk5_JwXiatIZ_HerQtkCO92TJ4KwQFgolhsni8AU-A-fOZx1VjBaSwHxCvDc-igv3AiFSjhZ5FeXb1cA';

const makeRequest = async (endpoint, method = 'GET', data = null) => {
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

        if (data && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
            config.data = data;
        }

        const response = await axios(config);
        return { success: true, status: response.status, data: response.data };
    } catch (error) {
        return { 
            success: false, 
            status: error.response?.status, 
            error: error.response?.data?.message || error.message 
        };
    }
};

const runTests = async () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║          ADMIN CLUBS & EVENTS API INTEGRATION TEST                           ║
║               Checking CREATE, READ, UPDATE, DELETE, PREVIEW                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

    const tests = [
        // ========================================================================
        // CLUBS API TESTS
        // ========================================================================
        {
            category: 'CLUBS - READ',
            tests: [
                { endpoint: '/admin/clubs', method: 'GET', desc: 'List all clubs' },
                { endpoint: '/admin/clubs/1', method: 'GET', desc: 'Get specific club' },
                { endpoint: '/clubs/public', method: 'GET', desc: 'Public clubs list' },
            ]
        },
        {
            category: 'CLUBS - CREATE',
            tests: [
                { endpoint: '/admin/clubs', method: 'POST', desc: 'Create new club', data: { name: 'Test Club', description: 'Test' } },
                { endpoint: '/clubs', method: 'POST', desc: 'Create club (alt)', data: { name: 'Test Club' } },
            ]
        },
        {
            category: 'CLUBS - UPDATE',
            tests: [
                { endpoint: '/admin/clubs/1', method: 'PUT', desc: 'Update club (PUT)', data: { name: 'Updated Club' } },
                { endpoint: '/admin/clubs/1', method: 'PATCH', desc: 'Update club (PATCH)', data: { description: 'Updated' } },
                { endpoint: '/clubs/1', method: 'PUT', desc: 'Update club (alt)', data: { name: 'Updated' } },
            ]
        },
        {
            category: 'CLUBS - DELETE',
            tests: [
                { endpoint: '/admin/clubs/1', method: 'DELETE', desc: 'Delete club' },
                { endpoint: '/clubs/1', method: 'DELETE', desc: 'Delete club (alt)' },
            ]
        },
        {
            category: 'CLUBS - PREVIEW',
            tests: [
                { endpoint: '/admin/clubs/1/preview', method: 'GET', desc: 'Preview club' },
                { endpoint: '/clubs/1/preview', method: 'GET', desc: 'Preview club (alt)' },
            ]
        },

        // ========================================================================
        // EVENTS API TESTS
        // ========================================================================
        {
            category: 'EVENTS - READ',
            tests: [
                { endpoint: '/admin/events', method: 'GET', desc: 'List all events' },
                { endpoint: '/admin/events/1', method: 'GET', desc: 'Get specific event' },
                { endpoint: '/events/list', method: 'GET', desc: 'Events list' },
                { endpoint: '/events/1', method: 'GET', desc: 'Get event details' },
            ]
        },
        {
            category: 'EVENTS - CREATE',
            tests: [
                { endpoint: '/admin/events', method: 'POST', desc: 'Create event (admin)', data: { title: 'Test Event' } },
                { endpoint: '/events', method: 'POST', desc: 'Create event', data: { title: 'Test Event' } },
            ]
        },
        {
            category: 'EVENTS - UPDATE',
            tests: [
                { endpoint: '/admin/events/1', method: 'PUT', desc: 'Update event (admin PUT)', data: { title: 'Updated Event' } },
                { endpoint: '/admin/events/1', method: 'PATCH', desc: 'Update event (admin PATCH)', data: { title: 'Updated' } },
                { endpoint: '/events/1', method: 'PUT', desc: 'Update event (PUT)', data: { title: 'Updated Event' } },
                { endpoint: '/events/1', method: 'PATCH', desc: 'Update event (PATCH)', data: { title: 'Updated' } },
            ]
        },
        {
            category: 'EVENTS - DELETE',
            tests: [
                { endpoint: '/admin/events/1', method: 'DELETE', desc: 'Delete event (admin)' },
                { endpoint: '/events/1', method: 'DELETE', desc: 'Delete event' },
            ]
        },
        {
            category: 'EVENTS - PREVIEW',
            tests: [
                { endpoint: '/admin/events/1/preview', method: 'GET', desc: 'Preview event' },
                { endpoint: '/events/1/preview', method: 'GET', desc: 'Preview event (alt)' },
            ]
        },

        // ========================================================================
        // ADVANCED OPERATIONS
        // ========================================================================
        {
            category: 'CLUBS - ADVANCED',
            tests: [
                { endpoint: '/admin/clubs/1/events', method: 'GET', desc: 'Get club events' },
                { endpoint: '/admin/clubs/1/stats', method: 'GET', desc: 'Get club stats' },
                { endpoint: '/admin/clubs/1/bookings', method: 'GET', desc: 'Get club bookings' },
            ]
        },
        {
            category: 'EVENTS - ADVANCED',
            tests: [
                { endpoint: '/admin/events/1/bookings', method: 'GET', desc: 'Get event bookings' },
                { endpoint: '/admin/events/1/stats', method: 'GET', desc: 'Get event stats' },
                { endpoint: '/events/1/bookings', method: 'GET', desc: 'Get event bookings (alt)' },
            ]
        },
    ];

    const results = [];
    let categoryResults = {};

    for (const category of tests) {
        console.log(`\n${category.category}`);
        console.log('─'.repeat(80));
        
        if (!categoryResults[category.category]) {
            categoryResults[category.category] = { total: 0, working: 0, failed: 0, methods: {} };
        }

        for (const test of category.tests) {
            const result = await makeRequest(test.endpoint, test.method, test.data);
            
            const icon = result.success ? '✅' : '❌';
            const statusStr = result.success ? `${result.status}` : `${result.status || 'ERROR'}`;
            
            console.log(`${icon} ${test.method.padEnd(6)} ${test.endpoint.padEnd(35)} | ${statusStr.padEnd(5)} | ${test.desc}`);
            
            categoryResults[category.category].total++;
            if (result.success) {
                categoryResults[category.category].working++;
            } else {
                categoryResults[category.category].failed++;
            }

            if (!categoryResults[category.category].methods[test.method]) {
                categoryResults[category.category].methods[test.method] = { total: 0, working: 0 };
            }
            categoryResults[category.category].methods[test.method].total++;
            if (result.success) {
                categoryResults[category.category].methods[test.method].working++;
            }

            results.push({ ...test, ...result });
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // ============================================================================
    // SUMMARY REPORT
    // ============================================================================
    console.log(`

╔══════════════════════════════════════════════════════════════════════════════╗
║                        INTEGRATION TEST SUMMARY                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

    const allWorking = results.filter(r => r.success).length;
    const allFailed = results.filter(r => !r.success).length;
    const total = results.length;

    console.log(`
📊 OVERALL RESULTS
─────────────────────────────────────────────────────────────────────────────
Total Tests:        ${total}
✅ Working:         ${allWorking} (${((allWorking / total) * 100).toFixed(1)}%)
❌ Failed/Missing:  ${allFailed} (${((allFailed / total) * 100).toFixed(1)}%)
`);

    console.log(`📋 RESULTS BY CATEGORY
─────────────────────────────────────────────────────────────────────────────`);

    for (const [category, stats] of Object.entries(categoryResults)) {
        const percentage = ((stats.working / stats.total) * 100).toFixed(1);
        const icon = stats.working === stats.total ? '✅' : stats.working === 0 ? '❌' : '⚠️';
        console.log(`${icon} ${category.padEnd(35)} | ${stats.working}/${stats.total} (${percentage}%)`);
        
        for (const [method, methodStats] of Object.entries(stats.methods)) {
            const methodPercentage = ((methodStats.working / methodStats.total) * 100).toFixed(1);
            const methodIcon = methodStats.working === methodStats.total ? '✅' : methodStats.working === 0 ? '❌' : '⚠️';
            console.log(`   ${methodIcon} ${method}: ${methodStats.working}/${methodStats.total} (${methodPercentage}%)`);
        }
    }

    // ============================================================================
    // DETAILED ANALYSIS
    // ============================================================================
    console.log(`

╔══════════════════════════════════════════════════════════════════════════════╗
║                        DETAILED ANALYSIS                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

    const workingByOperation = {
        'READ (GET)': results.filter(r => r.method === 'GET' && r.success).length,
        'CREATE (POST)': results.filter(r => r.method === 'POST' && r.success).length,
        'UPDATE (PUT)': results.filter(r => r.method === 'PUT' && r.success).length,
        'UPDATE (PATCH)': results.filter(r => r.method === 'PATCH' && r.success).length,
        'DELETE': results.filter(r => r.method === 'DELETE' && r.success).length,
    };

    const totalByOperation = {
        'READ (GET)': results.filter(r => r.method === 'GET').length,
        'CREATE (POST)': results.filter(r => r.method === 'POST').length,
        'UPDATE (PUT)': results.filter(r => r.method === 'PUT').length,
        'UPDATE (PATCH)': results.filter(r => r.method === 'PATCH').length,
        'DELETE': results.filter(r => r.method === 'DELETE').length,
    };

    console.log(`🔄 OPERATION STATUS
─────────────────────────────────────────────────────────────────────────────`);

    for (const [operation, working] of Object.entries(workingByOperation)) {
        const total = totalByOperation[operation];
        const icon = working === total ? '✅' : working === 0 ? '❌' : '⚠️';
        console.log(`${icon} ${operation.padEnd(20)} | ${working}/${total} working`);
    }

    // ============================================================================
    // RESOURCE STATUS
    // ============================================================================
    const clubsWorking = results.filter(r => r.endpoint.includes('/clubs') && r.success).length;
    const clubsTotal = results.filter(r => r.endpoint.includes('/clubs')).length;
    const eventsWorking = results.filter(r => r.endpoint.includes('/events') && r.success).length;
    const eventsTotal = results.filter(r => r.endpoint.includes('/events')).length;

    console.log(`

📦 RESOURCE STATUS
─────────────────────────────────────────────────────────────────────────────`);

    console.log(`Clubs API:  ${clubsWorking === clubsTotal ? '✅' : clubsWorking === 0 ? '❌' : '⚠️'} ${clubsWorking}/${clubsTotal} endpoints working`);
    console.log(`Events API: ${eventsWorking === eventsTotal ? '✅' : eventsWorking === 0 ? '❌' : '⚠️'} ${eventsWorking}/${eventsTotal} endpoints working`);

    // ============================================================================
    // FAILURES DETAILED
    // ============================================================================
    const failures = results.filter(r => !r.success);
    
    if (failures.length > 0) {
        console.log(`

❌ FAILED ENDPOINTS (${failures.length} total)
─────────────────────────────────────────────────────────────────────────────`);
        
        const statusGroups = {};
        failures.forEach(f => {
            const status = f.status || 'ERROR';
            if (!statusGroups[status]) statusGroups[status] = [];
            statusGroups[status].push(f);
        });

        for (const [status, items] of Object.entries(statusGroups)) {
            console.log(`\n${status}:`);
            items.forEach(item => {
                console.log(`  • ${item.method} ${item.endpoint}`);
                console.log(`    ${item.error || 'No response'}`);
            });
        }
    }

    // ============================================================================
    // RECOMMENDATIONS
    // ============================================================================
    console.log(`

╔══════════════════════════════════════════════════════════════════════════════╗
║                        INTEGRATION RECOMMENDATIONS                           ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

    if (allWorking === total) {
        console.log(`
✅ EXCELLENT! All endpoints are integrated and working.

Next Steps:
1. Test in frontend application
2. Verify data is properly displayed
3. Test bulk operations
4. Monitor performance with large datasets
5. Set up comprehensive error handling in frontend
`);
    } else if (allWorking >= (total * 0.8)) {
        console.log(`
⚠️  GOOD! Most endpoints are working (${((allWorking / total) * 100).toFixed(1)}%).

Issues to Address:
${failures.map(f => `• ${f.method} ${f.endpoint} - Status ${f.status}`).join('\n')}

Recommendations:
1. Check backend routes for missing endpoints
2. Verify HTTP methods match backend implementation
3. Check authentication/authorization for 403 errors
4. Test endpoint existence for 404 errors
5. Review backend error responses
`);
    } else {
        console.log(`
❌ INTEGRATION INCOMPLETE! Only ${((allWorking / total) * 100).toFixed(1)}% endpoints working.

Critical Issues:
${failures.slice(0, 10).map(f => `• ${f.method} ${f.endpoint} - Status ${f.status}`).join('\n')}

Action Items:
1. Review backend API implementation
2. Check route definitions
3. Verify authentication is set up correctly
4. Test with proper API credentials
5. Check API server logs for errors
6. Implement missing endpoints
`);
    }

    console.log(`

╔══════════════════════════════════════════════════════════════════════════════╗
║                            END OF REPORT                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
};

runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
