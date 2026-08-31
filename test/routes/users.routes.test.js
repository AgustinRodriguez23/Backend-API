import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"
import UserService from "../../src/services/user.service.js"
import MockService from "../../src/mocks/services/mock.service.js"
import { expectErrorResponse } from "../helpers/assertions.js"

const request = supertest(app)

describe("GET /api/users", function () {

    it("debe obtener todos los usuarios de la db", async function () {
        const response = await request.get("/api/users")
        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an("array")
    })

    it("debe devolver 404 en formato correcto si la ruta no existe", async function () {
        const response = await request.get("/api/nonexistent-route")
        expectErrorResponse(response, 404, "ROUTE_NOT_FOUND")
    })
})

describe("POST /api/users", function () {

    it("debe crear un usuario con datos válidos", async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        const response = await request.post("/api/users").send(mockUser)

        expect(response.statusCode).to.equal(201)
        expect(response.body).to.have.property("_id")
        expect(response.body.email).to.equal(mockUser.email)
        expect(response.body.first_name).to.equal(mockUser.first_name)
        expect(response.body.last_name).to.equal(mockUser.last_name)
        expect(response.body).to.not.have.property("password")

        this.createdUserId = response.body._id
    })

    it("debe fallar con 400 si faltan datos requeridos", async function () {
        const response = await request.post("/api/users").send({})
        expectErrorResponse(response, 400, "VALIDATION_ERROR")
    })

    it("debe fallar con 409 si el email ya está en uso", async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        const firstResponse = await request.post("/api/users").send(mockUser)
        this.createdUserId = firstResponse.body._id

        const response = await request.post("/api/users").send(mockUser)
        expectErrorResponse(response, 409, "DUPLICATE_KEY")
    })

    afterEach(async function () {
        if (this.createdUserId) {
            await UserService.remove(this.createdUserId)
            this.createdUserId = null
        }
    })
})