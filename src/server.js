import app from "./app.js"
import { config } from "./config/env.config.js"
import { connectDB } from "./config/db.js"
import logger from "./config/logger.js"

connectDB()

app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`)
})