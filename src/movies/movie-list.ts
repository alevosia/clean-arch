import mongoose, { Model } from 'mongoose'
import { IMovie } from '../db/models/movie'
import { Movie } from '../types/movie'
import makeMovie from './movie'
import { DEFAULT_GET_ITEMS_LIMIT } from './config'

// The Use Cases / Application Business Rules
// No dependency on the web or any UI
export default function makeMovieList({ movieModel }: MakeMovieListParams): MovieList {
    return Object.freeze({
        findById,
        getItems,
        addItem,
        removeItem
    })

    async function findById({ movieId }: FindByIdParams): Promise<Movie | null> {
        const found = await movieModel.findById(movieId)

        if (found) {
            return documentToMovie(found)
        }

        return null
    }

    async function getItems({ limit = DEFAULT_GET_ITEMS_LIMIT }: GetItemsParams): Promise<Movie[]> {
        const results = await movieModel.find().limit(limit)

        return results.map(documentToMovie)
    }

    async function addItem(movie: Movie): Promise<AddItemResult> {
        const _id = mongoose.Types.ObjectId()
        const created = await movieModel.create({ _id, ...movie })
        return {
            success: true,
            created: documentToMovie(created)
        }
    }

    async function removeItem({ movieId }: RemoveItemParams): Promise<RemoveItemResult> {
        console.log(movieId)
        const deleted = await movieModel.findByIdAndDelete(movieId)
        console.log('AFTER')
        if (deleted) {
            return {
                success: true,
                deleted: documentToMovie(deleted)
            }
        }

        return {
            success: false
        }
    }

    // convert mongoose document to our Movie entity
    function documentToMovie({ _id, title, plot, releasedAt }: IMovie) {
        return makeMovie({ movieInfo: { id: _id.toHexString(), title, plot, releasedAt } })
    }
}

export interface MakeMovieListParams {
    movieModel: Model<IMovie>
}

export interface MovieList {
    findById(params: FindByIdParams): Promise<Movie | null>
    getItems(params: GetItemsParams): Promise<Movie[]>
    addItem(params: AddItemParams): Promise<AddItemResult>
    removeItem(params: RemoveItemParams): Promise<RemoveItemResult>
}

export interface FindByIdParams {
    movieId: string
}

export interface GetItemsParams {
    limit?: number
}

export interface AddItemParams {
    title: string
    plot: string
    releasedAt: Date
}

export interface RemoveItemParams {
    movieId: string
}

export interface AddItemResult {
    success: boolean
    created: Movie
    errorMessage?: string
}

export interface RemoveItemResult {
    success: boolean
    deleted?: Movie
}
