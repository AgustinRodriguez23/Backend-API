import OrderModel from "../models/order.model.js"

class OrderRepository {
    static #defaultPopulate = [
        { path: 'user', select: '-password -__v' },
        { path: 'products.product' }
    ]

    static async find(filter = {}, options = {}) {
        const {
            sort = { createdAt: -1 },
            limit,
            skip
        } = options

        const query = OrderModel.find(filter)
            .populate(OrderRepository.#defaultPopulate)
            .sort(sort)

        if (limit) query.limit(limit)
        if (skip) query.skip(skip)

        return await query.exec()
    }

    static async findById(id) {
        return await OrderModel.findOne({ _id: id })
            .populate(OrderRepository.#defaultPopulate)
    }

    static async create(orderData) {
        const order = await OrderModel.create(orderData)
        return await OrderRepository.findById(order._id)
    }

    static async updateById(id, orderData) {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            orderData,
            { new: true, runValidators: true }
        )

        if (!updatedOrder) return null

        return await OrderRepository.findById(updatedOrder._id)
    }

    static async deleteById(id) {
        return await OrderModel.findByIdAndDelete(id)
    }
}

export default OrderRepository
