/**
 * Admin Dashboard Diagnostic Script
 * Run this to test API endpoints and see what data is being returned
 * Usage: node test-admin-endpoints.js
 */

require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:5000';

// Test Firebase token (you'll need to provide a real admin user token)
const TEST_TOKEN = process.env.TEST_ADMIN_TOKEN || 'your-firebase-admin-token';

async function testEndpoints() {
    console.log('🧪 Testing Admin API Endpoints\n');
    console.log(`📍 API Base URL: ${API_BASE}\n`);

    if (!TEST_TOKEN || TEST_TOKEN === 'your-firebase-admin-token') {
        console.log('⚠️  No TEST_ADMIN_TOKEN provided. You need a valid Firebase admin token.');
        console.log('To get one:');
        console.log('1. Go to your app (logged in as admin)');
        console.log('2. Open browser console');
        console.log('3. Paste: await getAuth().currentUser.getIdToken(true).then(t => console.log(t))');
        console.log('4. Copy the token and add to .env as TEST_ADMIN_TOKEN\n');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
    };

    // Test 1: Stats
    console.log('📊 Testing /admin/stats');
    console.log('─'.repeat(50));
    try {
        const statsRes = await axios.get(`${API_BASE}/admin/stats`, { headers });
        console.log('✅ Stats Response:');
        console.log(JSON.stringify(statsRes.data, null, 2));
    } catch (error) {
        console.error('❌ Stats Error:', error.response?.data || error.message);
    }
    console.log('\n');

    // Test 2: Users
    console.log('👥 Testing /admin/users');
    console.log('─'.repeat(50));
    try {
        const usersRes = await axios.get(`${API_BASE}/admin/users`, { headers });
        console.log(`✅ Users Response (${usersRes.data?.length || 0} users):`);
        console.log(JSON.stringify(usersRes.data?.slice(0, 2), null, 2));
        if (usersRes.data?.length > 2) console.log(`... and ${usersRes.data.length - 2} more users`);
    } catch (error) {
        console.error('❌ Users Error:', error.response?.data || error.message);
    }
    console.log('\n');

    // Test 3: Projects
    console.log('📁 Testing /admin/projects');
    console.log('─'.repeat(50));
    try {
        const projectsRes = await axios.get(`${API_BASE}/admin/projects`, { headers });
        console.log(`✅ Projects Response (${projectsRes.data?.length || 0} projects):`);
        console.log(JSON.stringify(projectsRes.data?.slice(0, 2), null, 2));
        if (projectsRes.data?.length > 2) console.log(`... and ${projectsRes.data.length - 2} more projects`);
    } catch (error) {
        console.error('❌ Projects Error:', error.response?.data || error.message);
    }
    console.log('\n');

    // Test 4: Feedback
    console.log('💬 Testing /admin/feedback');
    console.log('─'.repeat(50));
    try {
        const feedbackRes = await axios.get(`${API_BASE}/admin/feedback`, { headers });
        console.log(`✅ Feedback Response (${feedbackRes.data?.length || 0} items):`);
        console.log(JSON.stringify(feedbackRes.data?.slice(0, 2), null, 2));
        if (feedbackRes.data?.length > 2) console.log(`... and ${feedbackRes.data.length - 2} more items`);
    } catch (error) {
        console.error('❌ Feedback Error:', error.response?.data || error.message);
    }
    console.log('\n');

    console.log('✨ Diagnostic complete!');
}

testEndpoints().catch(console.error);
