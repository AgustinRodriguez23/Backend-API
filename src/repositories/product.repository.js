import ProductModel from "../models/product.model.js"

class ProductRepository {
    static #defaultProjection = "-__v"

    static async find(filter = {}, options = {}) {
        const {
            projection = ProductRepository.#defaultProjection,
            sort = { createdAt: -1 },
            limit,
            skip
        } = options

        const query = ProductModel.find(filter, projection).sort(sort)

        if (limit) query.limit(limit)
        if (skip) query.skip(skip)

        return await query.exec()
    }

    static async findById(id) {
        return await ProductModel.findOne(
            { _id: id },
            ProductRepository.#defaultProjection
        )
    }

    static async create(data) {
        const product = new ProductModel(data)
        return await product.save()
    }

    static async findByIdAndUpdate(id, data) {
        const product = await ProductModel.findById(id)
        if (!product) return null

        Object.assign(product, data)
        return await product.save()
    }

    static async findByIdAndDelete(id) {
        return await ProductModel.findOneAndDelete({ _id: id })
    }
}

export default ProductRepository