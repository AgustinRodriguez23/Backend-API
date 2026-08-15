import mongoose from "mongoose";

import { config } from "./env.config.js";

export async function connectDB() {
    try {
        await mongoose.connect(config.MONGODB_URI)
        console.log(`MongoDB connected`)
    } catch (error) {
        console.warn('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}

