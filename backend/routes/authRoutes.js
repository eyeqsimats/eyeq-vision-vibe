const express = require('express');
const router = express.Router();
const { admin: firebaseAdmin } = require('../config/firebase');
const User = require('../models/User');

// @desc    Create user in db after client-side registration/login
// @route   POST /api/auth
// @access  Public (expects Firebase ID token)
router.post('/', async (req, res) => {
    let idToken = req.body && req.body.idToken;
    if (!idToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }

    console.log('Auth route called; token present:', !!idToken);

    if (!idToken) {
        console.error('No ID token provided to auth route');
        return res.status(400).json({ message: 'No ID token provided' });
    }

    try {
        if (!firebaseAdmin || !firebaseAdmin.apps.length) {
            console.error('Firebase Admin not initialized in auth route');
            return res.status(500).json({ message: 'Auth service not configured' });
        }
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        console.log('Decoded token:', { uid: decodedToken.uid, email: decodedToken.email });
        const { uid, email, name } = decodedToken;

        let user = await User.findById(uid);
        console.log('User.findById result:', !!user);

        if (!user) {
            const newUser = {
                uid,
                email,
                name: name || 'User',
                role: 'user',
                bio: '',
                skills: [],
                socialLinks: {},
                stats: {
                    projects: 0,
                    contributions: 0,
                    feedback: 0
                },
                joinedDate: new Date().toISOString()
            };
            const created = await User.create(newUser);
            console.log('User.create result:', created ? true : false);
            user = created;
        } else {
            // Optionally update basic profile fields if missing
            const updates = {};
            if (!user.email && email) updates.email = email;
            if (!user.name && name) updates.name = name;
            if (Object.keys(updates).length) {
                try { await User.update(uid, updates); } catch (e) { console.warn('Failed updating user basic fields', e.message); }
            }
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error verifying token or creating user:', error && error.stack ? error.stack : error);
        const msg = error && error.message ? error.message : 'Something went wrong';
        // If token verification failed, return 401; otherwise 500
        if (msg.toLowerCase().includes('id token')) return res.status(401).json({ message: msg });
        return res.status(500).json({ message: msg });
    }
});

module.exports = router;
