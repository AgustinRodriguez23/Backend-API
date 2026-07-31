import express from "express"

import { config } from "./config/config.js"
import { connectDB } from "./config/db.js"

import usersRoutes from "./routes/users.routes.js"
import productsRoutes from "./routes/products.routes.js"

const app = express()

app.use(express.json())
app.use("/api/users", usersRoutes)
app.use("/api/products", productsRoutes)

app.get("/", (req, res) =>{
    res.send("landing")
})

connectDB()

app.listen(config.PORT, ()=>{
    console.log(`Server is running on port ${config.PORT}`)
})