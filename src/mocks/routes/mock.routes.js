import { Router } from "express"
import MockController from "../controllers/mock.controller.js"

const router = Router()

router.get("/mocking-users", MockController.mockingUsers)

router.post("/generate-products", MockController.generateProducts)

router.get("/mocking-orders", MockController.mockingOrders)

router.get("/mocking-deliveries", MockController.mockingDeliveries)

export default router