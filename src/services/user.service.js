import bcrypt from "bcrypt"

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

    static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    return await UserRepository.create({ ...userData, password: hashedPassword })
    }

    static async update(id, userData) {
        const updatedUser = await UserRepository.updateById(id, userData)
        if (!updatedUser) {
            throw new Error("User not found")
        }
        return updatedUser
    }

    static async remove(id) {
        const deletedUser = await UserRepository.deleteById(id)
        if (!deletedUser) {
            throw new Error("User not found")
        }
        return deletedUser
    }
}

export default UserService