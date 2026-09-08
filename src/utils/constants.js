export const USER_ROLES = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    COURIER: 'courier',
})

export const PRODUCT_STATE = Object.freeze({
    IN_STOCK: 'in_stock',
    OUT_OF_STOCK: 'out_of_stock',
    PRE_ORDER: 'pre_order',
    DISCONTINUED: 'discontinued',
})

export const ORDER_STATUS = Object.freeze({
    CREATED: 'created',
    ASSIGNED: 'assigned',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
})

export const ORDER_PRIORITY = Object.freeze({
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
})

export const DELIVERY_STATUS = Object.freeze({
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
})

export const DOCUMENT_TYPE = Object.freeze({
    ID_CARD: 'id_card',
    DRIVER_LICENSE: 'driver_license',
    PROOF_OF_ADDRESS: 'proof_of_address',
    OTHER: 'other',
})

export const ALLOWED_FILE_MIMETYPES = Object.freeze([
    'application/pdf',
    'image/jpeg',
    'image/png',
])

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export const LOG_LEVELS = Object.freeze(['fatal', 'error', 'warn', 'info', 'http', 'debug'])