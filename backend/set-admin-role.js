/**
 * Set Admin Role for a User
 * Usage: node set-admin-role.js <email>
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const email = process.argv[2];
if (!email) {
    console.error('❌ Please provide an email address');
    console.error('Usage: node set-admin-role.js <email>');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdminRole() {
    console.log(`🔄 Setting admin role for ${email}...\n`);

    try {
        // First find the user
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('uid, email, name, role')
            .eq('email', email)
            .single();

        if (findError || !user) {
            console.error('❌ User not found:', findError?.message);
            return;
        }

        console.log(`Found user: ${user.name || user.email}`);
        console.log(`Current role: ${user.role || 'not set'}\n`);

        // Update role
        const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('email', email);

        if (updateError) {
            console.error('❌ Error updating role:', updateError);
            return;
        }

        console.log(`✅ Role updated to 'admin'`);
        console.log(`\n🎉 ${email} is now an admin!\n`);

        // Verify the change
        const { data: updated } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .single();

        console.log(`Verified: role = ${updated.role}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setAdminRole();
