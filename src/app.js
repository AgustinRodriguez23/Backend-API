import express from "express"
import swaggerUi from "swagger-ui-express"

import { config } from "./config/env.config.js"
import logger from "./config/logger.js"
import swaggerSpecs from "./config/swagger.js"

import { errorHandler, notFoundRoute } from "./middlewares/error-handler.middleware.js"

import usersRoutes from "./routes/users.routes.js"
import productsRoutes from "./routes/products.routes.js"
import ordersRoutes from "./routes/orders.routes.js"
import deliveriesRoutes from "./routes/deliveries.routes.js"

const app = express()

app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use("/api/users", usersRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/deliveries", deliveriesRoutes)

app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    })
})

if (config.NODE_ENV !== 'production') {
    const { default: mocksRoutes } = await import("./mocks/routes/mock.routes.js")
    app.use("/api/mocks", mocksRoutes)

    app.get("/logger-test", (req, res) => {
        logger.debug('Debug log')
        logger.http('HTTP log')
        logger.info('Info log')
        logger.warn('Warning log')
        logger.error('Error log')
        logger.fatal('Fatal log')
        res.send('Logger test completed.')
    })
}


app.use(notFoundRoute)
app.use(errorHandler)

export default app