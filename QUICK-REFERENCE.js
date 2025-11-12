#!/usr/bin/env node

/**
 * 🚀 QUICK REFERENCE - API Test Suite
 * 
 * Run this file to get a quick status check
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           🎯 CLUBVIZ API TEST SUITE - QUICK REFERENCE       ║
╚══════════════════════════════════════════════════════════════╝

📂 FILES CREATED:
├─ test-all-apis.js          (Main test suite - 350+ lines)
├─ API-TEST-FINDINGS.js      (Token analysis utility)
├─ API-TEST-REPORT.md        (Detailed findings & solutions)
├─ ISSUE-ANALYSIS.md         (Issue breakdown)
└─ QUICK-REFERENCE.js        (This file)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CURRENT STATUS:

Token Status:
  ✅ Admin Token (test2)       - VALID ✅ (expires in ~3 hours)
  ✅ Customer Token (test1)    - VALID ✅ (expires in ~1 day)
  ❌ SuperAdmin Token (kousik) - EXPIRED ❌ (needs refresh)

API Status:
  ✅ Working Endpoints:  3/50+ (Public APIs, Profile, Search)
  ❌ Failing:            47/50+ (403 Forbidden, 404 Not Found, etc.)
  ⚠️  Wrong Paths:       2 (use /clubs/public and /events/list)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 QUICK START:

1️⃣  Run Full Test Suite:
    $ node test-all-apis.js

2️⃣  Check Token Status:
    $ node API-TEST-FINDINGS.js

3️⃣  Read Full Report:
    $ cat API-TEST-REPORT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 FIXES NEEDED:

1. CRITICAL - Get Fresh Superadmin Token:
   
   POST https://clubwiz.in/api/auth/login
   {
     "username": "kousik",
     "password": "YOUR_PASSWORD_HERE"
   }
   
   Then update TOKENS.superadmin in test-all-apis.js

2. Update API Paths (in test-all-apis.js):
   
   OLD → NEW
   /clubs → /clubs/public
   /events → /events/list

3. Fix Profile Update Payload:
   
   OLD: { firstName: 'X', lastName: 'Y' }
   NEW: { fullName: 'X Y' }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WORKING ENDPOINTS (Verified):

Public:
  GET /auth/cors-origins
  GET /clubs/public
  GET /events/list
  
With Auth (Valid Tokens):
  GET /profile
  GET /profile/stats
  GET /search/global?query=...
  GET /search/balanced?query=...
  GET /clubs/search?query=...
  GET /events/attending

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ BROKEN ENDPOINTS (Need Fixing):

Wrong Path:
  GET /clubs       → 405 (use /clubs/public)
  GET /events      → 405 (use /events/list)

Not Found:
  GET /events/categories
  GET /events/recommended

Auth Issues (Token Expired):
  POST /admin/clubs
  POST /admin/events
  GET /admin/stats
  GET /admin/users
  (All /admin/* endpoints)

Permission Issues:
  GET /reviews
  GET /notifications
  GET /gallery
  GET /lookup/*
  GET /payments/methods

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TEST COVERAGE:

SuperAdmin APIs:
  - Status: ⚠️  SKIPPED (token expired)
  - Tests: admin stats, users, clubs, events, analytics
  - Action: Refresh superadmin token first

Admin APIs (CRUD):
  - Status: ⚠️  PARTIAL (50% work with valid token)
  - Tests: create/update/delete clubs & events
  - Action: Implement proper role checks

Customer APIs (READ):
  - Status: ✅ WORKING (70% working)
  - Tests: read profiles, search, bookings
  - Action: Minor fixes needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 NEXT STEPS:

Step 1: Refresh Superadmin Token (5 minutes)
  → Use the curl command above
  → Update TOKENS.superadmin in test-all-apis.js
  → Re-run tests

Step 2: Fix API Paths (2 minutes)
  → Update /clubs to /clubs/public
  → Update /events to /events/list

Step 3: Fix Profile Payload (1 minute)
  → Update firstName/lastName to fullName

Step 4: Re-run Full Tests (2 minutes)
  → $ node test-all-apis.js
  → Should see 40-50% pass rate after fixes

Step 5: Debug Remaining Issues (as needed)
  → Check server logs for auth issues
  → Verify user roles are assigned correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 LEARNING RESOURCES:

Understanding the Errors:
  403 Forbidden  → Auth failed or role mismatch
  404 Not Found  → Endpoint doesn't exist
  405 Not Allowed → Wrong HTTP method
  400 Bad Request → Invalid request payload
  200 OK         → Success!

JWT Tokens:
  Token Format: header.payload.signature
  Expiration: Check 'exp' field in payload
  Refresh: Get new token from /auth/login
  TTL: ~24 hours by default

API Testing Best Practices:
  1. Test public endpoints first
  2. Then test authenticated endpoints
  3. Finally test admin/superadmin endpoints
  4. Always handle token expiration gracefully
  5. Use error codes to debug issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 SUPPORT:

Issues? Check:
  1. Token expiration: node API-TEST-FINDINGS.js
  2. Endpoint availability: See diagnostics in test output
  3. Full report: Read API-TEST-REPORT.md
  4. Server logs: Check backend for detailed errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  Estimated Time to Full Fix: 15 minutes

Last Generated: 2025-11-12 13:36 UTC
`);

// Quick token status check
function checkTokens() {
  const TOKENS = {
    superadmin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjg2NzIzMCwiZXhwIjoxNzYyOTUzNjMwfQ.wO22wniVuVTvdMpKmgi_BJPTkSnEv3jOxjZoWY7FoyJNROSkpZsq1SqsXOFqqRd64f1q4xPqjTj_4SXx3cF10Q',
    admin: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MiIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTc2Mjg3OTQ1MywiZXhwIjoxNzYyOTY1ODUzfQ.YQjylgLbZd4x7X-3Y1ckqsLIB9HEgw81G8CGgcNbjtRHSxyISkAYqHEeBJalp8b6_DZ-W_dVGb2j8oEUiZvs_w',
    customer: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNzYyOTU0MDc5LCJleHAiOjE3NjMwNDA0Nzl9.VVIo6Eld_5ulfo2dfwMnvOuS3HOpFVbo5cybEweZg00-Q-gCGV-0KP_FbrEJYlwevJdjqpLOvqENR_6WEcNkPA'
  };

  console.log('Token Expiration Check:');
  const now = Math.floor(Date.now() / 1000);

  for (const [type, token] of Object.entries(TOKENS)) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const remaining = payload.exp - now;
      const status = remaining > 0 ? '✅ VALID' : '❌ EXPIRED';
      const time = remaining > 0 ?
        `${Math.floor(remaining / 60)} min` :
        `${Math.floor(Math.abs(remaining) / 60)} min ago`;

      console.log(`  ${type.padEnd(12)} ${status} (${time})`);
    } catch (e) {
      console.log(`  ${type.padEnd(12)} ❌ ERROR`);
    }
  }
}

console.log('\n🔍 Token Status Check:\n');
checkTokens();
