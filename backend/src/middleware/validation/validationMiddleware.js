const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be less than 30 characters long',
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
      }),
    
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Password confirmation does not match password'
      }),
    
    firstName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'First name can only contain letters and spaces'
      }),
    
    lastName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Last name can only contain letters and spaces'
      }),
    
    phone: Joi.string()
      .pattern(/^\+?[\d\s\-()]+$/)
      .min(10)
      .max(20)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    
    password: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.min': 'Password is required'
      })
  }),

  updateProfile: Joi.object({
    firstName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.pattern.base': 'First name can only contain letters and spaces'
      }),
    
    lastName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        'string.pattern.base': 'Last name can only contain letters and spaces'
      }),
    
    phone: Joi.string()
      .pattern(/^\+?[\d\s\-()]+$/)
      .min(10)
      .max(20)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.min': 'Current password is required'
      }),
    
    newPassword: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Password confirmation does not match new password'
      })
  })
};

// Generic validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Custom validation for specific cases
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required'
    });
  }
  
  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Valid ID is required'
    });
  }
  
  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validate,
  validateEmail,
  validateId,
  schemas
};
