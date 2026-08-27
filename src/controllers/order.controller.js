import CustomError from "../errors/custom.error.js"
import OrderService from "../services/order.service.js"

class OrderController {

    static async getOrders(req, res, next) {
        try {
            const { page, pageSize, status, priority } = req.query
            const orders = await OrderService.getAll({ page, pageSize, status, priority })
            res.status(200).json(orders)
        } catch (error) {
            next(error)
        }
    }

    static async getOrderById(req, res, next) {
        try {
            const { id } = req.params
            const order = await OrderService.getById(id)
            res.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }

    static async createOrder(req, res, next) {
        try {
            const { user, products } = req.body

            if (!user || !Array.isArray(products) || products.length === 0) {
                throw new CustomError('VALIDATION_ERROR', 'Missing required fields')
            }

            const newOrder = await OrderService.create(req.body)
            res.status(201).json(newOrder)
        } catch (error) {
            next(error)
        }
    }

    static async updateOrder(req, res, next) {
        try {
            const { id } = req.params
            const updatedOrder = await OrderService.update(id, req.body)
            res.status(200).json(updatedOrder)
        } catch (error) {
            next(error)
        }
    }

    static async deleteOrder(req, res, next) {
        try {
            const { id } = req.params
            await OrderService.remove(id)
            res.status(200).json({ statusCode: 200, message: 'Order deleted' })
        } catch (error) {
            next(error)
        }
    }
}

export default OrderController
