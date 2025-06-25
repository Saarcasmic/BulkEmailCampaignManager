const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subscriptionCheck = require('../middleware/subscription');

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

// Verification routes
router.use('/verification', auth, subscriptionCheck, require('./verificationRoutes'));

// Subscription routes
router.use('/subscription', auth, subscriptionCheck, require('./subscriptionRoutes'));

// Payment routes
router.use('/payment', auth, subscriptionCheck, require('./paymentRoutes'));

// User management (admin only)
router.use('/users', auth, subscriptionCheck, auth.isAdmin, require('./userRoutes'));

// Template management (all authenticated users)
router.use('/templates', auth, subscriptionCheck, require('./templateRoutes'));

// SendGrid webhook
router.post('/sendgrid/webhook', require('../controllers/sendgridWebhookController'));

// Metrics endpoint
router.get('/metrics/:campaignId', require('../controllers/metricsController').getMetrics);

// Analytics endpoint
router.get('/analytics/:campaignId', require('../controllers/analyticsController').getAnalytics);

module.exports = router; 