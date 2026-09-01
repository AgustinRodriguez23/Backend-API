import { expect } from "chai"
import supertest from "supertest"
import path from "path"
import { fileURLToPath } from "url"

import app from "../../src/app.js"
import MockService from "../../src/mocks/services/mock.service.js"
import UserService from "../../src/services/user.service.js"
import ProductService from "../../src/services/product.service.js"
import OrderService from "../../src/services/order.service.js"
import DeliveryService from "../../src/services/delivery.service.js"
import { expectErrorResponse } from "../helpers/assertions.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VALID_FILE = path.join(__dirname, "../fixtures/example.jpg")
const INVALID_TYPE_FILE = path.join(__dirname, "../fixtures/invalid-file.txt")

const request = supertest(app)
const FAKE_ID = "64b0f1e2e2b6a2a5f2c3d4e5"

describe("Uploads endpoints", function () {

    describe("POST /api/users/:id/documents", function () {

        before(async function () {
            const mockUser = MockService.generateMockUsers(1)[0]
            this.user = await UserService.create(mockUser)
        })

        after(async function () {
            await UserService.remove(this.user._id)
        })

        it("debe subir un documento correctamente", async function () {
            const response = await request
                .post(`/api/users/${this.user._id}/documents`)
                .field("document_type", "id_card")
                .attach("document", VALID_FILE)

            expect(response.statusCode).to.equal(201)
            expect(response.body.documents).to.be.an("array").with.lengthOf(1)
            expect(response.body.documents[0]).to.include({ document_type: "id_card" })
            expect(response.body.documents[0]).to.have.property("generated_name")
        })

        it("debe fallar con 400 si no se envía ningún archivo", async function () {
            const response = await request
                .post(`/api/users/${this.user._id}/documents`)
                .field("document_type", "id_card")

            expectErrorResponse(response, 400, "FILE_REQUIRED")
        })

        it("debe fallar con 400 si document_type es inválido", async function () {
            const response = await request
                .post(`/api/users/${this.user._id}/documents`)
                .field("document_type", "pasaporte")
                .attach("document", VALID_FILE)

            expectErrorResponse(response, 400, "INVALID_DOCUMENT_TYPE")
        })

        it("debe fallar con 400 si el tipo de archivo no está permitido", async function () {
            const response = await request
                .post(`/api/users/${this.user._id}/documents`)
                .field("document_type", "id_card")
                .attach("document", INVALID_TYPE_FILE)

            expectErrorResponse(response, 400, "INVALID_FILE_TYPE")
        })

        it("debe fallar con 404 si el usuario no existe", async function () {
            const response = await request
                .post(`/api/users/${FAKE_ID}/documents`)
                .field("document_type", "id_card")
                .attach("document", VALID_FILE)

            expectErrorResponse(response, 404, "USER_NOT_FOUND")
        })
    })

    describe("POST /api/deliveries/:id/receipts", function () {

        before(async function () {
            const mockUser = MockService.generateMockUsers(1)[0]
            this.user = await UserService.create(mockUser)

            const mockProduct = MockService.generateMockProducts(1)[0]
            delete mockProduct._id
            this.product = await ProductService.createProduct(mockProduct)

            const order = await OrderService.create({
                user: this.user._id,
                products: [{ product: this.product._id, quantity: 1 }],
                priority: "medium"
            })
            this.order = order

            this.delivery = await DeliveryService.create({
                order: this.order._id,
                address: "Calle Falsa 123"
            })
        })

        after(async function () {
            await DeliveryService.remove(this.delivery._id)
            await OrderService.remove(this.order._id)
            await ProductService.deleteProduct(this.product._id)
            await UserService.remove(this.user._id)
        })

        it("debe subir un comprobante correctamente", async function () {
            const response = await request
                .post(`/api/deliveries/${this.delivery._id}/receipts`)
                .attach("receipt", VALID_FILE)

            expect(response.statusCode).to.equal(201)
            expect(response.body.receipts).to.be.an("array").with.lengthOf(1)
            expect(response.body.receipts[0]).to.have.property("generated_name")
        })

        it("debe fallar con 400 si no se envía ningún archivo", async function () {
            const response = await request.post(`/api/deliveries/${this.delivery._id}/receipts`)
            expectErrorResponse(response, 400, "FILE_REQUIRED")
        })

        it("debe fallar con 404 si la entrega no existe", async function () {
            const response = await request
                .post(`/api/deliveries/${FAKE_ID}/receipts`)
                .attach("receipt", VALID_FILE)

            expectErrorResponse(response, 404, "DELIVERY_NOT_FOUND")
        })
    })
})