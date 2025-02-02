import Review from '#models/reviews'

/**
 * Create a review for a product.
 */
export async function createReview(data: Record<string, any>) {
  const review = await Review.create(data)
  return review
}

/**
 * Fetch all reviews for a product.
 */
export async function getReviewsByProductId(productId: number) {
  const reviews = await Review.query().where('product_id', productId).preload('user')

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)

  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

  return { reviews, averageRating }
}
