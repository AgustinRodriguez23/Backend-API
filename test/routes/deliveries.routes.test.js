import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"
import MockService from "../../src/mocks/services/mock.service.js"
import UserService from "../../src/services/user.service.js"
import ProductService from "../../src/services/product.service.js"
import OrderService from "../../src/services/order.service.js"
import { expectErrorResponse } from "../helpers/assertions.js"
import { DELIVERY_STATUS } from "../../src/utils/constants.js"

const request = supertest(app)
const FAKE_ID = "64b0f1e2e2b6a2a5f2c3d4e5"

async function createTestOrder(user, product) {
    return await OrderService.create({
        user: user._id,
        products: [{ product: product._id, quantity: 1 }],
        priority: "medium"
    })
}

describe("Deliveries endpoints", function () {

    before(async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        this.user = await UserService.create(mockUser)

        const mockProduct = MockService.generateMockProducts(1)[0]
        delete mockProduct._id
        this.product = await ProductService.createProduct(mockProduct)
    })

    after(async function () {
        await UserService.remove(this.user._id)
        await ProductService.deleteProduct(this.product._id)
    })

    describe("POST /api/deliveries", function () {

        afterEach(async function () {
            if (this.createdDeliveryId) {
                await request.delete(`/api/deliveries/${this.createdDeliveryId}`)
                this.createdDeliveryId = null
            }
            if (this.createdOrderId) {
                await OrderService.remove(this.createdOrderId)
                this.createdOrderId = null
            }
        })

        it("debe crear una entrega para un pedido válido", async function () {
            const order = await createTestOrder(this.user, this.product)
            this.createdOrderId = order._id

            const response = await request.post("/api/deliveries").send({
                order: order._id,
                address: "Calle Falsa 123"
            })

            expect(response.statusCode).to.equal(201)
            expect(response.body).to.have.property("_id")
            expect(response.body.status).to.equal(DELIVERY_STATUS.ASSIGNED)
            expect(response.body.order).to.have.property("_id")

            this.createdDeliveryId = response.body._id
        })

        it("debe fallar con 400 si faltan campos requeridos", async function () {
            const response = await request.post("/api/deliveries").send({})
            expectErrorResponse(response, 400, "VALIDATION_ERROR")
        })

        it("debe fallar con 404 si el pedido no existe", async function () {
            const response = await request.post("/api/deliveries").send({
                order: FAKE_ID,
                address: "Calle Falsa 123"
            })
            expectErrorResponse(response, 404, "ORDER_NOT_FOUND")
        })

        it("debe fallar con 409 si el pedido ya tiene una entrega asociada", async function () {
            const order = await createTestOrder(this.user, this.product)
            this.createdOrderId = order._id

            const firstResponse = await request.post("/api/deliveries").send({
                order: order._id,
                address: "Calle Falsa 123"
            })
            this.createdDeliveryId = firstResponse.body._id

            const response = await request.post("/api/deliveries").send({
                order: order._id,
                address: "Otra dirección 456"
            })

            expectErrorResponse(response, 409, "DUPLICATE_KEY")
        })
    })

    describe("GET /api/deliveries", function () {
        it("debe obtener todas las entregas", async function () {
            const response = await request.get("/api/deliveries")
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array")
        })
    })

    describe("GET /api/deliveries/:id", function () {

        before(async function () {
            this.order = await createTestOrder(this.user, this.product)
            const response = await request.post("/api/deliveries").send({
                order: this.order._id,
                address: "Calle Falsa 123"
            })
            this.deliveryId = response.body._id
        })

        after(async function () {
            await request.delete(`/api/deliveries/${this.deliveryId}`)
            await OrderService.remove(this.order._id)
        })

        it("debe obtener una entrega por su id, con order populado", async function () {
            const response = await request.get(`/api/deliveries/${this.deliveryId}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("_id", this.deliveryId)
            expect(response.body.order).to.have.property("_id")
        })

        it("debe fallar con 404 si la entrega no existe", async function () {
            const response = await request.get(`/api/deliveries/${FAKE_ID}`)
            expectErrorResponse(response, 404, "DELIVERY_NOT_FOUND")
        })

        it("debe fallar con 400 si el id tiene formato inválido", async function () {
            const response = await request.get("/api/deliveries/id-invalido")
            expectErrorResponse(response, 400, "INVALID_ID")
        })
    })

    describe("PATCH /api/deliveries/:id", function () {

        beforeEach(async function () {
            this.order = await createTestOrder(this.user, this.product)
            const response = await request.post("/api/deliveries").send({
                order: this.order._id,
                address: "Calle Falsa 123"
            })
            this.deliveryId = response.body._id
        })

        afterEach(async function () {
            await request.delete(`/api/deliveries/${this.deliveryId}`)
            await OrderService.remove(this.order._id)
        })

        it("debe actualizar el estado de una entrega", async function () {
            const response = await request
                .patch(`/api/deliveries/${this.deliveryId}`)
                .send({ status: DELIVERY_STATUS.IN_TRANSIT })

            expect(response.statusCode).to.equal(200)
            expect(response.body.status).to.equal(DELIVERY_STATUS.IN_TRANSIT)
        })

        it("debe asignar un courier a la entrega", async function () {
            const response = await request
                .patch(`/api/deliveries/${this.deliveryId}`)
                .send({ courier: this.user._id })

            expect(response.statusCode).to.equal(200)
            expect(response.body.courier).to.have.property("_id")
        })

        it("debe fallar con 400 si el estado es inválido", async function () {
            const response = await request
                .patch(`/api/deliveries/${this.deliveryId}`)
                .send({ status: "estado_inexistente" })

            expectErrorResponse(response, 400, "VALIDATION_ERROR")
        })

        it("debe fallar con 404 si la entrega no existe", async function () {
            const response = await request
                .patch(`/api/deliveries/${FAKE_ID}`)
                .send({ status: DELIVERY_STATUS.IN_TRANSIT })

            expectErrorResponse(response, 404, "DELIVERY_NOT_FOUND")
        })
    })

    describe("DELETE /api/deliveries/:id", function () {

        it("debe eliminar una entrega existente", async function () {
            const order = await createTestOrder(this.user, this.product)
            const createResponse = await request.post("/api/deliveries").send({
                order: order._id,
                address: "Calle Falsa 123"
            })

            const response = await request.delete(`/api/deliveries/${createResponse.body._id}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("message")

            await OrderService.remove(order._id)
        })

        it("debe fallar con 404 si la entrega no existe", async function () {
            const response = await request.delete(`/api/deliveries/${FAKE_ID}`)
            expectErrorResponse(response, 404, "DELIVERY_NOT_FOUND")
        })
    })
})