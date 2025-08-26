require('dotenv').config();
const { app, initializeApp } = require('./app');

const PORT = process.env.PORT || 5000;
const AuctionEndService = require('./services/auctionEndService');
// Declare server variable at module scope
let server;

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      console.log('✅ Server closed successfully');
      console.log('👋 Goodbye!');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.log('⚠️  Forcing server shutdown');
      process.exit(1);
    }, 10000);
  } else {
    console.log('No server instance to close, exiting...');
    process.exit(0);
  }
};

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeApp();

    // Start HTTP server and assign to the module-scoped variable
    server = app.listen(PORT, () => {
      AuctionEndService.startScheduler();
      console.log('🚀 BIDDEX Backend Server Started');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`👤 User API: http://localhost:${PORT}/api/users`);
      console.log(`🔧 Admin API: http://localhost:${PORT}/api/admin`);
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
