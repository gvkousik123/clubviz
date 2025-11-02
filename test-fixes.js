// Test script to verify API endpoints work
const axios = require('axios');

const BASE_URL = 'https://98.90.141.103/api';

async function testAPIs() {
    console.log('Testing API endpoints...\n');

    try {
        // Test clubs API
        console.log('1. Testing /clubs/public...');
        const clubsResponse = await axios.get(`${BASE_URL}/clubs/public`);
        console.log(`   Status: ${clubsResponse.status}`);
        console.log(`   Clubs count: ${clubsResponse.data?.content?.length || 0}\n`);

        // Test search categories API
        console.log('2. Testing /search/categories...');
        const categoriesResponse = await axios.get(`${BASE_URL}/search/categories`);
        console.log(`   Status: ${categoriesResponse.status}`);
        console.log(`   Categories: ${JSON.stringify(categoriesResponse.data, null, 2)}\n`);

        // Test events API
        console.log('3. Testing /events/public...');
        try {
            const eventsResponse = await axios.get(`${BASE_URL}/events/public`);
            console.log(`   Status: ${eventsResponse.status}`);
            console.log(`   Events count: ${eventsResponse.data?.content?.length || 0}\n`);
        } catch (eventError) {
            console.log(`   Error: ${eventError.response?.status} - ${eventError.message}\n`);
        }

        console.log('API tests completed!');

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAPIs();