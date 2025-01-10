import { HttpContext } from '@adonisjs/core/http'
import { createReview, getReviewsByProductId } from '#services/reviews_service'

export default class ReviewsController {
  public async create({ request, response, params, auth }: HttpContext) {
    const data = request.only(['rating', 'comment'])
    const userId = auth.user?.id

    if (!userId) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const review = await createReview({
      ...data,
      productId: params.id,
      userId: userId,
    })

    return response.created({
      message: 'Review created successfully.',
      review,
    })
  }

  public async getByProduct({ params, response }: HttpContext) {
    const reviews = await getReviewsByProductId(params.id)
    return response.ok(reviews)
  }
}
