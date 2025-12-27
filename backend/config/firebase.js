const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to load service account JSON from env or file
let serviceAccount = null;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
        const candidate = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

        // Try a few locations: relative to this file, project cwd, and the raw candidate
        const tryPaths = [
            path.resolve(__dirname, candidate),
            path.resolve(process.cwd(), candidate),
            path.resolve(__dirname, path.basename(candidate)),
            path.resolve(process.cwd(), path.basename(candidate))
        ];

        let found = null;
        for (const p of tryPaths) {
            if (fs.existsSync(p)) { found = p; break; }
        }

        // As a last resort, try to find any JSON that looks like a firebase admin key in this folder
        if (!found) {
            const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.json') && f.toLowerCase().includes('firebase'));
            if (files.length) {
                found = path.resolve(__dirname, files[0]);
            }
        }

        if (found) {
            try {
                serviceAccount = require(found);
                console.log('Firebase service account loaded from', found);
            } catch (e) {
                console.warn('Failed to require service account at', found, e.message);
            }
        } else {
            console.warn('No Firebase service account file found at tried paths:', tryPaths);
        }
    }
} catch (err) {
    console.warn('Failed to parse Firebase service account JSON from env or file:', err.message);
}

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
    } else {
        console.warn('Firebase service account not configured. Firebase Admin not initialized.');
    }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { db, admin };
