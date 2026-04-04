const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { campaignValidation } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// All campaign routes require authentication
router.use(authenticateToken);

// List campaigns with filters and pagination
router.get('/', campaignValidation.list, campaignController.list);

// Get campaign statistics
router.get('/stats', campaignController.getStats);

// Create new campaign (admin and manager only)
router.post(
  '/',
  authorize('admin', 'manager'),
  campaignValidation.create,
  campaignController.create
);

// Get single campaign
router.get('/:id', campaignValidation.getById, campaignController.getById);

// Update campaign (admin and manager only)
router.put(
  '/:id',
  authorize('admin', 'manager'),
  campaignValidation.update,
  campaignController.update
);

// Soft delete campaign (admin only)
router.delete('/:id', authorize('admin'), campaignController.delete);

// Restore soft-deleted campaign (admin only)
router.post('/:id/restore', authorize('admin'), campaignController.restore);

// Add performance data
router.post('/:id/performance', campaignController.addPerformance);

// Get performance data
router.get('/:id/performance', campaignController.getPerformance);

module.exports = router;
