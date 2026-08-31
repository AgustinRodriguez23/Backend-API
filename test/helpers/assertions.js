import { expect } from "chai"

export function expectErrorResponse(response, expectedStatus, expectedCode) {
    expect(response.statusCode).to.equal(expectedStatus)
    expect(response.body).to.have.property("status", "error")
    expect(response.body).to.have.property("error", expectedCode)
    expect(response.body).to.have.property("message")
}