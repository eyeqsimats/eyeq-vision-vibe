// Quick test script to check if data exists in Supabase
const supabase = require('./backend/config/supabase');

async function testData() {
    try {
        console.log('Testing data in Supabase...\n');

        // Check users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(5);
        console.log('Users:', users?.length || 0, 'records');
        if (users?.length) {
            console.log('  Sample:', users[0].name, '(' + users[0].role + ')');
        }
        if (usersError) console.error('  Error:', usersError.message);

        // Check projects
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .limit(5);
        console.log('\nProjects:', projects?.length || 0, 'records');
        if (projects?.length) {
            console.log('  Sample:', projects[0].title, '(' + projects[0].status + ')');
        }
        if (projectsError) console.error('  Error:', projectsError.message);

        // Check feedback
        const { data: feedback, error: feedbackError } = await supabase
            .from('feedback')
            .select('*')
            .limit(5);
        console.log('\nFeedback:', feedback?.length || 0, 'records');
        if (feedback?.length) {
            console.log('  Sample:', feedback[0].message?.substring(0, 50), '(' + feedback[0].type + ')');
        }
        if (feedbackError) console.error('  Error:', feedbackError.message);

        console.log('\n✓ Test complete');
        process.exit(0);
    } catch (error) {
        console.error('Test error:', error);
        process.exit(1);
    }
}

testData();
