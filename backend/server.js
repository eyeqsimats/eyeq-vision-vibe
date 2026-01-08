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

// CORS Configuration - Production Safe
const defaultOrigins = [
  'https://extraordinary-gaufre-521d2b.netlify.app', // Netlify frontend
  'https://eyeq-backend-lodl.onrender.com',          // Render base (for server-to-server calls)
  'https://eyeq-simats.vercel.app',                  // Legacy frontend
  'http://localhost:3000',                           // Local development
  'http://localhost:5173',                           // Vite dev server
  'http://localhost:8080',                           // Vite alternative port
];

// Allow supplying additional origins (comma-separated) via env
const envOriginsRaw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';
const envOrigins = envOriginsRaw
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

console.log('🔒 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl requests, mobile apps, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// CRITICAL: CORS middleware MUST be first, before any routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'EyeQ Backend is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health Check Routes
app.use('/health', require('./routes/healthRoutes'));

// API Routes - Prefixed with /api
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contributions', require('./routes/contributionRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));

// Only export as Cloud Function for local Firebase Emulator testing
if (process.env.FIREBASE_EMULATOR_HOST) {
  exports.api = functions.https.onRequest(app);
}

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

// Always start HTTP server when this is the main module
// This allows both local development and Render production deployments
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || 'development';
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(err.status || 500).json({
        error: NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        status: err.status || 500
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📍 Backend Health: http://localhost:${PORT}`);
        console.log(`📍 API Base: http://localhost:${PORT}/api`);
        console.log(`Environment: ${NODE_ENV}`);
    });
}
