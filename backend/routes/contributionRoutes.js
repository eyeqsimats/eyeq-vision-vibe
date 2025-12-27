const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add a contribution to a project
// @route   POST /api/contributions
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { projectId, text, description } = req.body;
        const contributionText = text || description; // Accept both field names
        
        if (!contributionText) {
            return res.status(400).json({ message: 'Contribution text is required' });
        }
        
        const newContribution = {
            projectid: projectId || null,
            text: contributionText,
            useruid: req.user.uid,
            user: {
                uid: req.user.uid,
                name: req.user.name || req.user.email,
                avatar: req.user.avatar || ''
            },
            createdat: new Date().toISOString()
        };
        const createdContribution = await Contribution.create(newContribution);
        
        // Update user streak when contribution is made
        await User.updateStreak(req.user.uid);
        
        res.status(201).json(createdContribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user's contributions
// @route   GET /api/contributions/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const contributions = await Contribution.getByUserUid(req.user.uid);
        res.json(contributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get contributions for a project
// @route   GET /api/contributions/:projectId
// @access  Public
router.get('/:projectId', async (req, res) => {
    try {
        const contributions = await Contribution.getByProjectId(req.params.projectId);
        res.json(contributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
