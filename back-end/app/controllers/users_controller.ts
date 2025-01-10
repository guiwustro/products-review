import type { HttpContext } from '@adonisjs/core/http'

import { loginUser, registerUser } from '#services/users_service'

export default class UserController {
  public async register({ request, response }: HttpContext) {
    const data = request.all()
    const user = await registerUser(data)

    return response.created({
      message: 'User registered successfully.',
      user,
    })
  }

  /**
   * Login a user and return a token.
   */
  public async login({ request, response }: HttpContext) {
    const data = request.all()
    const { token, user } = await loginUser(data)

    return response.ok({
      message: 'Login successful',
      token,
      user,
    })
  }
}
