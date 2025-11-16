import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('âœ… MongoDB connected');
    } catch (err) {
        console.error('âŒ Database connection failed:', err.message);
    }
}
