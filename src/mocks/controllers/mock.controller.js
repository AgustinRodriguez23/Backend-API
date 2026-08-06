import MockService from "../services/mock.service.js"

class MockController {

    static async mockingUsers(req, res){
    try {
        const queryCount = req.query.count
        
        const count = queryCount ? parseInt(queryCount) : 10

        if (isNaN(count) || count <= 0 || count >= 1000) {
            return res.status(400).json({ error: 'Requested number not available.'})
        }

        const users = MockService.generateMockUsers(count)
        res.status(200).json(users)
    } catch (error) {
        console.warn('Error generating mock users', error)
        res.status(500).json({error: 'Error generating mock users'})
    }
}

    static async generateProducts(req, res){
        try {
            const { count, saveToDatabase } = req.body
            const products = MockService.generateMockProducts(count)

            if (saveToDatabase) {
                await MockService.saveMockProducts(products)
                return res.status(201).json({products, message: 'Products saved succesfully'})
            }

            return res.status(200).json({products, message: 'Products generated succesfully'})
        } catch (error) {
            console.warn('Error generating mock products:', error)
            res.status(500).json({ statusCode: 500, message: 'Error generating mock products'})
        }
    }

    static async mockingOrders(req, res){
    try {
        const queryCount = req.query.count
        const count = queryCount ? parseInt(queryCount) : 10

        if (isNaN(count) || count <= 0 || count >= 1000) {
            return res.status(400).json({ error: 'Requested number not available.'})
        }

        const users = MockService.generateMockUsers(20)
        const orders = MockService.generateMockOrders(count, users)

        res.status(200).json(orders)
    } catch (error) {
        console.warn('Error generating mock orders', error)
        res.status(500).json({ error: 'Error generating mock orders'})
    }
}

    static async mockingDeliveries(req, res){
    try {
        const queryCount = req.query.count
        const count = queryCount ? parseInt(queryCount) : 10

        if (isNaN(count) || count <= 0 || count >= 1000) {
            return res.status(400).json({ error: 'Requested number not available.'})
        }

        const users = MockService.generateMockUsers(20)
        const orders = MockService.generateMockOrders(count, users)
        const deliveries = MockService.generateMockDeliveries(orders, users)

        res.status(200).json(deliveries)
    } catch (error) {
        console.warn('Error generating mock deliveries', error)
        res.status(500).json({ error: 'Error generating mock deliveries'})
    }
}
}

export default MockController