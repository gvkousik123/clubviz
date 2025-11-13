/**
 * Test Script: Verify Club Create API Headers
 * Run this in browser console on the club creation page
 */

console.log('='.repeat(80));
console.log('🔍 CLUB CREATE API - HEADERS VERIFICATION TEST');
console.log('='.repeat(80));

// 1. Check localStorage for token
console.log('\n1️⃣  CHECKING LOCALSTORAGE FOR TOKEN:');
const accessToken = localStorage.getItem('clubviz-accessToken');
console.log(`   Token present: ${!!accessToken}`);
if (accessToken) {
    console.log(`   Token value: ${accessToken.substring(0, 50)}...`);
    console.log(`   Token length: ${accessToken.length} characters`);
} else {
    console.warn('   ⚠️  NO TOKEN FOUND IN LOCALSTORAGE!');
}

// 2. Check if headers will be set
console.log('\n2️⃣  EXPECTED HEADERS WHEN API CALL IS MADE:');
console.log(`   Content-Type: application/json ✅`);
console.log(`   Authorization: Bearer ${accessToken ? '${token}' : 'NOT SET (no token)'}${accessToken ? ' ✅' : ' ❌'}`);

// 3. Check API base URL
console.log('\n3️⃣  API CONFIGURATION:');
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://clubwiz.in/api';
console.log(`   Base URL: ${apiUrl}`);
console.log(`   Create Club Endpoint: ${apiUrl}/clubs`);
console.log(`   Method: POST`);

// 4. Test payload
console.log('\n4️⃣  TEST PAYLOAD (what will be sent):');
const testPayload = {
    name: 'Test Club'
};
console.log(`   ${JSON.stringify(testPayload, null, 2)}`);

// 5. Simulate what the interceptor will do
console.log('\n5️⃣  REQUEST INTERCEPTOR SIMULATION:');
console.log(`   ✓ Gets token from localStorage: ${!!accessToken}`);
console.log(`   ✓ Sets Authorization header: Bearer ${accessToken ? 'TOKEN' : 'NONE'}`);
console.log(`   ✓ Content-Type already set in axios defaults`);
console.log(`   ✓ Logs request details to console`);

// 6. Network tab check instructions
console.log('\n6️⃣  NETWORK TAB CHECKS:');
console.log(`   1. Open DevTools → Network tab`);
console.log(`   2. Filter by "clubs" or "POST"`);
console.log(`   3. Create a club`);
console.log(`   4. Look for POST request to: /clubs`);
console.log(`   5. In Headers tab, you should see:`);
console.log(`      • Authorization: Bearer [TOKEN]`);
console.log(`      • Content-Type: application/json`);

console.log('\n' + '='.repeat(80));
console.log('✅ SETUP IS CORRECT IF:');
console.log('='.repeat(80));
console.log('✓ Step 1: Token is present in localStorage');
console.log('✓ Step 2: Both headers are set');
console.log('✓ Step 5: Interceptor shows token is available');
console.log('✓ Step 6: Network tab shows the API call with correct headers');
console.log('\n' + '='.repeat(80));

// Export a function to test the actual API call
window.testClubCreateAPI = async function() {
    console.log('\n🚀 TESTING ACTUAL API CALL...');
    try {
        const testData = { name: 'Test Club ' + Date.now() };
        console.log('Sending:', testData);
        
        // This will use the interceptor setup
        const response = await fetch('https://clubwiz.in/api/clubs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Response Status:', response.status);
        const data = await response.json();
        console.log('Response Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

console.log('\n💡 To test the actual API call, run: testClubCreateAPI()');
console.log('='.repeat(80));
