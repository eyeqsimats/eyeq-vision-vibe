const { admin: firebaseAdmin } = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        if (!firebaseAdmin || !firebaseAdmin.apps.length) {
            console.error('Firebase Admin not initialized when verifying token');
            return res.status(500).json({ message: 'Auth service not configured' });
        }
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.uid);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'User is not an admin' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin status' });
    }
};

module.exports = { protect, admin };
