import ProductRepository from "../repositories/product.repository.js";

import { PRODUCT_STATE } from "../utils/constants.js";

class ProductService {

    static async getAllProducts({ page = 1, pageSize = 20, category } = {}) {
        const filter = {
            state: { $ne: PRODUCT_STATE.OUT_OF_STOCK }
        }
        if (category) filter.category = category

        return await ProductRepository.find(filter, {
            limit: pageSize,
            skip: (page - 1) * pageSize
        })
    }

    static async getProductById(id) {
        const product = await ProductRepository.findById(id)
        if (!product) {
            throw new Error("Product not found")
        }
        return product
    }
}

export default ProductService