import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { createUserValidator, loginValidator } from '#validators/users_validator'
import { Exception } from '@adonisjs/core/exceptions'

/**
 * Service to handle user registration.
 */
export async function registerUser(data: Record<string, any>) {
  const payload = await createUserValidator.validate(data)

  const alreadyExistUser = await User.findBy('email', payload.email)

  if (alreadyExistUser) {
    throw new Exception('E-mail already registered', { status: 409 })
  }

  const user = await User.create({
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
  })

  return user
}

/**
 * Service to handle user login.
 */
export async function loginUser(data: Record<string, any>) {
  const payload = await loginValidator.validate(data)

  const user = await User.query().preload('reviews').where('email', payload.email).first()

  if (!user || !(await hash.verify(user.password, payload.password))) {
    throw new Exception('Invalid credentials', { status: 401 })
  }

  const token = await User.accessTokens.create(user)

  return { user, token }
}
