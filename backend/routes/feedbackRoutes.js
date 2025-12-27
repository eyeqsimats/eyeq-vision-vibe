const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, message, rating } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Feedback message is required' });
        }

        // Get user details from database to ensure we have name and email
        const user = await User.findById(req.user.uid);
        
        const newFeedback = {
            useruid: req.user.uid,
            username: user?.name || req.user.name || 'Unknown User',
            useremail: user?.email || req.user.email || '',
            type: type || 'general',
            message,
            rating: rating || 5,
            status: 'pending',
            resolved: false,
            createdat: new Date().toISOString()
        };
        
        console.log('Creating feedback for user:', req.user.uid, newFeedback);
        const createdFeedback = await Feedback.create(newFeedback);
        console.log('Feedback created successfully:', createdFeedback.id);
        
        res.status(201).json(createdFeedback);
    } catch (error) {
        console.error('Feedback creation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user's feedback
// @route   GET /api/feedback/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        console.log('Fetching feedback for user:', req.user.uid);
        const feedbacks = await Feedback.getByUserUid(req.user.uid);
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Provide admin feedback on a project
// @route   POST /api/feedback/admin
// @access  Admin
router.post('/admin', protect, admin, async (req, res) => {
    try {
        const { projectId, text, newStatus } = req.body;

        // In a real app, you would have more complex logic to update project status
        // and notify the user. Here we just add the feedback.
        const adminFeedback = {
            projectId,
            text,
            type: 'adminFeedback',
            user: {
                uid: req.user.uid,
                name: `Admin: ${req.user.name}`,
                avatar: req.user.avatar || ''
            },
            newStatus, // e.g., 'approved', 'rejected'
            createdAt: new Date().toISOString()
        };
        const createdFeedback = await Feedback.create(adminFeedback);
        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reply to feedback/query
// @route   PUT /api/feedback/:id/reply
// @access  Admin
router.put('/:id/reply', protect, admin, async (req, res) => {
    try {
        const { reply } = req.body;
        const feedbackId = req.params.id;

        if (!reply) {
            return res.status(400).json({ message: 'Reply text is required' });
        }

        const updatedFeedback = await Feedback.update(feedbackId, {
            reply,
            resolved: true,
            status: 'approved',
            repliedat: new Date().toISOString()
        });

        console.log(`[ADMIN] Replied to feedback ${feedbackId}`);
        res.json(updatedFeedback);
    } catch (error) {
        console.error('[ADMIN] Error replying to feedback:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve or reject feedback
// @route   PUT /api/feedback/:id/status
// @access  Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const feedbackId = req.params.id;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending' });
        }

        const updatedFeedback = await Feedback.update(feedbackId, {
            status,
            resolved: status !== 'pending'
        });

        console.log(`[ADMIN] Updated feedback ${feedbackId} status to ${status}`);
        res.json(updatedFeedback);
    } catch (error) {
        console.error('[ADMIN] Error updating feedback status:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle feedback resolved status
// @route   PUT /api/feedback/:id/resolve
// @access  Admin
router.put('/:id/resolve', protect, admin, async (req, res) => {
    try {
        const { resolved } = req.body;
        const feedbackId = req.params.id;

        const updatedFeedback = await Feedback.update(feedbackId, {
            resolved: resolved === true || resolved === false ? resolved : true
        });

        console.log(`[ADMIN] Updated feedback ${feedbackId} resolved status to ${resolved}`);
        res.json(updatedFeedback);
    } catch (error) {
        console.error('[ADMIN] Error updating feedback resolved status:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
