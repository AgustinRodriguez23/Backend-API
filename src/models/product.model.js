import mongoose from "mongoose";

import { PRODUCT_STATE } from "../utils/constants.js";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    state: {
        type: String,
        enum: Object.values(PRODUCT_STATE),
        default: PRODUCT_STATE.IN_STOCK
    },
    category: { type: String, required: true },
    images: [{ type: String }],
}, {
    timestamps: true
})

productSchema.pre('save', function (next) {
    const manualStates = [PRODUCT_STATE.PRE_ORDER, PRODUCT_STATE.DISCONTINUED]
    if (!manualStates.includes(this.state)) {
        this.state = this.stock > 0 ? PRODUCT_STATE.IN_STOCK : PRODUCT_STATE.OUT_OF_STOCK
    }
    next()
})

const ProductModel = mongoose.model('Product', productSchema)

export default ProductModel