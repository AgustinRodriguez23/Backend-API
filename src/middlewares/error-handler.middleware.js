import logger from "../config/logger.js";
import CustomError from "../errors/custom.error.js";
import multer from "multer";

export function errorHandler(err, req, res, next) {
    const isCustomError = err instanceof CustomError
    const customError = isCustomError ? err : mapToCustomError(err)

    const { statusCode, code, message } = customError

    if (isCustomError) {
        logger.warn(`Custom Error: ${err.message}`)
    } else {
        logger.error(err.stack ?? err.message)
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
        const duplicatedField = Object.keys(err.keyValue ?? {})[0]
        const message = duplicatedField
            ? `The field '${duplicatedField}' is already in use`
            : undefined
        return new CustomError('DUPLICATE_KEY', message)
    }
    if (err.name === 'ValidationError') {
        return new CustomError('VALIDATION_ERROR', err.message)
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return new CustomError('FILE_TOO_LARGE')
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'INVALID_FILE_TYPE') {
            return new CustomError('INVALID_FILE_TYPE')
        }
        return new CustomError('UNEXPECTED_FILE_FIELD')
    }

    return new CustomError('INTERNAL_SERVER_ERROR', err.message)
}
