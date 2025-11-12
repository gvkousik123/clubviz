/**
 * Token Verification & Analysis Script
 * Decodes JWT token and checks expiration
 */

const jwtDecode = require('jwt-decode').jwtDecode || require('jwt-decode').default;

// Your token
const TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb3VzaWsiLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsiUk9MRV9TVVBFUkFETUlOIl0sImlhdCI6MTc2Mjg2NzIzMCwiZXhwIjoxNzYyOTUzNjMwfQ.wO22wniVuVTvdMpKmgi_BJPTkSnEv3jOxjZoWY7FoyJNROSkpZsq1SqsXOFqqRd64f1q4xPqjTj_4SXx3cF10Q';

try {
    const decoded = jwtDecode(TOKEN);

    console.log('🔍 TOKEN ANALYSIS');
    console.log('='.repeat(50));
    console.log('');

    console.log('📋 Token Payload:');
    console.log(JSON.stringify(decoded, null, 2));
    console.log('');

    console.log('⏰ Timestamp Analysis:');
    const issuedAt = new Date(decoded.iat * 1000);
    const expiresAt = new Date(decoded.exp * 1000);
    const now = new Date();

    console.log(`  Issued At: ${issuedAt.toISOString()}`);
    console.log(`  Expires At: ${expiresAt.toISOString()}`);
    console.log(`  Current Time: ${now.toISOString()}`);
    console.log('');

    if (expiresAt < now) {
        const diffMs = now.getTime() - expiresAt.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        console.log(`❌ TOKEN EXPIRED ${diffHours}h ${diffMins}m AGO`);
    } else {
        const diffMs = expiresAt.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        console.log(`✅ TOKEN VALID for ${diffHours}h ${diffMins}m`);
    }
    console.log('');

    console.log('🔐 Token Details:');
    console.log(`  Username: ${decoded.sub}`);
    console.log(`  Type: ${decoded.type}`);
    console.log(`  Roles: ${decoded.roles.join(', ')}`);
    console.log('');

    console.log('='.repeat(50));
    console.log('💡 SOLUTION');
    console.log('='.repeat(50));
    console.log('');

    if (expiresAt < now) {
        console.log('⚠️  Your token is EXPIRED!');
        console.log('');
        console.log('To get a fresh token, login again:');
        console.log('');
        console.log('curl -X POST https://clubwiz.in/api/auth/login \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d "{\\"username\\":\\"kousik\\",\\"password\\":\\"your_password\\"}"');
        console.log('');
    }

} catch (error) {
    console.error('❌ Error decoding token:', error.message);
    console.log('Make sure you have jwt-decode installed: npm install jwt-decode');
}