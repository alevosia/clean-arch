import { Review } from '../types/review'

interface Params {
    reviewInfo: any
}

// TODO??: Find better solution for requiring parameters
// TODO: Use type 'any' for reviewInfo since it's still not yet validated
// and it could be anything?
export default function makeReview({ reviewInfo }: Params): Review {
    const validReview = validateReview(reviewInfo)

    return validReview

    function validateReview({
        content,
        authorName,
        authorEmail,
        movieId,
        ...otherReviewInfo
    }: Review): Review {
        // content
        if (content == null) {
            throw new Error('Review content is required.')
        }
        if (typeof content !== 'string') {
            throw new Error('Review content must be of type string.')
        }
        if (content.length < 3) {
            throw new Error('Review content must be at least 3 characters long.')
        }

        // authorName
        if (authorName == null) {
            throw new Error('Review authorName is required.')
        }
        if (typeof authorName !== 'string') {
            throw new Error('Review authorName must be of type string.')
        }
        if (authorName.length === 0) {
            throw new Error('Review authorName must not be empty.')
        }

        // authorEmail
        if (authorEmail == null) {
            throw new Error('Review authorEmail is required.')
        }
        if (typeof authorEmail !== 'string') {
            throw new Error('Review authorEmail must be of type string.')
        }
        if (authorEmail.length === 0) {
            throw new Error('Review authorEmail must not be empty')
        }

        // movieId
        if (movieId == null) {
            throw new Error('Review movieId is required.')
        }
        if (typeof movieId !== 'string') {
            throw new Error('Review movieId must be of type string.')
        }
        if (movieId.length === 0) {
            throw new Error('Review movieId must not be empty.')
        }

        return { ...otherReviewInfo, content, authorName, authorEmail, movieId, approved: false }
    }
}
