/**
 * Test script to verify project approval updates user stats correctly
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Replace with your actual admin token
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

// Replace with actual project ID to test
const TEST_PROJECT_ID = 'YOUR_PROJECT_ID_HERE';

async function testApproval() {
    try {
        console.log('🧪 Testing Project Approval Fix...\n');

        // 1. Get project before approval
        console.log('1️⃣ Fetching project details before approval...');
        const projectBefore = await axios.get(`${API_URL}/admin/projects`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        
        const targetProject = projectBefore.data.find(p => p.id === TEST_PROJECT_ID);
        if (!targetProject) {
            console.error('❌ Project not found!');
            return;
        }
        
        console.log(`   Project: ${targetProject.title}`);
        console.log(`   Status: ${targetProject.status}`);
        console.log(`   Author: ${targetProject.authorName} (${targetProject.authorUid})\n`);

        // 2. Get user stats before approval
        console.log('2️⃣ Fetching user stats before approval...');
        const userBefore = await axios.get(`${API_URL}/users/profile/${targetProject.authorUid}`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        
        console.log(`   Approved Projects: ${userBefore.data.stats?.approvedProjects || 0}`);
        console.log(`   Pending Projects: ${userBefore.data.stats?.pendingProjects || 0}`);
        console.log(`   Total Projects: ${userBefore.data.stats?.totalProjects || 0}\n`);

        // 3. Approve the project
        console.log('3️⃣ Approving project...');
        await axios.put(`${API_URL}/admin/projects/${TEST_PROJECT_ID}/approve`, 
            { status: 'approved', comment: 'Test approval' },
            { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
        );
        console.log('   ✓ Project approved!\n');

        // Wait a moment for updates to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Verify project status updated
        console.log('4️⃣ Verifying project status...');
        const projectAfter = await axios.get(`${API_URL}/admin/projects`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        
        const updatedProject = projectAfter.data.find(p => p.id === TEST_PROJECT_ID);
        console.log(`   Status: ${updatedProject.status}`);
        
        if (updatedProject.status === 'approved') {
            console.log('   ✅ Project status updated correctly!\n');
        } else {
            console.log('   ❌ Project status NOT updated!\n');
        }

        // 5. Verify user stats updated
        console.log('5️⃣ Verifying user stats updated...');
        const userAfter = await axios.get(`${API_URL}/users/profile/${targetProject.authorUid}`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        
        console.log(`   Approved Projects: ${userAfter.data.stats?.approvedProjects || 0}`);
        console.log(`   Pending Projects: ${userAfter.data.stats?.pendingProjects || 0}`);
        console.log(`   Total Projects: ${userAfter.data.stats?.totalProjects || 0}\n`);

        // Compare stats
        const approvedBefore = userBefore.data.stats?.approvedProjects || 0;
        const approvedAfter = userAfter.data.stats?.approvedProjects || 0;
        
        if (approvedAfter > approvedBefore) {
            console.log('✅ SUCCESS! User stats updated correctly!');
            console.log(`   Approved projects increased from ${approvedBefore} to ${approvedAfter}`);
        } else {
            console.log('❌ FAILED! User stats NOT updated!');
            console.log(`   Approved projects: ${approvedBefore} → ${approvedAfter}`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

console.log('====================================');
console.log('  PROJECT APPROVAL FIX TESTER');
console.log('====================================\n');
console.log('📝 Instructions:');
console.log('1. Replace ADMIN_TOKEN with your actual admin token');
console.log('2. Replace TEST_PROJECT_ID with a real project ID');
console.log('3. Run: node test-approval-fix.js\n');

if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE' || TEST_PROJECT_ID === 'YOUR_PROJECT_ID_HERE') {
    console.log('⚠️  Please update the token and project ID before running!');
} else {
    testApproval();
}
