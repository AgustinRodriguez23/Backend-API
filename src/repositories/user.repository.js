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
}

export default UserRepository