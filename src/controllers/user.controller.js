import CustomError from "../errors/custom.error.js"
import UserService from "../services/user.service.js"

import logger from "../config/logger.js"
import { deleteFileIfExists } from "../utils/file.utils.js"
import { DOCUMENT_TYPE } from "../utils/constants.js"

class UserController {

    static async getUsers(req, res, next) {
        try {
            const { page, pageSize, role } = req.query
            const users = await UserService.getAll({ page, pageSize, role })
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params
            const user = await UserService.getById(id)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async createUser(req, res, next) {
        try {
            const { first_name, last_name, email, password } = req.body

            if (!first_name || !last_name || !email || !password) {
                throw new CustomError('VALIDATION_ERROR', 'Missing required fields')
            }

            const newUser = await UserService.create(req.body)
            res.status(201).json(newUser)
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params
            const updatedUser = await UserService.update(id, req.body)
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params
            await UserService.remove(id)
            res.status(200).json({ statusCode: 200, message: 'User deleted' })
        } catch (error) {
            next(error)
        }
    }

    static async uploadUserDocument(req, res, next) {
        try {
            const { id } = req.params
            const { document_type } = req.body

            if (!Object.values(DOCUMENT_TYPE).includes(document_type)) {
                throw new CustomError('INVALID_DOCUMENT_TYPE')
            }

            const documentData = {
                original_name: req.file.originalname,
                generated_name: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size,
                document_type,
                uploaded_at: new Date()
            }

            const updatedUser = await UserService.addDocument(id, documentData)

            logger.info(`Document (${document_type}) uploaded successfully for user ${id}`)
            res.status(201).json(updatedUser)
        } catch (error) {
            if (req.file) await deleteFileIfExists(req.file.path)
            next(error)
        }
    }
}

export default UserController