import { Model } from 'mongoose'
import { IReview } from '../db/models/review'
import { IMovie } from '../db/models/movie'
import { Review } from '../types/review'
import makeReview from './review'
import { DEFAULT_GET_ITEMS_LIMIT } from './config'

// The Use Cases / Application Business Rules
// No dependency on the web
export default function makeReviewList({
    reviewModel,
    movieModel
}: MakeReviewListParams): ReviewList {
    return {
        findById,
        getItems,
        addItem
    }

    async function findById({ reviewId }: FindByIdParams): Promise<Review | null> {
        const found = await reviewModel.findById(reviewId)

        if (found) {
            return documentToReview(found)
        }

        return null
    }

    async function getItems({
        limit = DEFAULT_GET_ITEMS_LIMIT
    }: GetItemsParams): Promise<Review[]> {
        const items = await reviewModel.find().limit(limit)

        return items.map(documentToReview)
    }

    async function addItem({
        review: { movieId, ...otherMovieInfo }
    }: AddItemParams): Promise<AddItemResult> {
        const movieFound = await movieModel.findById(movieId)

        if (!movieFound) {
            return {
                success: false,
                errorMessage: 'Movie does not exist.'
            }
        }

        const created = await reviewModel.create({
            movie: movieFound._id,
            ...otherMovieInfo
        })

        return {
            success: true,
            created: documentToReview(created)
        }
    }

    function documentToReview({
        _id,
        content,
        authorName,
        authorEmail,
        approved,
        createdAt,
        movie
    }: IReview) {
        return makeReview({
            reviewInfo: {
                id: _id.toHexString(),
                content,
                authorName,
                authorEmail,
                approved,
                createdAt,
                movieId: movie.toHexString()
            }
        })
    }
}

export interface MakeReviewListParams {
    reviewModel: Model<IReview>
    movieModel: Model<IMovie>
}

export interface ReviewList {
    findById(params: FindByIdParams): Promise<Review | null>
    getItems(params: GetItemsParams): Promise<Review[]>
    addItem(params: AddItemParams): Promise<AddItemResult>
}

export interface FindByIdParams {
    reviewId: string
}

export interface GetItemsParams {
    limit: number
}

export interface AddItemParams {
    review: Review
}

export interface AddItemResult {
    success: boolean
    created?: Review
    errorMessage?: string
}
