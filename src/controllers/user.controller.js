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
}

export default UserController