
const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const User = require('../models/User'); // Using User model for role check
const { protect } = require('../middleware/authMiddleware');

// @desc    Get latest announcement
// @route   GET /api/announcements/latest
// @access  Public (or Protected)
router.get('/latest', protect, async (req, res) => {
    try {
        const announcement = await Announcement.getLatest();

        if (!announcement) {
            return res.json({ message: null });
        }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin only
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { message } = req.body;

        const newAnnouncement = {
            message,
            authorUid: req.user.uid,
            createdAt: new Date().toISOString()
        };

        const createdAnnouncement = await Announcement.create(newAnnouncement);
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
