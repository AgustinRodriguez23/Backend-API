import mongoose from "mongoose";

import { USER_ROLES, DOCUMENT_TYPE } from "../utils/constants.js";

const documentSchema = new mongoose.Schema({
    original_name: { type: String, required: true },
    generated_name: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    document_type: { type: String, enum: Object.values(DOCUMENT_TYPE), required: true },
    uploaded_at: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: USER_ROLES.USER },
    documents: { type: [documentSchema], default: [] },
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel