import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"
import MockService from "../../src/mocks/services/mock.service.js"
import ProductService from "../../src/services/product.service.js"
import UserService from "../../src/services/user.service.js"

import { expectErrorResponse } from "../helpers/assertions.js"
import { ORDER_STATUS } from "../../src/utils/constants.js"

const request = supertest(app)
const FAKE_ID = "64b0f1e2e2b6a2a5f2c3d4e5"

function buildValidOrderBody(user, product, overrides = {}) {
    return {
        user: user._id,
        products: [{ product: product._id, quantity: 2 }],
        priority: "high",
        ...overrides
    }
}

describe("Orders endpoints", function (){

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

    describe("POST /api/orders", function () {

        afterEach(async function () {
            if (this.createdOrderId) {
                await request.delete(`/api/orders/${this.createdOrderId}`)
                this.createdOrderId = null
            }
        })

        it("debe crear un pedido con datos válidos", async function () {
            const body = buildValidOrderBody(this.user, this.product)
            const response = await request.post("/api/orders").send(body)

            expect(response.statusCode).to.equal(201)
            expect(response.body).to.have.property("_id")
            expect(response.body.status).to.equal(ORDER_STATUS.CREATED)
            expect(response.body.total).to.equal(this.product.price * 2)

            this.createdOrderId = response.body._id
        })

        it("debe fallar con 400 si faltan campos requeridos", async function () {
            const response = await request.post("/api/orders").send({ user: this.user._id })
            expectErrorResponse(response, 400, "VALIDATION_ERROR")
        })

        it("debe fallar con 404 si el producto no existe", async function () {
            const body = buildValidOrderBody(this.user, this.product, {
                products: [{ product: FAKE_ID, quantity: 1 }]
            })
            const response = await request.post("/api/orders").send(body)
            expectErrorResponse(response, 404, "PRODUCT_NOT_FOUND")
        })
    })

    describe("GET /api/orders", function () {
        it("debe obtener todos los pedidos", async function () {
            const response = await request.get("/api/orders")
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array")
        })
    })

    describe("GET /api/orders/:id", function () {

        before(async function () {
            const body = buildValidOrderBody(this.user, this.product)
            const response = await request.post("/api/orders").send(body)
            this.orderId = response.body._id
        })

        after(async function () {
            await request.delete(`/api/orders/${this.orderId}`)
        })

        it("debe obtener un pedido por su id, con user y product populados", async function () {
            const response = await request.get(`/api/orders/${this.orderId}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("_id", this.orderId)
            expect(response.body.user).to.have.property("_id")
            expect(response.body.products[0]).to.have.property("product")
        })

        it("debe fallar con 404 si el pedido no existe", async function () {
            const response = await request.get(`/api/orders/${FAKE_ID}`)
            expectErrorResponse(response, 404, "ORDER_NOT_FOUND")
        })

        it("debe fallar con 400 si el id tiene formato inválido", async function () {
            const response = await request.get("/api/orders/id-invalido")
            expectErrorResponse(response, 400, "INVALID_ID")
        })
    })

    describe("PATCH /api/orders/:id", function () {

        beforeEach(async function () {
            const body = buildValidOrderBody(this.user, this.product)
            const response = await request.post("/api/orders").send(body)
            this.orderId = response.body._id
        })

        afterEach(async function () {
            await request.delete(`/api/orders/${this.orderId}`)
        })

        it("debe actualizar el estado de un pedido", async function () {
            const response = await request
                .patch(`/api/orders/${this.orderId}`)
                .send({ status: ORDER_STATUS.ASSIGNED })

            expect(response.statusCode).to.equal(200)
            expect(response.body.status).to.equal(ORDER_STATUS.ASSIGNED)
        })

        it("debe fallar con 400 si el estado es inválido", async function () {
            const response = await request
                .patch(`/api/orders/${this.orderId}`)
                .send({ status: "state does not exist" })

            expectErrorResponse(response, 400, "VALIDATION_ERROR")
        })

        it("debe fallar con 404 si el pedido no existe", async function () {
            const response = await request
                .patch(`/api/orders/${FAKE_ID}`)
                .send({ status: ORDER_STATUS.ASSIGNED })

            expectErrorResponse(response, 404, "ORDER_NOT_FOUND")
        })
    })

    describe("DELETE /api/orders/:id", function () {

        it("debe eliminar un pedido existente", async function () {
            const body = buildValidOrderBody(this.user, this.product)
            const createResponse = await request.post("/api/orders").send(body)

            const response = await request.delete(`/api/orders/${createResponse.body._id}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("message")
        })

        it("debe fallar con 404 si el pedido no existe", async function () {
            const response = await request.delete(`/api/orders/${FAKE_ID}`)
            expectErrorResponse(response, 404, "ORDER_NOT_FOUND")
        })
    })
})