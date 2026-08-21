import { faker } from "@faker-js/faker"

import ProductModel from "../../models/product.model.js"
import CustomError from "../../errors/custom.error.js"

import { 
    USER_ROLES, 
    ORDER_PRIORITY, 
    ORDER_STATUS, 
    DELIVERY_STATUS 
} from "../../utils/constants.js"

const MAX_MOCK_COUNT = 1000

class MockService {

    static validateCount = (count) => {
        if (isNaN(count) || count <= 0 || count >= MAX_MOCK_COUNT) {
            throw new CustomError('INVALID_MOCK_QUANTITY')
        }
    }

    static generateMockUsers = (count) => {
        this.validateCount(count)

        const roles = Object.values(USER_ROLES)

        const users = Array.from({length: count}, () => { 
            return {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement(roles)
            }
        })
        return users 
    }

    static generateMockProducts = (count) => {
        this.validateCount(count)

        const products = Array.from({length: count}, () => {
            return {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                category: faker.commerce.department(),
                stock: faker.number.int({ min: 0, max: 100}),
                images: faker.image.url({ category: 'product', width: 640, height: 480 }),
            }
        })
        return products
    }
    
    static saveMockProducts = async (products) => {
        const insertedProducts = await ProductModel.insertMany(products)
        return insertedProducts
    }   

    static generateMockOrders = (count, users) => {
        this.validateCount(count)

        const statusOrders = Object.values(ORDER_STATUS)
        const priorities = Object.values(ORDER_PRIORITY)

        const customers = users.filter(u => u.role === USER_ROLES.USER)

        const orders = Array.from({length: count}, () => {
            return {
            id: faker.string.uuid(),
            user_email: faker.helpers.arrayElement(customers).email,
            products: faker.helpers.arrayElements(
                Array.from({length: 5}, () => faker.commerce.productName()),
                { min: 1, max: 3 }
            ),
            status: faker.helpers.arrayElement(statusOrders),
            priority: faker.helpers.arrayElement(priorities),
            total: faker.commerce.price({ min: 10, max: 500 }),
            created_at: faker.date.recent({ days: 30 })
            }
        })
        return orders
    }

    static generateMockDeliveries = (orders, users) => {
        const deliveryStatus = Object.values(DELIVERY_STATUS)

        const couriers = users.filter(u => u.role === USER_ROLES.COURIER)

        const deliveries = orders
            .filter(order => order.status !== ORDER_STATUS.CANCELLED)
            .map(order => {
                return {
                id: faker.string.uuid(),
                order_id: order.id,
                courier_email: couriers.length
                    ? faker.helpers.arrayElement(couriers).email
                    : null,
                status: faker.helpers.arrayElement(deliveryStatus),
                address: faker.location.streetAddress(),
                estimated_delivery: faker.date.soon({days: 5})
                }
            })
        return deliveries
    }
}   


export default MockService
