import { Router } from "express"
import OrderController from "../controllers/order.controller.js"

const router = Router()

router.get("/", OrderController.getOrders)

router.get("/:id", OrderController.getOrderById)

router.post("/", OrderController.createOrder)

router.patch("/:id", OrderController.updateOrder)

router.delete("/:id", OrderController.deleteOrder)

export default router
