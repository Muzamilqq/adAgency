const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authValidation } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', authValidation.login, authController.login);
router.post('/register', authValidation.register, authController.register);

// Protected routes
router.get('/me', authenticateToken, authController.me);
router.post('/refresh', authenticateToken, authController.refresh);
router.post('/change-password', authenticateToken, authController.changePassword);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
