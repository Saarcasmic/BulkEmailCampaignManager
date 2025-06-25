const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/start', verificationController.startVerification);
router.get('/status', verificationController.checkVerificationStatus);

module.exports = router; 