const JWTUtils = require('../../utils/jwtUtils');

/**
 * Middleware to check token expiration and suggest refresh
 * This runs after authentication to provide token status info
 */
const tokenStatusMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const tokenInfo = JWTUtils.getTokenExpiration(token);
      
      if (tokenInfo) {
        // Add token info to response headers
        res.set('X-Token-Expires-At', tokenInfo.expiresAt.toISOString());
        res.set('X-Token-Expires-In', tokenInfo.expiresInMinutes.toString());
        
        // If token expires in less than 5 minutes, suggest refresh
        if (tokenInfo.expiresInMinutes <= 5 && tokenInfo.expiresInMinutes > 0) {
          res.set('X-Token-Refresh-Suggested', 'true');
        }

        // Add token info to request for use in controllers
        req.tokenInfo = tokenInfo;
      }
    }

    next();
  } catch (error) {
    // Don't block request if token status check fails
    next();
  }
};

module.exports = {
  tokenStatusMiddleware
};
