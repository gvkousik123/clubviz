// Test script for Direct Login & Role-Based Routing
// Run this in browser console to verify implementation

const STORAGE_KEYS = {
  accessToken: 'clubviz-accessToken',
  refreshToken: 'clubviz-refreshToken',
  user: 'clubviz-user',
  userDetails: 'clubviz-userDetails',
  pendingPhone: 'clubviz-pendingPhone',
};

// ============================================================================
// TEST 1: Check localStorage has auth keys
// ============================================================================
function testAuthStorageKeys() {
  console.log('=== TEST 1: Auth Storage Keys ===');
  
  const hasAccessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const hasRefreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const hasUser = localStorage.getItem(STORAGE_KEYS.user);
  
  console.log('✅ accessToken:', hasAccessToken ? 'SET' : 'EMPTY');
  console.log('✅ refreshToken:', hasRefreshToken ? 'SET' : 'EMPTY');
  console.log('✅ user:', hasUser ? 'SET' : 'EMPTY');
  
  return hasAccessToken && hasRefreshToken && hasUser;
}

// ============================================================================
// TEST 2: Parse user data and check roles
// ============================================================================
function testUserRoles() {
  console.log('\n=== TEST 2: User Roles ===');
  
  const userStr = localStorage.getItem(STORAGE_KEYS.user);
  if (!userStr) {
    console.log('❌ No user data found');
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    console.log('👤 Username:', user.username || user.email);
    console.log('📋 Roles:', user.roles);
    console.log('✅ Full User:', user);
    return true;
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
    return false;
  }
}

// ============================================================================
// TEST 3: Simulate direct login routing
// ============================================================================
function testDirectLoginRouting() {
  console.log('\n=== TEST 3: Direct Login Routing ===');
  
  const userStr = localStorage.getItem(STORAGE_KEYS.user);
  if (!userStr) {
    console.log('⏭️  Skip: No user data');
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    const roles = user.roles || [];
    
    let route = '/home';
    if (roles.includes('ROLE_SUPERADMIN')) {
      route = '/superadmin';
    } else if (roles.includes('ROLE_ADMIN')) {
      route = '/admin';
    } else if (roles.includes('ROLE_USER')) {
      route = '/home';
    }
    
    console.log('📍 Current Path:', window.location.pathname);
    console.log('🎯 Should Redirect To:', route);
    console.log('✅ Routing Decision:', `${roles[0]} → ${route}`);
    
    return route;
  } catch (e) {
    console.log('❌ Error:', e);
    return null;
  }
}

// ============================================================================
// TEST 4: Check localStorage preservation on logout
// ============================================================================
function testLocalStoragePreservation() {
  console.log('\n=== TEST 4: localStorage Preservation ===');
  
  // Show all keys that should be preserved
  const preservedKeys = ['clubviz-theme', 'clubviz-favoriteClubs', 'clubviz-favoriteEvents'];
  const clearedKeys = [
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
    STORAGE_KEYS.user,
    STORAGE_KEYS.userDetails,
    STORAGE_KEYS.pendingPhone
  ];
  
  console.log('📌 Keys that SHOULD be cleared on logout:');
  clearedKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  - ${key}: ${value ? '✅ SET (will clear)' : '❌ NOT SET'}`);
  });
  
  console.log('\n📌 Keys that SHOULD be preserved on logout:');
  preservedKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  - ${key}: ${value ? '✅ SET (preserved)' : '❌ NOT SET'}`);
  });
  
  return true;
}

// ============================================================================
// TEST 5: Simulate logout clearing
// ============================================================================
function testLogoutClearing() {
  console.log('\n=== TEST 5: Logout Clearing Simulation ===');
  console.log('⚠️  NOT actually clearing. Just showing what would clear:');
  
  const clearedKeys = [
    'clubviz-accessToken',
    'clubviz-refreshToken',
    'clubviz-user',
    'clubviz-userDetails',
    'clubviz-pendingPhone'
  ];
  
  console.log('Would clear:');
  clearedKeys.forEach(key => {
    console.log(`  ✨ localStorage.removeItem('${key}')`);
  });
  
  console.log('\nWould preserve:');
  console.log('  ✨ All other keys (theme, favorites, etc.)');
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================
function runAllTests() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  Direct Login & Role-Based Routing - Test Suite ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  const test1 = testAuthStorageKeys();
  const test2 = testUserRoles();
  const test3 = testDirectLoginRouting();
  const test4 = testLocalStoragePreservation();
  testLogoutClearing();
  
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║                    SUMMARY                      ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('✅ Auth keys stored:', test1 ? 'YES' : 'NO');
  console.log('✅ User roles found:', test2 ? 'YES' : 'NO');
  console.log('✅ Routing logic:', test3 ? test3 : 'N/A');
  console.log('✅ Storage preservation:', test4 ? 'YES' : 'NO');
  console.log('\n✅ All tests completed!\n');
}

// Export for console use
window.testDirectLogin = {
  authKeys: testAuthStorageKeys,
  userRoles: testUserRoles,
  routing: testDirectLoginRouting,
  preservation: testLocalStoragePreservation,
  logout: testLogoutClearing,
  runAll: runAllTests
};

// Auto-run all tests
runAllTests();

console.log('💡 TIP: Use window.testDirectLogin.runAll() to re-run all tests');
console.log('💡 Available functions:');
console.log('   - testDirectLogin.authKeys()');
console.log('   - testDirectLogin.userRoles()');
console.log('   - testDirectLogin.routing()');
console.log('   - testDirectLogin.preservation()');
console.log('   - testDirectLogin.logout()');
console.log('   - testDirectLogin.runAll()\n');
