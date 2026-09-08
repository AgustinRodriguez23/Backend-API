import ProductRepository from "../repositories/product.repository.js";
import CustomError from "../errors/custom.error.js";

import { PRODUCT_STATE } from "../utils/constants.js";
import { normalizePagination } from "../utils/pagination.js"

class ProductService {

    static async getAllProducts({ page, pageSize, category } = {}) {
        const { pageSize: safePageSize, skip } = normalizePagination({ page, pageSize })

        const filter = { state: { $ne: PRODUCT_STATE.OUT_OF_STOCK } }
        if (category) filter.category = category

        return await ProductRepository.find(filter, { limit: safePageSize, skip })
    }

    static async getProductById(id) {
        const product = await ProductRepository.findById(id)
        if (!product) {
            throw new CustomError('PRODUCT_NOT_FOUND')
        }
        return product
    }

    static async createProduct(data) {
        return await ProductRepository.create(data)
    }

    static async updateProduct(id, data) {
        const product = await ProductRepository.findByIdAndUpdate(id, data)
        if (!product) {
            throw new CustomError('PRODUCT_NOT_FOUND')
        }
        return product
    }

    static async deleteProduct(id) {
        const product = await ProductRepository.findByIdAndDelete(id)
        if (!product) {
            throw new CustomError('PRODUCT_NOT_FOUND')
        }
        return product
    }
}

export default ProductService