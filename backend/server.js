const path = require('path');
const fs = require('fs');

// Load backend/.env if present, otherwise fall back to project root .env
const envPathLocal = path.resolve(__dirname, '.env');
const envPathRoot = path.resolve(__dirname, '..', '.env');
const envToLoad = fs.existsSync(envPathLocal) ? envPathLocal : envPathRoot;
require('dotenv').config({ path: envToLoad });
const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
// Initialize Firebase Admin via config file (reads service account JSON)
require('./config/firebase');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/contributions', require('./routes/contributionRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/announcements', require('./routes/announcementRoutes'));
app.use('/achievements', require('./routes/achievementRoutes'));

// Export as Cloud Function
exports.api = functions.https.onRequest(app);

// Debug endpoint to check Firebase Admin and Supabase connectivity
try {
    const supabase = require('./config/supabase');
    const { admin: firebaseAdmin } = require('./config/firebase');

    app.get('/debug', async (req, res) => {
        const fbInitialized = firebaseAdmin && firebaseAdmin.apps && firebaseAdmin.apps.length > 0;
        let supabaseOk = false;
        let supabaseMsg = null;
        try {
            if (supabase && supabase.from) {
                const { data, error } = await supabase.from('users').select('uid').limit(1);
                if (error) supabaseMsg = error.message || JSON.stringify(error);
                else supabaseOk = true;
            } else {
                supabaseMsg = 'Supabase client not available';
            }
        } catch (e) {
            supabaseMsg = e.message;
        }

        res.json({ firebaseAdmin: fbInitialized, supabaseOk, supabaseMsg, env: { SUPABASE_URL: !!process.env.SUPABASE_URL, SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY } });
    });
} catch (e) {
    console.warn('Failed to mount debug route', e && e.message ? e.message : e);
}

// Local Development Fallback
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    const localApp = express();
    localApp.use(cors());
    localApp.use(express.json());
    localApp.use('/api', app);

    localApp.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}
