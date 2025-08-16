const { app, initializeApp } = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forcing server shutdown');
    process.exit(1);
  }, 10000);
};

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeApp();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log('🚀 BIDDEX Backend Server Started');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`👤 User API: http://localhost:${PORT}/api/user`);
      console.log('===============================================');
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
