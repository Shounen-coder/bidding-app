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

const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes  
  100, // 100 requests
  'Too many requests, please try again later'
);

module.exports = {
  authRateLimit,
  generalRateLimit
};
