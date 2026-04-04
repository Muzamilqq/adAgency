const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { aiValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// AI service health check (public)
router.get('/health', aiController.health);

// All other AI routes require authentication
router.use(authenticateToken);

// Generate ad copy
router.post('/generate/copy', aiValidation.generateCopy, aiController.generateCopy);

// Generate social media captions
router.post('/generate/social', aiValidation.generateSocial, aiController.generateSocial);

// Generate hashtags
router.post('/generate/hashtags', aiValidation.generateHashtags, aiController.generateHashtags);

// Generate complete campaign brief
router.post('/generate/brief', aiController.generateBrief);

module.exports = router;
