import mongoose from "mongoose";

import { DELIVERY_STATUS } from "../utils/constants.js";

const receiptSchema = new mongoose.Schema({
    original_name: { type: String, required: true },
    generated_name: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploaded_at: { type: Date, default: Date.now },
})

const deliverySchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.ASSIGNED },
    address: { type: String, required: true },
    estimated_delivery: { type: Date },
    receipts: { type: [receiptSchema], default: [] },
}, { timestamps: true })

const DeliveryModel = mongoose.model('Delivery', deliverySchema)

export default DeliveryModel
