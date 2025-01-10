import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(6),
    email: vine.string().email(),
    password: vine.string().trim(),
  })
)

/**
 * Validates the post's update action
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().trim(),
  })
)
