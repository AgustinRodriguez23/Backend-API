import swaggerJSDoc from "swagger-jsdoc"
import { config } from "./env.config.js"

import { USER_ROLES, PRODUCT_STATE, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from "../utils/constants.js"

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
        }
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
            count: {type: 'integer', minimum: 1, maximum: 999, example: 10},
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
    }
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
        description: 'Bad request',
        content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                    message: {type: 'string', example: 'Invalid request data'}
                    }
                }
            }
        }  
    },
    UserNotFoundResponse: {
        description: 'User not found',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'User not found'}
                    }
                }
            }
        }
    },
    ConflictResponse: {
        description: 'Conflict, the email address is already registered',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'Email already registered'}
                    }
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
        description: 'Product not found',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'Product not found'}
                    }
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
