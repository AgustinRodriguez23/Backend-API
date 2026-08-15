import { ERROR_CODES } from "./error-codes.js"

class CustomError extends Error {
    constructor(code, customMessage) {

        const errorDefinitions = ERROR_CODES[code] ?? ERROR_CODES.INTERNAL_SERVER_ERROR
        const resolvedCode = ERROR_CODES[code] ? code : 'INTERNAL_SERVER_ERROR'

        super(customMessage ?? errorDefinitions.message)

        this.code = resolvedCode
        this.statusCode = errorDefinitions.statusCode
        this.message = customMessage ?? errorDefinitions.message

        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError  