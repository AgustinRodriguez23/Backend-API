import { Router } from "express"
import DeliveryController from "../controllers/delivery.controller.js"

const router = Router()

router.get("/", DeliveryController.getDeliveries)

router.get("/:id", DeliveryController.getDeliveryById)

router.post("/", DeliveryController.createDelivery)

router.patch("/:id", DeliveryController.updateDelivery)

router.delete("/:id", DeliveryController.deleteDelivery)

export default router
