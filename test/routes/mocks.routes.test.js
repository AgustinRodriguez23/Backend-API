import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"
import ProductService from "../../src/services/product.service.js"
import { expectErrorResponse } from "../helpers/assertions.js"

const request = supertest(app)

describe("Mocks endpoints", function () {

    describe("GET /api/mocks/mocking-users", function (){

        it("debe generar 10 usuarios por defecto si no se pasa count", async function () {
            const response = await request.get("/api/mocks/mocking-users")

            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array").with.lengthOf(10)
            expect(response.body[0]).to.have.all.keys("first_name", "last_name", "email", "password", "role")
        })

        it("debe respetar el count pasado por query", async function () {
            const response = await request.get("/api/mocks/mocking-users?count=3")
            expect(response.statusCode).to.equal(200)
            expect(response.body).to.have.lengthOf(3)
        })

        it("debe fallar con 400 si count es inválido (0 o negativo)", async function () {
            const response = await request.get("/api/mocks/mocking-users?count=0")
            expectErrorResponse(response, 400, "INVALID_MOCK_QUANTITY")
        })

        it("debe fallar con 400 si count no es un número", async function () {
            const response = await request.get("/api/mocks/mocking-users?count=abc")
            expectErrorResponse(response, 400, "INVALID_MOCK_QUANTITY")
        })
    })

    describe("POST /api/mocks/generate-products", function () {

        it("debe generar productos sin guardarlos en la db", async function (){
            const response = await request
                .post("/api/mocks/generate-products")
                .send({ count: 5, saveToDatabase: false })

            expect(response.statusCode).to.equal(200)
            expect(response.body.products).to.be.an("array").with.lengthOf(5)
            expect(response.body.message).to.equal("Products generated succesfully")
        })

        it("debe generar y guardar productos en la db cuando saveToDatabase es true", async function () {
            const response = await request
                .post("/api/mocks/generate-products")
                .send({ count: 2, saveToDatabase: true })

            expect(response.statusCode).to.equal(201)
            expect(response.body.products).to.have.lengthOf(2)
            expect(response.body.products[0]).to.have.property("_id")

            this.createdProductIds = response.body.products.map(p => p._id)
        })

        afterEach(async function () {
            if (this.createdProductIds) {
                for (const id of this.createdProductIds) {
                    await ProductService.deleteProduct(id)
                }
                this.createdProductIds = null
            }
        })

        it("debe fallar con 400 si count es inválido", async function () {
            const response = await request
                .post("/api/mocks/generate-products")
                .send({ count: -1, saveToDatabase: false })

            expectErrorResponse(response, 400, "INVALID_MOCK_QUANTITY")
        })
    })

    describe("GET /api/mocks/mocking-orders", function () {

        it("debe generar 10 pedidos mockeados por defecto", async function () {
            const response = await request.get("/api/mocks/mocking-orders")

            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array").with.lengthOf(10)
            expect(response.body[0]).to.have.property("user_email")
            expect(response.body[0]).to.have.property("status")
        })

        it("debe fallar con 400 si count es inválido", async function () {
            const response = await request.get("/api/mocks/mocking-orders?count=2000")

            expectErrorResponse(response, 400, "INVALID_MOCK_QUANTITY")
        })
    })

    describe("GET /api/mocks/mocking-deliveries", function () {

        it("debe generar entregas mockeadas asociadas a pedidos", async function () {
            const response = await request.get("/api/mocks/mocking-deliveries?count=5")

            expect(response.statusCode).to.equal(200)
            expect(response.body).to.be.an("array")
            if (response.body.length > 0) {
                expect(response.body[0]).to.have.property("order_id")
                expect(response.body[0]).to.have.property("status")
            }
        })
    })
})