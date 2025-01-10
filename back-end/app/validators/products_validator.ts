import vine from '@vinejs/vine'

/**
 * Validates the product creation data.
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    image: vine.string().optional(),
    description: vine.string().trim().optional(),
    category: vine.string(),
  })
)

/**
 * Validates the product update data.
 */
export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    image: vine.string().optional(),
    description: vine.string().trim().optional(),
    category: vine.string().optional(),
  })
)

/**
 * Validates the product ID.
 */
export const productIdValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
