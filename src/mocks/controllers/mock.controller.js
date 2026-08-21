import MockService from "../services/mock.service.js"

class MockController {

    static async mockingUsers(req, res, next) {
        try {
            const queryCount = req.query.count
            const count = queryCount ? parseInt(queryCount) : 10

            const users = MockService.generateMockUsers(count)
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    static async generateProducts(req, res, next) {
        try {
            const { count, saveToDatabase } = req.body
            const products = MockService.generateMockProducts(count)

            if (saveToDatabase) {
                const insertedProducts = await MockService.saveMockProducts(products)
                return res.status(201).json({ products: insertedProducts, message: 'Products saved succesfully' })
            }

            return res.status(200).json({ products, message: 'Products generated succesfully' })
        } catch (error) {
            next(error)
        }
    }

    static async mockingOrders(req, res, next) {
        try {
            const queryCount = req.query.count
            const count = queryCount ? parseInt(queryCount) : 10

            const users = MockService.generateMockUsers(20)
            const orders = MockService.generateMockOrders(count, users)

            res.status(200).json(orders)
        } catch (error) {
            next(error)
        }
    }

    static async mockingDeliveries(req, res, next) {
        try {
            const queryCount = req.query.count
            const count = queryCount ? parseInt(queryCount) : 10

            const users = MockService.generateMockUsers(20)
            const orders = MockService.generateMockOrders(count, users)
            const deliveries = MockService.generateMockDeliveries(orders, users)

            res.status(200).json(deliveries)
        } catch (error) {
            next(error)
        }
    }
}

export default MockController
