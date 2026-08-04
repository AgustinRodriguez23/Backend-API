import UserModel from "../models/user.model.js"

class UserRepository {
    static #defaultProjection = "-password -__v"

    static async find(filter = {}, options = {}) {
        const {
            projection = UserRepository.#defaultProjection,
            sort = { createdAt: -1 },
            limit,
            skip
        } = options

        const query = UserModel.find(filter, projection).sort(sort)

        if (limit) query.limit(limit)
        if (skip) query.skip(skip)

        return await query.exec()
    }

    static async findById(id) {
        return await UserModel.findOne(
            { _id: id },
            UserRepository.#defaultProjection
        )
    }

    static async create(userData) {
        const user = await UserModel.create(userData)
        const { password, __v, ...userWithoutSensitiveData } = user.toObject()
        return userWithoutSensitiveData
    }

    static async updateById(id, userData) {
        return await UserModel.findByIdAndUpdate(
            id,
            userData,
            { new: true, runValidators: true }
        ).select(UserRepository.#defaultProjection)
    }

     static async deleteById(id) {
        return await UserModel.findByIdAndDelete(id)
    }
}

export default UserRepository