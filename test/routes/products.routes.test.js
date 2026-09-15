import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"
import MockService from "../../src/mocks/services/mock.service.js"
import ProductService from "../../src/services/product.service.js"
import { expectErrorResponse } from "../helpers/assertions.js"

const request = supertest(app)
const FAKE_ID = "64b0f1e2e2b6a2a5f2c3d4e5"

function buildMockProduct() {
    const mockProduct = MockService.generateMockProducts(1)[0]
    delete mockProduct._id
    return mockProduct
}

describe("Products endpoints", function () {

    describe("GET /api/products", function () {

        it("debe obtener todos los productos", async function () {
            const response = await request.get("/api/products")
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array")
        })

        it("debe respetar el filtro por categoría", async function () {
            const response = await request.get("/api/products?category=Computers")
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array")
            response.body.forEach(product => {
                expect(product.category).to.equal("Computers")
            })
        })

        it("debe capar pageSize al máximo permitido (100)", async function () {
            const response = await request.get("/api/products?pageSize=999999")
            expect(response.statusCode).to.equal(200)
            expect(response.body.length).to.be.at.most(100)
        })
    })

    describe("POST /api/products", function () {

        afterEach(async function () {
            if (this.createdProductId) {
                await ProductService.deleteProduct(this.createdProductId)
                this.createdProductId = null
            }
        })

        it("debe crear un producto con datos válidos", async function () {
            const mockProduct = buildMockProduct()
            const response = await request.post("/api/products").send(mockProduct)

            expect(response.statusCode).to.equal(201)
            expect(response.body).to.have.property("_id")
            expect(response.body.title).to.equal(mockProduct.title)
            expect(response.body.price).to.equal(mockProduct.price)

            this.createdProductId = response.body._id
        })

        it("debe fallar con 400 si faltan campos requeridos", async function () {
            const response = await request.post("/api/products").send({})
            expectErrorResponse(response, 400, "VALIDATION_ERROR")
        })
    })

    describe("GET /api/products/:id", function () {

        before(async function () {
            this.product = await ProductService.createProduct(buildMockProduct())
        })

        after(async function () {
            await ProductService.deleteProduct(this.product._id)
        })

        it("debe obtener un producto por su id", async function () {
            const response = await request.get(`/api/products/${this.product._id}`)

            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("_id", String(this.product._id))
            expect(response.body.title).to.equal(this.product.title)
        })

        it("debe fallar con 404 si el producto no existe", async function () {
            const response = await request.get(`/api/products/${FAKE_ID}`)
            expectErrorResponse(response, 404, "PRODUCT_NOT_FOUND")
        })

        it("debe fallar con 400 si el id tiene formato inválido", async function () {
            const response = await request.get("/api/products/id-invalido")
            expectErrorResponse(response, 400, "INVALID_ID")
        })
    })

    describe("PATCH /api/products/:id", function () {

        beforeEach(async function () {
            this.product = await ProductService.createProduct(buildMockProduct())
        })

        afterEach(async function () {
            await ProductService.deleteProduct(this.product._id)
        })

        it("debe actualizar un producto", async function () {
            const response = await request
                .patch(`/api/products/${this.product._id}`)
                .send({ title: "Producto actualizado", price: 999.99 })

            expect(response.statusCode).to.equal(200)
            expect(response.body.title).to.equal("Producto actualizado")
            expect(response.body.price).to.equal(999.99)
        })

        it("debe fallar con 404 si el producto no existe", async function () {
            const response = await request
                .patch(`/api/products/${FAKE_ID}`)
                .send({ title: "No existe" })

            expectErrorResponse(response, 404, "PRODUCT_NOT_FOUND")
        })
    })

    describe("DELETE /api/products/:id", function () {

        it("debe eliminar un producto existente", async function () {
            const product = await ProductService.createProduct(buildMockProduct())

            const response = await request.delete(`/api/products/${product._id}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.property("message")
        })

        it("debe fallar con 404 si el producto no existe", async function () {
            const response = await request.delete(`/api/products/${FAKE_ID}`)
            expectErrorResponse(response, 404, "PRODUCT_NOT_FOUND")
        })
    })
})