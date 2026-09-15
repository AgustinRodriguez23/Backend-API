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

const FAKE_ID = "64b0f1e2e2b6a2a5f2c3d4e5"

describe("GET /api/users/:id", function () {

    before(async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        this.user = await UserService.create(mockUser)
    })

    after(async function () {
        await UserService.remove(this.user._id)
    })

    it("debe obtener un usuario por su id", async function () {
        const response = await request.get(`/api/users/${this.user._id}`)

        expect(response.statusCode).to.equal(200)
        expect(response.body).to.have.property("_id", String(this.user._id))
        expect(response.body.email).to.equal(this.user.email)
        expect(response.body).to.not.have.property("password")
    })

    it("debe fallar con 404 si el usuario no existe", async function () {
        const response = await request.get(`/api/users/${FAKE_ID}`)
        expectErrorResponse(response, 404, "USER_NOT_FOUND")
    })

    it("debe fallar con 400 si el id tiene formato inválido", async function () {
        const response = await request.get("/api/users/id-invalido")
        expectErrorResponse(response, 400, "INVALID_ID")
    })
})

describe("PATCH /api/users/:id", function () {

    beforeEach(async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        this.user = await UserService.create(mockUser)
    })

    afterEach(async function () {
        await UserService.remove(this.user._id)
    })

    it("debe actualizar los datos de un usuario", async function () {
        const response = await request
            .patch(`/api/users/${this.user._id}`)
            .send({ first_name: "NombreActualizado", last_name: "ApellidoActualizado" })

        expect(response.statusCode).to.equal(200)
        expect(response.body.first_name).to.equal("NombreActualizado")
        expect(response.body.last_name).to.equal("ApellidoActualizado")
        expect(response.body.email).to.equal(this.user.email)
    })

    it("debe actualizar el rol de un usuario", async function () {
        const response = await request
            .patch(`/api/users/${this.user._id}`)
            .send({ role: "courier" })

        expect(response.statusCode).to.equal(200)
        expect(response.body.role).to.equal("courier")
    })

    it("debe fallar con 404 si el usuario no existe", async function () {
        const response = await request
            .patch(`/api/users/${FAKE_ID}`)
            .send({ first_name: "NoExiste" })

        expectErrorResponse(response, 404, "USER_NOT_FOUND")
    })

    it("debe fallar con 400 si el id tiene formato inválido", async function () {
        const response = await request
            .patch("/api/users/id-invalido")
            .send({ first_name: "Test" })

        expectErrorResponse(response, 400, "INVALID_ID")
    })
})

describe("DELETE /api/users/:id", function () {

    it("debe eliminar un usuario existente", async function () {
        const mockUser = MockService.generateMockUsers(1)[0]
        const user = await UserService.create(mockUser)

        const response = await request.delete(`/api/users/${user._id}`)

        expect(response.statusCode).to.equal(200)
        expect(response.body).to.have.property("message")
    })

    it("debe fallar con 404 si el usuario no existe", async function () {
        const response = await request.delete(`/api/users/${FAKE_ID}`)
        expectErrorResponse(response, 404, "USER_NOT_FOUND")
    })

    it("debe fallar con 400 si el id tiene formato inválido", async function () {
        const response = await request.delete("/api/users/id-invalido")
        expectErrorResponse(response, 400, "INVALID_ID")
    })
})