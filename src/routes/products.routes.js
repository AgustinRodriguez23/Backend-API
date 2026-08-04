import { Router } from "express"
import ProductController from "../controllers/product.controller.js"

const router = Router()

router.get("/", ProductController.getProducts)

router.get("/:id", ProductController.getProductById)

router.post("/", ProductController.createProduct)

router.patch("/:id", ProductController.updateProduct)

router.delete("/:id", ProductController.deleteProduct)

export default router