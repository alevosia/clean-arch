import Review from '../db/models/review'
import Movie from '../db/models/movie'
import makeReviewList from './review-list'
import makeReviewsEndpointHandler from './endpoint'

const reviewList = makeReviewList({ reviewModel: Review, movieModel: Movie })
const reviewsEndpointHandler = makeReviewsEndpointHandler({ reviewList })

export default reviewsEndpointHandler
