const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', auth, auth.isAdmin, authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router; 