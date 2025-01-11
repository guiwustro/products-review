import Product from '#models/product'
import {
  createProductValidator,
  productIdValidator,
  updateProductValidator,
} from '#validators/products_validator'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Fetch all products.
 */
export async function getAllProducts() {
  return await Product.all()
}

/**
 * Create a new product.
 */
export async function createProduct(data: Record<string, any>) {
  // Validação dos dados
  const payload = await createProductValidator.validate(data)

  const product = await Product.create(payload)

  return product
}
/**
 * Fetch a product by ID.
 */
export async function getProductById(id: number) {
  await productIdValidator.validate({ id })

  return await Product.find(id)
}

/**
 * Update a product.
 */
export async function updateProduct(id: number, data: Record<string, any>) {
  await productIdValidator.validate({ id })
  const payload = await updateProductValidator.validate(data)

  const product = await Product.find(id)
  if (!product) {
    return null
  }

  product.merge(payload)
  await product.save()
  return product
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: number) {
  await productIdValidator.validate({ id })

  const product = await Product.find(id)
  if (!product) {
    return false
  }
  await product.delete()
  return true
}
