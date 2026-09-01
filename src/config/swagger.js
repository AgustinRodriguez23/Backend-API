import swaggerJSDoc from "swagger-jsdoc"
import { config } from "./env.config.js"
import { USER_ROLES, PRODUCT_STATE, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS, DOCUMENT_TYPE } from "../utils/constants.js"
import { ERROR_CODES } from "../errors/error-codes.js"

const schemas = {
    Health: {
        type: 'object',
        properties: {
            service: { type: 'string', example: 'ShipNow API'},
            environment: {type: 'string', example: 'development'}
        }
    },
    User: {
        type: 'object',
        description: 'Password never returned in responses',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0'},
            first_name: { type: 'string', example: 'Tomas'},
            last_name: { type: 'string', example: 'Lopez'},
            email: { type: 'string', format: 'email', example: 'tomaslopez@example.com'},
            role: { type: 'string', enum: Object.values(USER_ROLES), example: 'user'},
        },
        documents: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserDocument' }
        },
    },
    UserCreateRequest: {
        type: 'object',
        required: ['first_name', 'last_name', 'email', 'password'],
        properties: {
            first_name: {type: 'string', example: 'thomas'},
            last_name: {type: 'string', example: 'lopez'},
            email: {type: 'string', format: 'email', example: 'thomaslopez@example.com'},
            password: {type: 'string', format: 'password', example: 'p@ssw0rd'},
            role: {type: 'string', enum: Object.values(USER_ROLES), example: 'user'},
        }
    },
    UserUpdateRequest: {
        type: 'object',
        description: 'All fields are optional. Only the provided fields will be updated. Password cannot be updated through this endpoint.',
        properties: {
            first_name: {type: 'string', example: 'thomas'},
            last_name: {type: 'string', example: 'lopez'},
            email: {type: 'string', format: 'email', example: 'thomaslopez@example.com'},
            role: {type: 'string', enum: Object.values(USER_ROLES), example: 'user'},
        }
    },
    Product: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0'},
            title: { type: 'string', example: 'Wireless Mouse'},
            description: { type: 'string', example: 'Ergonomic wireless mouse with USB receiver'},
            price: { type: 'number', example: 19.99},
            stock: { type: 'integer', example: 100},
            state: { type: 'string', enum: Object.values(PRODUCT_STATE), example: 'in_stock'},
            category: { type: 'string', example: 'Electronics'},
            images: {
                type: 'array',
                items: { type: 'string', format: 'uri', example: 'https://example.com/images/mouse.jpg' }
            },
            createdAt: { type: 'string', format: 'date-time'},
            updatedAt: { type: 'string', format: 'date-time'},
        }
    },
    ProductCreateRequest: {
        type: 'object',
        description: "'stock' defaults to 0 if not provided. 'state' is generally calculated automatically from stock, except for the manual states pre_order and discontinued.",
        required: ['title', 'description', 'price', 'category'],
        properties: {
            title: {type: 'string', example: 'Wireless Mouse'},
            description: {type: 'string', example: 'Ergonomic wireless mouse with USB receiver'},
            price: {type: 'number', example: 19.99},
            stock: {type: 'integer', example: 100},
            state: { type: 'string', enum: Object.values(PRODUCT_STATE), example: 'in_stock'},
            category: {type: 'string', example: 'Electronics'},
            images: {
                type: 'array',
                items: { type: 'string', format: 'uri', example: 'https://example.com/images/mouse.jpg' }
            },
        }
    },
    ProductUpdateRequest: {
        type: 'object',
        description: 'All fields are optional. Only the provided fields will be updated.',
        properties: {
            title: {type: 'string', example: 'Wireless Mouse'},
            description: {type: 'string', example: 'Ergonomic wireless mouse with USB receiver'},
            price: {type: 'number', example: 19.99},
            stock: {type: 'integer', example: 100},
            state: { type: 'string', enum: Object.values(PRODUCT_STATE), example: 'in_stock'},
            category: {type: 'string', example: 'Electronics'},
            images: {
                type: 'array',
                items: { type: 'string', format: 'uri', example: 'https://example.com/images/mouse.jpg' }
            },
        }
    },
    MockUser: {
        type: 'object',
        description: 'Randomly generated fake user. Not persisted in the database, so it has no _id. Includes the plaintext password since it is only used for testing/seeding purposes.',
        properties: {
            first_name: { type: 'string', example: 'Tomas'},
            last_name: { type: 'string', example: 'Lopez'},
            email: { type: 'string', format: 'email', example: 'tomaslopez@example.com'},
            password: { type: 'string', example: 'Ax7!kdP2qz'},
            role: { type: 'string', enum: Object.values(USER_ROLES), example: 'user'},
        }
    },
    MockProduct: {
        type: 'object',
        description: 'Randomly generated fake product. Has no _id when generated but not saved (saveToDatabase: false). When saved to the database, it is returned with the fields from the Product schema (including _id, state and timestamps).',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'Only present when saveToDatabase is true'},
            title: { type: 'string', example: 'Wireless Mouse'},
            description: { type: 'string', example: 'Ergonomic wireless mouse with USB receiver'},
            price: { type: 'number', example: 19.99},
            category: { type: 'string', example: 'Electronics'},
            stock: { type: 'integer', example: 100},
            state: { type: 'string', enum: Object.values(PRODUCT_STATE), example: 'in_stock', description: 'Only present when saveToDatabase is true'},
            images: {
                oneOf: [
                    { type: 'string', format: 'uri', example: 'https://picsum.photos/640/480', description: 'When saveToDatabase is false' },
                    {
                        type: 'array',
                        items: { type: 'string', format: 'uri' },
                        example: ['https://picsum.photos/640/480'],
                        description: 'When saveToDatabase is true: Mongoose casts the single generated URL into a one-item array to match the Product model.'
                    }
                ]
            },
            createdAt: { type: 'string', format: 'date-time', description: 'Only present when saveToDatabase is true'},
            updatedAt: { type: 'string', format: 'date-time', description: 'Only present when saveToDatabase is true'},
        }
    },
    GenerateProductsRequest: {
        type: 'object',
        required: ['count'],
        properties: {
            count: { type: 'integer', minimum: 1, maximum: 999, example: 10 },
            saveToDatabase: { type: 'boolean', default: false, example: false },
        }
    },
    GenerateProductsResponse: {
        type: 'object',
        properties: {
            products: {
                type: 'array',
                items: { $ref: '#/components/schemas/MockProduct' }
            },
            message: { type: 'string', example: 'Products generated succesfully' }
        }
    },
    MockOrder: {
        type: 'object',
        description: 'Randomly generated fake order, not backed by a real DB model yet.',
        properties: {
            id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'},
            user_email: { type: 'string', format: 'email', example: 'tomaslopez@example.com'},
            products: {
                type: 'array',
                items: { type: 'string', example: 'Wireless Mouse' }
            },
            status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'created'},
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY), example: 'medium'},
            total: { type: 'string', example: '249.99'},
            created_at: { type: 'string', format: 'date-time'},
        }
    },
    MockDelivery: {
        type: 'object',
        description: 'Randomly generated fake delivery, built from a mock order, not backed by a real DB model yet.',
        properties: {
            id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'},
            order_id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'},
            courier_email: { type: 'string', format: 'email', nullable: true, example: 'courier@example.com'},
            status: { type: 'string', enum: Object.values(DELIVERY_STATUS), example: 'assigned'},
            address: { type: 'string', example: '742 Evergreen Terrace'},
            estimated_delivery: { type: 'string', format: 'date-time'},
        }
    },
    ErrorResponse: {
        type: 'object',
        description: 'Standard error format emitted by the global error handler middleware for every failed request.',
        properties: {
            status: { type: 'string', example: 'error' },
            error: { type: 'string', enum: Object.keys(ERROR_CODES), example: 'USER_NOT_FOUND', description: 'Machine-readable error code' },
            message: { type: 'string', example: 'User not found' },
        }
    },
    OrderItem: {
        type: 'object',
        properties: {
            product: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'Product ID' },
            quantity: { type: 'integer', minimum: 1, example: 2 },
        }
    },
    Order: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0'},
            user: { $ref: '#/components/schemas/User' },
            products: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        product: { $ref: '#/components/schemas/Product' },
                        quantity: { type: 'integer', example: 2 },
                    }
                }
            },
            status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'created'},
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY), example: 'medium'},
            total: { type: 'number', example: 249.98, description: 'Calculated by the server from the current product prices'},
            createdAt: { type: 'string', format: 'date-time'},
            updatedAt: { type: 'string', format: 'date-time'},
        }
    },
    OrderCreateRequest: {
        type: 'object',
        description: "'total' is not accepted here: it is calculated by the server from the current price of each product.",
        required: ['user', 'products'],
        properties: {
            user: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'User ID' },
            products: {
                type: 'array',
                minItems: 1,
                items: { $ref: '#/components/schemas/OrderItem' }
            },
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY), example: 'medium'},
        }
    },
    OrderUpdateRequest: {
        type: 'object',
        description: "All fields are optional. Only the provided fields will be updated. If 'products' is provided, 'total' is recalculated by the server.",
        properties: {
            products: {
                type: 'array',
                minItems: 1,
                items: { $ref: '#/components/schemas/OrderItem' }
            },
            status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'assigned'},
            priority: { type: 'string', enum: Object.values(ORDER_PRIORITY), example: 'high'},
        }
    },
    Delivery: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0'},
            order: { $ref: '#/components/schemas/Order' },
            courier: {
                allOf: [{ $ref: '#/components/schemas/User' }],
                nullable: true,
                description: 'Null until a courier is assigned'
            },
            status: { type: 'string', enum: Object.values(DELIVERY_STATUS), example: 'assigned'},
            address: { type: 'string', example: '742 Evergreen Terrace'},
            estimated_delivery: { type: 'string', format: 'date-time'},
            createdAt: { type: 'string', format: 'date-time'},
            updatedAt: { type: 'string', format: 'date-time'},
        },
        receipts: {
            type: 'array',
            items: { $ref: '#/components/schemas/DeliveryReceipt' }
        },
    },
    DeliveryCreateRequest: {
        type: 'object',
        required: ['order', 'address'],
        properties: {
            order: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'Order ID. Must not already have a delivery, and the order must not be cancelled.' },
            courier: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'Courier (User) ID. Optional, can be assigned later.' },
            address: { type: 'string', example: '742 Evergreen Terrace'},
            estimated_delivery: { type: 'string', format: 'date-time'},
        }
    },
    DeliveryUpdateRequest: {
        type: 'object',
        description: 'All fields are optional. Only the provided fields will be updated.',
        properties: {
            courier: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0', description: 'Courier (User) ID' },
            status: { type: 'string', enum: Object.values(DELIVERY_STATUS), example: 'in_transit'},
            address: { type: 'string', example: '742 Evergreen Terrace'},
            estimated_delivery: { type: 'string', format: 'date-time'},
        }
    },
    UserDocument: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0' },
            original_name: { type: 'string', example: 'dni_frente.jpg' },
            generated_name: { type: 'string', example: '1735689600000-dni_frente.jpg' },
            path: { type: 'string', example: 'uploads/users/1735689600000-dni_frente.jpg' },
            mimetype: { type: 'string', example: 'image/jpeg' },
            size: { type: 'integer', example: 204800, description: 'Size in bytes' },
            document_type: { type: 'string', enum: Object.values(DOCUMENT_TYPE), example: 'id_card' },
            uploaded_at: { type: 'string', format: 'date-time' },
        }
    },
    UploadUserDocumentRequest: {
        type: 'object',
        required: ['document', 'document_type'],
        properties: {
            document: { type: 'string', format: 'binary', description: 'File to upload (PDF, JPG or PNG only). Max size: 5MB.' },
            document_type: { type: 'string', enum: Object.values(DOCUMENT_TYPE), example: 'id_card' },
        }
    },
    DeliveryReceipt: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '64a2f2e5c4b4d5e6f8g8h9i0' },
            original_name: { type: 'string', example: 'remito_firmado.pdf' },
            generated_name: { type: 'string', example: '1735689600000-remito_firmado.pdf' },
            path: { type: 'string', example: 'uploads/delivery-receipts/1735689600000-remito_firmado.pdf' },
            mimetype: { type: 'string', example: 'application/pdf' },
            size: { type: 'integer', example: 512000, description: 'Size in bytes' },
            uploaded_at: { type: 'string', format: 'date-time' },
        }
    },
    UploadDeliveryReceiptRequest: {
        type: 'object',
        required: ['receipt'],
        properties: {
            receipt: { type: 'string', format: 'binary', description: 'Receipt file to upload (PDF, JPG or PNG only). Max size: 5MB.' },
        }
    },
}

const responses = {
    HealthResponse: {
        description: 'Response for health check endpoint',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Health'
                }
            }
        }
    },
    UsersGetResponse: {
        description: 'Response for listing users',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                    $ref: '#/components/schemas/User',
                    }
                }
            }
        }
    },
    UserResponse: {
        description: 'Response with a single user',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/User',
                }
            }
        }
    },
    UserCreatedResponse: {
        description: 'Response for user creation',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/User',
                }
            }
        }
    },
    UserDeletedResponse: {
        description: 'Response for user deletion',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'User deleted successfully'}
                    }
                }
            }
        }
    },
    BadRequestResponse: {
        description: 'Validation error thrown by Mongoose when the request body does not meet the schema requirements',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'VALIDATION_ERROR',
                    message: 'Validation error'
                }
            }
        }
    },
    UserNotFoundResponse: {
        description: 'No user matches the given ID',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            }
        }
    },
    InvalidIdResponse: {
        description: 'The provided ID does not have a valid format (Mongoose CastError)',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'INVALID_ID',
                    message: 'Invalid id'
                }
            }
        }
    },
    ConflictResponse: {
        description: 'A unique field (e.g. email) already exists in the database (MongoDB duplicate key error)',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'DUPLICATE_KEY',
                    message: "The field 'email' is already in use"
                }
            }
        }
    },
    ProductsGetResponse: {
        description: 'Response for listing products',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Product',
                    }
                }
            }
        }
    },
    ProductResponse: {
        description: 'Response with a single product',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Product',
                }
            }
        }
    },
    ProductCreatedResponse: {
        description: 'Response for product creation',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Product',
                }
            }
        }
    },
    ProductDeletedResponse: {
        description: 'Response for product deletion',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'Product deleted successfully'}
                    }
                }
            }
        }
    },
    ProductNotFoundResponse: {
        description: 'No product matches the given ID',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'PRODUCT_NOT_FOUND',
                    message: 'Product not found'
                }
            }
        }
    },
    InvalidMockQuantityResponse: {
        description: '"count" is missing, not a number, or out of the allowed range (1-999)',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                    status: 'error',
                    error: 'INVALID_MOCK_QUANTITY',
                    message: 'Invalid mock quantity'
                }
            }
        }
    },
    MockUsersResponse: {
        description: 'Response for a list of mock users',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/MockUser',
                    }
                }
            }
        }
    },
    MockOrdersResponse: {
        description: 'Response for a list of mock orders',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/MockOrder',
                    }
                }
            }
        }
    },
    MockDeliveriesResponse: {
        description: 'Response for a list of mock deliveries',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/MockDelivery',
                    }
                }
            }
        }
    },
    InternalServerErrorResponse: {
        description: 'Unexpected error not handled by any specific error case',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                    status: 'error',
                    error: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error'
                }
            }
        }
    },
    OrdersGetResponse: {
        description: 'Response for listing orders',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' }
                }
            }
        }
    },
    OrderResponse: {
        description: 'Response with a single order',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
            }
        }
    },
    OrderCreatedResponse: {
        description: 'Response for order creation',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
            }
        }
    },
    OrderDeletedResponse: {
        description: 'Response for order deletion',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'integer', example: 200 },
                        message: { type: 'string', example: 'Order deleted' }
                    }
                }
            }
        }
    },
    OrderNotFoundResponse: {
        description: 'No order matches the given ID',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                    status: 'error',
                    error: 'ORDER_NOT_FOUND',
                    message: 'Order not found'
                }
            }
        }
    },
    InvalidOrderStatusResponse: {
        description: "The requested operation is not valid for the order's current status (e.g. creating a delivery for a cancelled order)",
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                    status: 'error',
                    error: 'INVALID_ORDER_STATUS',
                    message: 'Cannot create a delivery for a cancelled order'
                }
            }
        }
    },
    DeliveriesGetResponse: {
        description: 'Response for listing deliveries',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Delivery' }
                }
            }
        }
    },
    DeliveryResponse: {
        description: 'Response with a single delivery',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Delivery' }
            }
        }
    },
    DeliveryCreatedResponse: {
        description: 'Response for delivery creation',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Delivery' }
            }
        }
    },
    DeliveryDeletedResponse: {
        description: 'Response for delivery deletion',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'integer', example: 200 },
                        message: { type: 'string', example: 'Delivery deleted' }
                    }
                }
            }
        }
    },
    DeliveryNotFoundResponse: {
        description: 'No delivery matches the given ID',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                    status: 'error',
                    error: 'DELIVERY_NOT_FOUND',
                    message: 'Delivery not found'
                }
            }
        }
    },
    DeliveryOrderConflictResponse: {
        description: 'The given order already has a delivery associated (MongoDB duplicate key error on the unique "order" field)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                    status: 'error',
                    error: 'DUPLICATE_KEY',
                    message: "The field 'order' is already in use"
                }
            }
        }
    },
    UserDocumentUploadedResponse: {
        description: 'Response after successfully uploading and associating a user document',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/User' }
            }
        }
    },
    DeliveryReceiptUploadedResponse: {
        description: 'Response after successfully uploading and associating a delivery receipt',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Delivery' }
            }
        }
    },
    FileRequiredResponse: {
        description: 'No file was provided in the request',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { status: 'error', error: 'FILE_REQUIRED', message: 'A file is required' }
            }
        }
    },
    InvalidFileTypeResponse: {
        description: 'The uploaded file type is not among the allowed types (PDF, JPG, PNG)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { status: 'error', error: 'INVALID_FILE_TYPE', message: 'File type not allowed' }
            }
        }
    },
    FileTooLargeResponse: {
        description: 'The uploaded file exceeds the maximum allowed size (5MB)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { status: 'error', error: 'FILE_TOO_LARGE', message: 'File exceeds the maximum allowed size' }
            }
        }
    },
    InvalidDocumentTypeResponse: {
        description: 'document_type is missing or not one of the allowed values',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { status: 'error', error: 'INVALID_DOCUMENT_TYPE', message: 'Invalid document type' }
            }
        }
    },
}

const parameters = {
    UserId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'User ID',
        schema: {
            type: 'string',
            example: '64a2f2e5c4b4d5e6f8g8h9i0'
        }
    },
    ProductId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Product ID',
        schema: {
            type: 'string',
            example: '64a2f2e5c4b4d5e6f8g8h9i0'
        }
    },
    MockCount: {
        name: 'count',
        in: 'query',
        required: false,
        description: 'Number of fake records to generate. Must be between 1 and 999. Defaults to 10 if not provided.',
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: 999,
            example: 10
        }
    },
    OrderId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Order ID',
        schema: {
            type: 'string',
            example: '64a2f2e5c4b4d5e6f8g8h9i0'
        }
    },
    DeliveryId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Delivery ID',
        schema: {
            type: 'string',
            example: '64a2f2e5c4b4d5e6f8g8h9i0'
        }
    }
}

const swaggerSpecs = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShipNow APÏ',
            version: '1.4.0',
            description: 'API para la gestion de usuarios y pedidos de ShipNow'
        },
        servers: [
            {
                url: `http://localhost:${config.PORT ?? 3000}`,
                description: 'Servidor de desarrollo'
            }
        ],
        tags: [
            {name: 'Health', description: 'Endpoint related to health checks'},
            {name: 'Users', description: 'Endpoint related to user management'},
            {name: 'Products', description: 'Endpoint related to product management'},
            {name: 'Orders', description: 'Endpoint related to order management'},
            {name: 'Deliveries', description: 'Endpoint related to delivery management'},
            {name: 'Mocks', description: 'Endpoints for generating fake/mock data for testing purposes'},
            {name: 'Debug', description: 'Internal validation tools, not business functionality'},
        ],
        components: {
            schemas,
            responses,
            parameters,
        }
    },
    apis: ['./src/docs/**/*.yaml'],
})



export default swaggerSpecs
