import UserService from "../services/user.service.js"


class UserController {

    static async getUsers(req, res) {
        try {
            const users = await UserService.getAll()
            res.status(200).json(users)
        } catch {
            console.warn('Error getting users')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error'})
        }   
    }
}

export default UserController