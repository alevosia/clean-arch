import {
    HTTPRequest,
    HTTPRequestHandler,
    HTTPResponse,
    HTTPRequestHandlerParams
} from '../types/http'
import { ReviewList } from './review-list'
import makeReview from './review'
import makeHttpError from '../helpers/http-error'
import { DEFAULT_RESPONSE_HEADERS } from '../movies/config'

interface Params {
    reviewList: ReviewList
}

export default function makeReviewsEndpointHandler({ reviewList }: Params): HTTPRequestHandler {
    return async function handleRequest({
        httpRequest
    }: HTTPRequestHandlerParams): Promise<HTTPResponse> {
        switch (httpRequest.method) {
            case 'GET':
                return getReviews(httpRequest)
            case 'POST':
                return addReview(httpRequest)
            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: 'Method Not Allowed'
                })
        }
    }

    async function getReviews(request: HTTPRequest): Promise<HTTPResponse> {
        const { id } = request.pathParams
        const { limit } = request.queryParams

        try {
            const reviews = id
                ? await reviewList.findById({ reviewId: id })
                : await reviewList.getItems({ limit })

            console.log(reviews)

            if (!reviews) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: 'Review not found.'
                })
            }

            return {
                headers: DEFAULT_RESPONSE_HEADERS,
                statusCode: 200,
                data: JSON.stringify(reviews)
            }
        } catch (error) {
            return makeHttpError({
                statusCode: 404,
                errorMessage: 'Review not found.'
            })
        }
    }

    async function addReview(request: HTTPRequest): Promise<HTTPResponse> {
        let reviewInfo = request.body

        if (!reviewInfo) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad request. No POST body.'
            })
        }

        // if POST body is a string, try to parse to JSON
        if (typeof reviewInfo === 'string') {
            try {
                reviewInfo = JSON.parse(reviewInfo)
            } catch (error) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })
            }
        }

        console.log(reviewInfo)

        try {
            const review = makeReview({ reviewInfo })
            const result = await reviewList.addItem({ review })

            if (!result.success) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: result.errorMessage
                })
            }
            return {
                headers: DEFAULT_RESPONSE_HEADERS,
                statusCode: 201,
                data: JSON.stringify(result)
            }
        } catch (error) {
            return makeHttpError({
                statusCode: 404,
                errorMessage: 'Movie not found.'
            })
        }
    }
}
