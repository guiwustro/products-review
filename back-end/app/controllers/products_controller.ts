import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '#services/products_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  public async getAll({ response }: HttpContext) {
    const products = await getAllProducts()
    return response.ok(products)
  }

  public async create({ request, response }: HttpContext) {
    const data = request.all()
    const product = await createProduct(data)
    return response.created({
      message: 'Product created successfully.',
      product,
    })
  }

  public async getById({ params, response }: HttpContext) {
    const product = await getProductById(params.id)
    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }
    return response.ok(product)
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.all()
    const product = await updateProduct(params.id, data)
    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }
    return response.ok({
      message: 'Product updated successfully.',
      product,
    })
  }

  public async delete({ params, response }: HttpContext) {
    const success = await deleteProduct(params.id)
    if (!success) {
      return response.notFound({ message: 'Product not found' })
    }
    return response.ok({ message: 'Product deleted successfully.' })
  }
}
