import UserRepository from "../repositories/user.repository.js"

class UserService {
    static async getAll({ page = 1, pageSize = 20, role } = {}) {
        const filter = {}
        if (role) filter.role = role

        return await UserRepository.find(filter, {
            limit: pageSize,
            skip: (page - 1) * pageSize
        })
    }

    static async getById(id) {
        const user = await UserRepository.findById(id)
        if (!user) {
            throw new Error("User not found")
        }
        return user
    }
}

export default UserService