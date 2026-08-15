import CustomError from "../errors/custom.error.js";

export function errorHandler(err, req, res, next) {
    const isCustomError = err instanceof CustomError
    const customError = isCustomError ? err : mapToCustomError(err)

    const { statusCode, code, message } = customError

    if (isCustomError) {
        console.warn('Custom Error', err.message)
    } else {
        console.error('Unexpected Error', err)
    }

    res.status(statusCode).json({ status: 'error', error: code, message })
}

export function notFoundRoute(req, res, next) {
    next(new CustomError('ROUTE_NOT_FOUND'))
}

function mapToCustomError(err) {
    if (err.name === 'CastError') {
        return new CustomError('INVALID_ID')
    }
    if (err.code === 11000) {
        return new CustomError('DUPLICATE_KEY')
    }
    if (err.name === 'ValidationError') {
        return new CustomError('VALIDATION_ERROR', err.message)
    }

    return new CustomError('INTERNAL_SERVER_ERROR')
}
