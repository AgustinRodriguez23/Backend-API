import mongoose from "mongoose";

import { DELIVERY_STATUS } from "../utils/constants.js";

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: Object.values(DELIVERY_STATUS),
        default: DELIVERY_STATUS.ASSIGNED
    },
    address: { type: String, required: true },
    estimated_delivery: { type: Date },
}, {
    timestamps: true
})

const DeliveryModel = mongoose.model('Delivery', deliverySchema)

export default DeliveryModel
