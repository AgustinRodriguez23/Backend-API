import DeliveryModel from "../models/delivery.model.js"

class DeliveryRepository {
    static #defaultPopulate = [
        { path: 'order' },
        { path: 'courier', select: '-password -__v' }
    ]

    static async find(filter = {}, options = {}) {
        const {
            sort = { createdAt: -1 },
            limit,
            skip
        } = options

        const query = DeliveryModel.find(filter)
            .populate(DeliveryRepository.#defaultPopulate)
            .sort(sort)

        if (limit) query.limit(limit)
        if (skip) query.skip(skip)

        return await query.exec()
    }

    static async findById(id) {
        return await DeliveryModel.findOne({ _id: id })
            .populate(DeliveryRepository.#defaultPopulate)
    }

    static async create(deliveryData) {
        const delivery = await DeliveryModel.create(deliveryData)
        return await DeliveryRepository.findById(delivery._id)
    }

    static async updateById(id, deliveryData) {
        const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
            id,
            deliveryData,
            { new: true, runValidators: true }
        )

        if (!updatedDelivery) return null

        return await DeliveryRepository.findById(updatedDelivery._id)
    }

    static async deleteById(id) {
        return await DeliveryModel.findByIdAndDelete(id)
    }
}

export default DeliveryRepository
