const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder: import controllers later
// const campaignController = require('../controllers/campaignController');
// const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.json({ message: 'API Root' });
});

// Campaign routes (CRUD)
router.use('/campaigns', require('./campaignRoutes'));

// Auth routes
router.use('/auth', require('./authRoutes'));

// User management (admin only)
router.use('/users', auth, auth.isAdmin, require('./userRoutes'));

// Template management (all authenticated users)
router.use('/templates', auth, require('./templateRoutes'));

// SendGrid webhook
router.post('/sendgrid/webhook', require('../controllers/sendgridWebhookController'));

// Metrics endpoint
router.get('/metrics/:campaignId', require('../controllers/metricsController').getMetrics);

// Analytics endpoint
router.get('/analytics/:campaignId', require('../controllers/analyticsController').getAnalytics);

module.exports = router; 