
const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const User = require('../models/User'); // For admin check if needed, though middleware handles explicit admin role check usually.
const { protect } = require('../middleware/authMiddleware');

// @desc    Get my achievements
// @route   GET /api/achievements/my
router.get('/my', protect, async (req, res) => {
    try {
        const achievements = await Achievement.getByUser(req.user.uid);
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Award achievement to user
// @route   POST /api/achievements
// @access  Admin only (User role check in controller previously, but really should be in middleware)
router.post('/', protect, async (req, res) => {
    // The previous code manually checked:
    // const adminDoc = await db.collection('users').doc(req.user.uid).get();
    // if (!adminDoc.exists || adminDoc.data().role !== 'admin') ...

    // AuthMiddleware 'protect' populates req.user from Firebase Auth token.
    // If the token has the role, or if we trust req.user property...
    // But typically we should use the 'admin' middleware.

    // However, sticking to the existing logic which re-fetches user to be safe:
    try {
        const user = await User.findById(req.user.uid);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { targetUserId, title, type, description, icon } = req.body;

        const newAchievement = {
            userUid: targetUserId,
            title,
            type, // 'badge', 'certificate', 'winner'
            description,
            icon, // 'trophy', 'star', 'medal', 'ribbon'
            awardedAt: new Date().toISOString(),
            awardedBy: req.user.uid
        };

        const createdAchievement = await Achievement.create(newAchievement);
        res.status(201).json(createdAchievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
