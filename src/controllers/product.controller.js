import ProductService from "../services/product.service.js"

class ProductController {

    static async getProducts(req, res, next) {
        try {
            const { page, pageSize, category } = req.query
            const products = await ProductService.getAllProducts({ page, pageSize, category })
            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    static async getProductById(req, res, next) {
        try {
            const { id } = req.params
            const product = await ProductService.getProductById(id)
            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async createProduct(req, res, next) {
        try {
            const product = await ProductService.createProduct(req.body)
            res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params
            const product = await ProductService.updateProduct(id, req.body)
            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params
            await ProductService.deleteProduct(id)
            res.status(200).json({ statusCode: 200, message: 'Product deleted' })
        } catch (error) {
            next(error)
        }
    }
}

export default ProductController