import mongoose from "mongoose";

import { ORDER_STATUS, ORDER_PRIORITY } from "../utils/constants.js";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => Array.isArray(items) && items.length > 0,
            message: 'An order must contain at least one product'
        }
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.CREATED
    },
    priority: {
        type: String,
        enum: Object.values(ORDER_PRIORITY),
        default: ORDER_PRIORITY.MEDIUM
    },
    total: { type: Number, required: true, min: 0 },
}, {
    timestamps: true
})

const OrderModel = mongoose.model('Order', orderSchema)

export default OrderModel
