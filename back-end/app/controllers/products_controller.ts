import cloudinary from '#config/cloudinary'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '#services/products_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import type { HttpContext } from '@adonisjs/core/http'
import { UploadApiResponse } from 'cloudinary'

export default class ProductsController {
  public async getAll({ response }: HttpContext) {
    const products = await getAllProducts()
    return response.ok(products)
  }

  public async create({ request, response }: HttpContext) {
    const data = request.all()
    const image = request.file('image')

    if (image) {
      try {
        const uploadResponse = await this.uploadImageToCloudinary(image)
        data.image = uploadResponse?.secure_url
      } catch (error) {
        return response.status(500).send({
          message: 'Failed to upload image to Cloudinary.',
          error: error.message,
        })
      }
    }

    const product = await createProduct(data)
    return response.created({
      message: 'Product created successfully.',
      product,
    })
  }

  private async uploadImageToCloudinary(
    image: MultipartFile
  ): Promise<UploadApiResponse | undefined> {
    const filePath = image.filePath || image.tmpPath

    if (filePath) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
    }
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
