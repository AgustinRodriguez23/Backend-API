import UserService from "../services/user.service.js"

class UserController {

    static async getUsers(req, res) {
        try {
            const { page, pageSize, role } = req.query
            const users = await UserService.getAll({ page, pageSize, role })
            res.status(200).json(users)
        } catch {
            console.warn('Error getting users')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.getById(id)
            res.status(200).json(user)
        } catch (error) {
            if (error.message === "User not found") {
                return res.status(404).json({ statusCode: 404, message: 'User not found' })
            }
            console.warn('Error getting user by id')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }

   static async createUser(req, res) {
        try {
            const { first_name, last_name, email, password } = req.body

            if (!first_name || !last_name || !email || !password) {
                return res.status(400).json({ statusCode: 400, message: 'Missing required fields' })
            }

            const newUser = await UserService.create(req.body)
            res.status(201).json(newUser)
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ statusCode: 409, message: 'Email already registered' })
            }
            console.warn('Error creating user')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }

   static async updateUser(req, res) {
        try {
            const { id } = req.params
            const { first_name, last_name, email, role } = req.body

            const updatedUser = await UserService.update(id, req.body)
            res.status(200).json(updatedUser)
        } catch (error) {
            if (error.message === "User not found") {
                return res.status(404).json({ statusCode: 404, message: 'User not found' })
            }
            console.warn('Error updating user')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }

     static async deleteUser(req, res) {
        try {
            const { id } = req.params
            await UserService.remove(id)
            res.status(200).json({ statusCode: 200, message: 'User deleted' })
        } catch (error) {
            if (error.message === "User not found") {
                return res.status(404).json({ statusCode: 404, message: 'User not found' })
            }
            console.warn('Error deleting user')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }
}

export default UserController