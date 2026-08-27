import mongoose from 'mongoose';

try {
    // Connect
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('MONGO_URI missing, check your .env file');

    await mongoose.connect(MONGO_URI, {
        dbName: 'learning-mongoose'
    });
    console.log('MongoDB connected');
} catch (error) {
    // Log error and end Node process if it fails
    console.error('MongoDB connection error:', error);
    process.exit(1);
}