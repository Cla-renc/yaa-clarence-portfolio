const mongoose = require("mongoose");
let mongodInstance = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      // Use in-memory MongoDB for local development / CI if no URI provided
      console.warn('MONGODB_URI not set — attempting in-memory MongoDB fallback');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        uri = mongodInstance.getUri();
      } catch (err) {
        console.warn('mongodb-memory-server not available; skipping DB connect. Some features will be disabled.');
        return;
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Do not exit — allow server to start for smoke-testing where DB is optional
  }
};

// For graceful shutdown in dev
const stopInMemoryMongo = async () => {
  if (mongodInstance) {
    try { await mongodInstance.stop(); } catch (err) { /* ignore */ }
  }
};

process.on('SIGINT', async () => { await stopInMemoryMongo(); process.exit(0); });
process.on('SIGTERM', async () => { await stopInMemoryMongo(); process.exit(0); });

module.exports = connectDB;
