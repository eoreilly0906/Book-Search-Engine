import mongoose from 'mongoose';

// Get MongoDB URI from environment variables or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

// Connect to MongoDB with error handling
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    // In production, we might want to exit the process on connection failure
    if (process.env.NODE_ENV === 'production') {
      console.error('Fatal: Could not connect to MongoDB in production environment.');
      process.exit(1);
    }
  });

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default mongoose.connection;
