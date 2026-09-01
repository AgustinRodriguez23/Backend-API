import { Router } from "express"
import UserController from "../controllers/user.controller.js"

import { handleUserDocumentUpload } from "../middlewares/upload.middleware.js"

const router = Router()

router.get("/", UserController.getUsers)

router.get("/:id", UserController.getUserById)

router.post("/", UserController.createUser)

router.post("/:id/documents", handleUserDocumentUpload, UserController.uploadUserDocument)

router.patch("/:id", UserController.updateUser)

router.delete("/:id", UserController.deleteUser)

export default router