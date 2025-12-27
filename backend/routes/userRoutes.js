const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Sync user data (create/update) and update streak
// @route   POST /api/users/sync
// @access  Public (should be protected in production)
router.post('/sync', async (req, res) => {
    try {
        const { email, name, uid } = req.body;

        if (!uid) {
            return res.status(400).json({ message: "UID is required" });
        }

        let user = await User.findById(uid);

        if (!user) {
            const newUser = {
                uid,
                email,
                name: name || 'User',
                role: 'user',
                bio: '',
                joineddate: new Date().toISOString(),
                stats: { 
                    projects: 0, 
                    contributions: 0, 
                    feedback: 0,
                    currentStreak: 1,
                    longestStreak: 1,
                    currentStreakStartDate: new Date().toISOString().split('T')[0],
                    longestStreakStartDate: new Date().toISOString().split('T')[0],
                    longestStreakEndDate: new Date().toISOString().split('T')[0],
                    lastLoginDate: new Date().toISOString()
                }
            };
            user = await User.create(newUser);
        } else {
            // Update streak on login
            user = await User.updateStreak(uid);
        }

        res.json(user);
    } catch (error) {
        console.error('Sync error:', error && error.stack ? error.stack : error);
        const msg = error && error.message ? error.message : 'Something went wrong during sync';
        res.status(500).json({ message: msg });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Compatibility route: GET /profile/:id -> returns same as GET /:id
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log('Profile fetched for user:', req.params.id, 'with data:', JSON.stringify(user, null, 2));
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile fetch error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Something went wrong' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const uid = req.user.uid;
        const updates = req.body;

        console.log('Profile update request for user:', uid);
        console.log('Updates received:', JSON.stringify(updates, null, 2));

        // Prevent changing critical fields
        delete updates.email;
        delete updates.role;

        // Convert camelCase field names to lowercase for Supabase
        const dbUpdates = {
            name: updates.name,
            bio: updates.bio,
            skills: updates.skills,
            sociallinks: updates.socialLinks,
            photourl: updates.photoURL,
            registernumber: updates.registerNumber,
            mobilenumber: updates.mobileNumber
        };

        // Remove undefined fields
        Object.keys(dbUpdates).forEach(key => {
            if (dbUpdates[key] === undefined) {
                delete dbUpdates[key];
            }
        });

        console.log('Database updates:', JSON.stringify(dbUpdates, null, 2));
        await User.update(uid, dbUpdates);

        const updatedUser = await User.findById(uid);
        console.log('Profile updated successfully');
        res.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
