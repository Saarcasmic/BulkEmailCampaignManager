const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// GET /api/campaigns
router.get('/', campaignController.getAll);

// POST /api/campaigns
router.post('/', campaignController.create);

// GET /api/campaigns/:id
router.get('/:id', campaignController.getById);

// PUT /api/campaigns/:id
router.put('/:id', campaignController.update);

// DELETE /api/campaigns/:id
router.delete('/:id', campaignController.remove);

module.exports = router; 