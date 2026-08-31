import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"

const request = supertest(app)

describe("GET /api/docs", function (){

    it("debe responder 200 y servir la interfaz de Swagger UI", async function () {
        const response = await request.get("/api/docs/")

        expect(response.statusCode).to.equal(200)
        expect(response.headers["content-type"]).to.include("text/html")
        expect(response.text).to.include("swagger-ui")
    })
})