import express from "express"

import { config } from "./config/config.js"
import { connectDB } from "./config/db.js"

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

connectDB()

app.listen(config.PORT, ()=>{
    console.log(`Server is running on port ${config.PORT}`)
})