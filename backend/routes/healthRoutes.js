const express = require('express');
const router = express.Router();

// Check Firebase Admin connectivity
const checkFirebase = () => {
  try {
    const { admin: firebaseAdmin } = require('../config/firebase');
    return firebaseAdmin && firebaseAdmin.apps && firebaseAdmin.apps.length > 0;
  } catch (e) {
    console.error('Firebase check error:', e.message);
    return false;
  }
};

// Check Supabase connectivity
const checkSupabase = async () => {
  try {
    const supabase = require('../config/supabase');
    if (!supabase || !supabase.from) {
      return { ok: false, message: 'Supabase client not available' };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('uid')
      .limit(1);
    
    if (error) {
      return { ok: false, message: error.message || JSON.stringify(error) };
    }
    
    return { ok: true, message: 'Connected' };
  } catch (e) {
    return { ok: false, message: e.message };
  }
};

// Main health check endpoint
router.get('/', async (req, res) => {
  const firebaseOk = checkFirebase();
  const supabaseCheck = await checkSupabase();

  const health = {
    status: firebaseOk && supabaseCheck.ok ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      firebase: {
        status: firebaseOk ? 'ok' : 'error',
        message: firebaseOk ? 'Firebase Admin initialized' : 'Firebase Admin not initialized'
      },
      supabase: {
        status: supabaseCheck.ok ? 'ok' : 'error',
        message: supabaseCheck.message
      },
      backend: {
        status: 'ok',
        message: 'Backend server running',
        version: process.env.npm_package_version || '1.0.0'
      }
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Lightweight endpoint for load balancers
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe
router.get('/ready', async (req, res) => {
  const firebaseOk = checkFirebase();
  const supabaseCheck = await checkSupabase();

  if (firebaseOk && supabaseCheck.ok) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ 
      ready: false,
      firebase: firebaseOk,
      supabase: supabaseCheck.ok
    });
  }
});

// Detailed status
router.get('/detailed', async (req, res) => {
  const firebaseOk = checkFirebase();
  const supabaseCheck = await checkSupabase();

  res.status(200).json({
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform
    },
    services: {
      firebase: firebaseOk,
      supabase: supabaseCheck.ok,
      supabaseMessage: supabaseCheck.message
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
