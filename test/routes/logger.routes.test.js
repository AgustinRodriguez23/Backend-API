import { expect } from "chai"
import supertest from "supertest"

import app from "../../src/app.js"

const request = supertest(app)

describe("GET /logger-test", function (){

    it("debe responder 200 y ejecutar todos los niveles de log sin errores", async function () {
        const response = await request.get("/logger-test")

        expect(response.statusCode).to.equal(200)
        expect(response.text).to.equal("Logger test completed.")
    })
})