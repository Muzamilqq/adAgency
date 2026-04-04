const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Campaign validation rules
const campaignValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Campaign name is required')
      .isLength({ max: 255 })
      .withMessage('Campaign name must be less than 255 characters'),
    body('clientId')
      .optional()
      .isUUID()
      .withMessage('Invalid client ID format'),
    body('status')
      .optional()
      .isIn(['active', 'paused', 'completed', 'draft', 'scheduled'])
      .withMessage('Invalid status value'),
    body('budget')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Budget must be a positive number'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format')
      .custom((value, { req }) => {
        if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    handleValidationErrors,
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('Invalid campaign ID format'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Campaign name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Campaign name must be less than 255 characters'),
    body('status')
      .optional()
      .isIn(['active', 'paused', 'completed', 'draft', 'scheduled'])
      .withMessage('Invalid status value'),
    body('budget')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Budget must be a positive number'),
    handleValidationErrors,
  ],
  
  getById: [
    param('id')
      .isUUID()
      .withMessage('Invalid campaign ID format'),
    handleValidationErrors,
  ],
  
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['active', 'paused', 'completed', 'draft', 'scheduled'])
      .withMessage('Invalid status value'),
    query('sortBy')
      .optional()
      .isIn(['name', 'status', 'budget', 'spend', 'created_at', 'start_date', 'end_date', 'roas'])
      .withMessage('Invalid sort column'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
    handleValidationErrors,
  ],
};

// Auth validation rules
const authValidation = {
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors,
  ],
  
  register: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 })
      .withMessage('Name must be less than 255 characters'),
    handleValidationErrors,
  ],
};

// AI generation validation rules
const aiValidation = {
  generateCopy: [
    body('product')
      .trim()
      .notEmpty()
      .withMessage('Product description is required'),
    body('tone')
      .optional()
      .isIn(['professional', 'friendly', 'playful', 'luxury', 'bold'])
      .withMessage('Invalid tone value'),
    body('platform')
      .optional()
      .isIn(['meta', 'google', 'linkedin', 'tiktok', 'twitter'])
      .withMessage('Invalid platform value'),
    body('wordLimit')
      .optional()
      .isInt({ min: 10, max: 500 })
      .withMessage('Word limit must be between 10 and 500'),
    handleValidationErrors,
  ],
  
  generateSocial: [
    body('platform')
      .notEmpty()
      .withMessage('Platform is required')
      .isIn(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'])
      .withMessage('Invalid platform value'),
    body('campaignGoal')
      .notEmpty()
      .withMessage('Campaign goal is required'),
    body('brandVoice')
      .optional()
      .isString()
      .withMessage('Brand voice must be a string'),
    handleValidationErrors,
  ],
  
  generateHashtags: [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required'),
    body('industry')
      .optional()
      .isString()
      .withMessage('Industry must be a string'),
    handleValidationErrors,
  ],
};

module.exports = {
  handleValidationErrors,
  campaignValidation,
  authValidation,
  aiValidation,
};
