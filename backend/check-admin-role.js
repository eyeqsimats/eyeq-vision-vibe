/**
 * Check and Set Admin Role
 * This script verifies that synced users have admin role set
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndSetAdminRole() {
    console.log('🔍 Checking user roles in Supabase...\n');

    try {
        // Get all users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('uid, email, name, role');

        if (usersError) {
            console.error('❌ Error fetching users:', usersError);
            return;
        }

        console.log(`📊 Found ${users.length} users in database:\n`);
        
        users.forEach(user => {
            const roleStatus = user.role === 'admin' ? '✅' : '❌';
            console.log(`${roleStatus} ${user.email} (${user.name || 'no name'}) - Role: ${user.role || 'not set'}`);
        });

        console.log('\n' + '='.repeat(60));
        
        // Find users without admin role and ask to set them
        const nonAdminUsers = users.filter(u => u.role !== 'admin');
        
        if (nonAdminUsers.length > 0) {
            console.log(`\n⚠️  Found ${nonAdminUsers.length} non-admin user(s).\n`);
            console.log('To make a user admin, run this SQL in Supabase SQL Editor:\n');
            
            nonAdminUsers.forEach(user => {
                console.log(`UPDATE users SET role = 'admin' WHERE email = '${user.email}';`);
            });
            
            console.log('\nOr use the Node script:\n');
            console.log('node set-admin-role.js <email>');
        } else {
            console.log('✅ All users have admin role!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAndSetAdminRole();
