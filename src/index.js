import express from "express"

import { config } from "./config/env.config.js"
import { connectDB } from "./config/db.js"
import logger from "./config/logger.js"

import { errorHandler, notFoundRoute } from "./middlewares/error-handler.middleware.js"

import usersRoutes from "./routes/users.routes.js"
import productsRoutes from "./routes/products.routes.js"
import mocksRoutes from "./mocks/routes/mock.routes.js"


const app = express()

app.use(express.json())
app.use("/api/users", usersRoutes)
app.use("/api/products", productsRoutes)

if (config.NODE_ENV !== 'production') {
    app.use("/api/mocks", mocksRoutes)
}

app.get("/", (req, res) =>{
    res.send("landing")
})

app.get("/logger-test", (req, res) =>{
    logger.debug('Debug log')
    logger.http('HTTP log')
    logger.info('Info log')
    logger.warn('Warning log')
    logger.error('Error log')
    logger.fatal('Fatal log')

    res.send('Logger test completed.')
})

app.use(notFoundRoute)
app.use(errorHandler)

connectDB()

app.listen(config.PORT, ()=>{
    logger.info(`Server is running on port ${config.PORT}`)
})