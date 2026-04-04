const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.get('/', authorize('admin'), userController.list);
router.get('/:id', authorize('admin'), userController.getById);
router.post('/', authorize('admin'), userController.create);
router.put('/:id', userController.update);
router.delete('/:id', authorize('admin'), userController.delete);

module.exports = router;