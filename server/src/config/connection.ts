import mongoose from 'mongoose';

// Always use the environment variable in production
const mongoURI = process.env.NODE_ENV === 'production' 
  ? (process.env.MONGODB_URI || 'mongodb+srv://edwardoreilly0906:Bigmode0906!@cluster0.bi5ethe.mongodb.net/googlebooks?retryWrites=true&w=majority&authSource=admin&appName=Cluster0')
  : (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

console.log(`Connecting to MongoDB: ${mongoURI ? 'URI provided' : 'No URI provided'}`);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', mongoURI);
    process.exit(1);
  });

export default mongoose.connection;