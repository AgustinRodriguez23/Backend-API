import ProductService from "../services/product.service.js"

class ProductController {

    static async getProducts(req, res) {
        try {
            const { page, pageSize, category } = req.query
            const products = await ProductService.getAllProducts({ page, pageSize, category })
            res.status(200).json(products)
        } catch {
            console.warn('Error getting products')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }

    static async getProductById(req, res) {
        try {
            const { id } = req.params
            const product = await ProductService.getProductById(id)
            res.status(200).json(product)
        } catch (error) {
            if (error.message === "Product not found") {
                return res.status(404).json({ statusCode: 404, message: 'Product not found' })
            }
            console.warn('Error getting product by id')
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
        }
    }
}

export default ProductController