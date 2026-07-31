import { Router } from "express"
import UserController from "../controllers/user.controller.js"

const router = Router()

router.get("/", UserController.getUsers)

router.get("/:id", UserController.getUserById)

router.post("/", (req, res) => {
    const { name, email } = req.body
    res.send(`User created: ${name}, ${email}`)
})

router.patch("/:id", (req, res) => {
    const { id } = req.params
    const { name, email } = req.body
    res.send(`User updated: ID ${id}, Name: ${name}, Email: ${email}`)
})

router.delete("/:id", (req, res) => {
    const { id } = req.params
    res.send(`User deleted: ID ${id}`)
})

export default router