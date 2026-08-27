import CustomError from "../errors/custom.error.js"
import DeliveryService from "../services/delivery.service.js"

class DeliveryController {

    static async getDeliveries(req, res, next) {
        try {
            const { page, pageSize, status } = req.query
            const deliveries = await DeliveryService.getAll({ page, pageSize, status })
            res.status(200).json(deliveries)
        } catch (error) {
            next(error)
        }
    }

    static async getDeliveryById(req, res, next) {
        try {
            const { id } = req.params
            const delivery = await DeliveryService.getById(id)
            res.status(200).json(delivery)
        } catch (error) {
            next(error)
        }
    }

    static async createDelivery(req, res, next) {
        try {
            const { order, address } = req.body

            if (!order || !address) {
                throw new CustomError('VALIDATION_ERROR', 'Missing required fields')
            }

            const newDelivery = await DeliveryService.create(req.body)
            res.status(201).json(newDelivery)
        } catch (error) {
            next(error)
        }
    }

    static async updateDelivery(req, res, next) {
        try {
            const { id } = req.params
            const updatedDelivery = await DeliveryService.update(id, req.body)
            res.status(200).json(updatedDelivery)
        } catch (error) {
            next(error)
        }
    }

    static async deleteDelivery(req, res, next) {
        try {
            const { id } = req.params
            await DeliveryService.remove(id)
            res.status(200).json({ statusCode: 200, message: 'Delivery deleted' })
        } catch (error) {
            next(error)
        }
    }
}

export default DeliveryController
