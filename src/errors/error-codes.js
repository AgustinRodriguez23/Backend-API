export const ERROR_CODES = Object.freeze ({
    USER_NOT_FOUND: {
        statusCode: 404,
        message: 'User not found'
    },
    INVALID_ID: {
        statusCode: 400,
        message: 'Invalid id'
    },
    DUPLICATE_KEY: {
        statusCode: 409,
        message: 'Email already in use'
    },
    VALIDATION_ERROR: {
        statusCode: 400,
        message: 'Validation error'
    }, 
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: 'Internal server error'
    }, 
    ROUTE_NOT_FOUND: {
        statusCode: 404,
        message: 'Route not found'
    },
    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: 'Order not found'
    },
    INVALID_ORDER_STATUS: {
        statusCode: 400,
        message: 'Invalid order status'
    },
    INVALID_MOCK_QUANTITY: {
        statusCode: 400,
        message: 'Invalid mock quantity'
    },
    PRODUCT_NOT_FOUND: {
        statusCode: 404,
        message: 'Product not found'
    }
})