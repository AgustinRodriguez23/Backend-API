import CustomError from "../errors/custom.error.js"
import DeliveryService from "../services/delivery.service.js"

import logger from "../config/logger.js"
import { deleteFileIfExists } from "../utils/file.utils.js"

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

    static async uploadDeliveryReceipt(req, res, next) {
        try {
            const { id } = req.params

            const receiptData = {
                original_name: req.file.originalname,
                generated_name: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size,
                uploaded_at: new Date()
            }

            const updatedDelivery = await DeliveryService.addReceipt(id, receiptData)

            logger.info(`Receipt uploaded and associated to delivery ${id}`)
            res.status(201).json(updatedDelivery)
        } catch (error) {
            if (req.file) await deleteFileIfExists(req.file.path)
            next(error)
        }
    }
}

export default DeliveryController
