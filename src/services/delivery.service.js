import DeliveryRepository from "../repositories/delivery.repository.js"
import OrderModel from "../models/order.model.js"
import CustomError from "../errors/custom.error.js"
import { ORDER_STATUS } from "../utils/constants.js"

class DeliveryService {
    static async getAll({ page = 1, pageSize = 20, status } = {}) {
        const filter = {}
        if (status) filter.status = status

        return await DeliveryRepository.find(filter, {
            limit: pageSize,
            skip: (page - 1) * pageSize
        })
    }

    static async getById(id) {
        const delivery = await DeliveryRepository.findById(id)
        if (!delivery) {
            throw new CustomError('DELIVERY_NOT_FOUND')
        }
        return delivery
    }

    static async create({ order, courier, address, estimated_delivery }) {
        const existingOrder = await OrderModel.findById(order)
        if (!existingOrder) {
            throw new CustomError('ORDER_NOT_FOUND')
        }
        if (existingOrder.status === ORDER_STATUS.CANCELLED) {
            throw new CustomError('INVALID_ORDER_STATUS', 'Cannot create a delivery for a cancelled order')
        }

        return await DeliveryRepository.create({ order, courier, address, estimated_delivery })
    }

    static async update(id, deliveryData) {
        const updatedDelivery = await DeliveryRepository.updateById(id, deliveryData)
        if (!updatedDelivery) {
            throw new CustomError('DELIVERY_NOT_FOUND')
        }
        return updatedDelivery
    }

    static async remove(id) {
        const deletedDelivery = await DeliveryRepository.deleteById(id)
        if (!deletedDelivery) {
            throw new CustomError('DELIVERY_NOT_FOUND')
        }
        return deletedDelivery
    }

    static async addReceipt(id, receiptData) {
        const updatedDelivery = await DeliveryRepository.addReceipt(id, receiptData)
        if (!updatedDelivery) {
            throw new CustomError('DELIVERY_NOT_FOUND')
        }
        return updatedDelivery
    }
}

export default DeliveryService
