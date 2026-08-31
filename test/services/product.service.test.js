import { expect } from "chai"
import ProductService from "../../src/services/product.service.js"
import MockService from "../../src/mocks/services/mock.service.js"

describe("test unitario sobre Product Service", function (){

    before(function(){
        this.mockProduct = MockService.generateMockProducts(1)[0]
    })

    it("Obtener todos los productos de la db", async function(){
        const products = await ProductService.getAllProducts()
        expect(products).to.be.an("array")
    })

    it("Crear producto", async function(){
        const product = await ProductService.createProduct(this.mockProduct)
        expect(product).to.have.property("_id")
        this.createdProduct = product
    })

    it("Obtener producto por su id", async function(){
        const product = await ProductService.getProductById(this.createdProduct._id)
        expect(product).to.be.an("object").and.to.have.property("_id")
    })

    it("Actualizar producto", async function(){
        const updatedData = { title: "Producto actualizado", price: 199.99 }
        const product = await ProductService.updateProduct(this.createdProduct._id, updatedData)
        expect(product).to.be.an("object").and.to.have.property("_id")
        expect(product.title).to.equal(updatedData.title)
    })

    it("Eliminar producto", async function(){
        const product = await ProductService.deleteProduct(this.createdProduct._id)
        expect(product).to.be.an("object").and.to.have.property("_id")
    })
})
