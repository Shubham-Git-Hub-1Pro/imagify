// server/config/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  // support both possible env keys
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error('ERROR: No Mongo connection string found. Please set MONGO_URI in .env');
    process.exit(1);
  }

  // debug - print first part (never print full URI with password in logs in prod)
  console.log('Using Mongo URI (first 80 chars):', MONGO_URI.substring(0, 80));

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // fail fast if cannot connect
      // tls: true, // optional
      // tlsAllowInvalidCertificates: true // only for debugging (NOT for prod)
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected Successfully ✅');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB Disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
