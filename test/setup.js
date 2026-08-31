import { connectDB } from "../src/config/db.js"
import mongoose from "mongoose"

before(async function () {
    await connectDB()
})

after(async function () {
    const collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({})
    }
    await mongoose.connection.close()
})