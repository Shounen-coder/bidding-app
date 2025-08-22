const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user ? `${req.ip}-${req.user.userId}` : req.ip;
    }
  });
};

// Auth-specific rate limiter (keep strict)
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

// General API rate limiter (increased limits)
const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  500, // INCREASED from 100 to 500 requests
  'Too many requests, please try again later'
);

// Lenient rate limiter for status checks
const statusCheckRateLimit = createRateLimit(
  60 * 1000, // 1 minute window
  100, // 100 status checks per minute
  'Too many status checks, please slow down'
);

module.exports = {
  authRateLimit,
  generalRateLimit,
  statusCheckRateLimit // NEW
};
