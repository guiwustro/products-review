import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdmin {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const user = await ctx.auth.authenticate()

      if (!user.isAdmin) {
        return ctx.response.unauthorized(
          'You do not have the necessary permissions to perform this action.'
        )
      }

      await next()
    } catch (error) {
      return ctx.response.unauthorized('You must be logged in to perform this action.')
    }
  }
}
