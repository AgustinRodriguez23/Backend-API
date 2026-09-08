import OrderRepository from "../repositories/order.repository.js"
import ProductModel from "../models/product.model.js"
import CustomError from "../errors/custom.error.js"

import { normalizePagination } from "../utils/pagination.js"

class OrderService {

    static async getAll({ page, pageSize, status, priority } = {}) {
        const { pageSize: safePageSize, skip } = normalizePagination({ page, pageSize })

        const filter = {}
        if (status) filter.status = status
        if (priority) filter.priority = priority

        return await OrderRepository.find(filter, { limit: safePageSize, skip })
    }

    static async getById(id) {
        const order = await OrderRepository.findById(id)
        if (!order) {
            throw new CustomError('ORDER_NOT_FOUND')
        }
        return order
    }

    static async create({ user, products, priority }) {
        const total = await OrderService.#calculateTotal(products)

        return await OrderRepository.create({ user, products, priority, total })
    }

    static async update(id, orderData) {
        if (orderData.products) {
            orderData.total = await OrderService.#calculateTotal(orderData.products)
        }

        const updatedOrder = await OrderRepository.updateById(id, orderData)
        if (!updatedOrder) {
            throw new CustomError('ORDER_NOT_FOUND')
        }
        return updatedOrder
    }

    static async remove(id) {
        const deletedOrder = await OrderRepository.deleteById(id)
        if (!deletedOrder) {
            throw new CustomError('ORDER_NOT_FOUND')
        }
        return deletedOrder
    }

    static async #calculateTotal(products) {
        const productIds = products.map(item => item.product)
        const foundProducts = await ProductModel.find({ _id: { $in: productIds } })

        if (foundProducts.length !== new Set(productIds.map(String)).size) {
            throw new CustomError('PRODUCT_NOT_FOUND')
        }

        return products.reduce((total, item) => {
            const product = foundProducts.find(p => p._id.toString() === item.product.toString())
            return total + (product.price * item.quantity)
        }, 0)
    }
}

export default OrderService
