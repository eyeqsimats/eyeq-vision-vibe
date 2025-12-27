/**
 * Utility script to sync Firebase Authentication users to Supabase database
 * Run this once to populate the Supabase users table with existing Firebase users
 * 
 * Usage: node sync-firebase-users.js
 */

const { admin: firebaseAdmin } = require('./config/firebase');
const User = require('./models/User');

async function syncFirebaseUsers() {
    try {
        console.log('🔄 Starting Firebase → Supabase user sync...\n');

        // Check Firebase Admin initialization
        if (!firebaseAdmin || !firebaseAdmin.apps.length) {
            console.error('❌ Firebase Admin not initialized');
            console.error('Make sure firebase.json exists and is configured properly');
            process.exit(1);
        }

        // List all Firebase users
        console.log('📋 Fetching users from Firebase Authentication...');
        let allUsers = [];
        let nextPageToken;
        
        do {
            const listUsersResult = await firebaseAdmin.auth().listUsers(1000, nextPageToken);
            allUsers = allUsers.concat(listUsersResult.users);
            nextPageToken = listUsersResult.pageToken;
        } while (nextPageToken);

        console.log(`✅ Found ${allUsers.length} users in Firebase\n`);

        if (allUsers.length === 0) {
            console.log('ℹ️  No users to sync');
            return;
        }

        // Sync each user to Supabase
        let synced = 0;
        let skipped = 0;
        let errors = 0;

        for (const firebaseUser of allUsers) {
            const uid = firebaseUser.uid;
            const email = firebaseUser.email;
            const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            const photoURL = firebaseUser.photoURL || '';

            try {
                // Check if user already exists in Supabase
                const existingUser = await User.findById(uid);

                if (existingUser) {
                    console.log(`⏭️  Skipping ${email} (already in database)`);
                    skipped++;
                } else {
                    // Create new user in Supabase
                    const newUser = {
                        uid,
                        email: email || '',
                        name,
                        photourl: photoURL,
                        role: 'user', // Default role
                        bio: '',
                        skills: [],
                        sociallinks: {},
                        stats: {
                            projects: 0,
                            contributions: 0,
                            feedback: 0,
                            currentStreak: 0,
                            longestStreak: 0,
                            lastLoginDate: new Date().toISOString()
                        },
                        joineddate: firebaseUser.metadata.creationTime || new Date().toISOString(),
                        achievementcount: 0
                    };

                    await User.create(newUser);
                    console.log(`✅ Synced ${email}`);
                    synced++;
                }
            } catch (error) {
                console.error(`❌ Error syncing ${email}:`, error.message);
                errors++;
            }
        }

        console.log('\n📊 Sync Summary:');
        console.log(`   ✅ Synced: ${synced}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📋 Total: ${allUsers.length}`);

        if (synced > 0) {
            console.log('\n🎉 Users successfully synced to Supabase!');
            console.log('You can now see them in the Admin Dashboard → Users tab');
        }

    } catch (error) {
        console.error('❌ Fatal error during sync:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the sync
syncFirebaseUsers()
    .then(() => {
        console.log('\n✨ Sync completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Sync failed:', error);
        process.exit(1);
    });
