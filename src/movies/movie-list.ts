import mongoose, { Model } from 'mongoose'
import { IMovie } from '../db/models/movie'
import { Movie } from '../types/movie'
import makeMovie from './movie'
import { DEFAULT_GET_ITEMS_LIMIT } from './config'

// kinda like a repository
export default function makeMovieList({ movieModel }: MakeMovieListParams): MovieList {
    return Object.freeze({
        findById,
        getItems,
        addItem
    })

    async function findById({ movieId }: GetItemParams): Promise<Movie | null> {
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
        const result = await movieModel.create({ _id, ...movie })
        return {
            success: true,
            created: documentToMovie(result)
        }
    }

    function documentToMovie({ _id, title, plot, releasedAt }: IMovie) {
        return makeMovie({ id: _id.toHexString(), title, plot, releasedAt })
    }
}

interface MakeMovieListParams {
    movieModel: Model<IMovie>
}

interface GetItemParams {
    movieId: string
}

interface GetItemsParams {
    limit?: number
}

interface AddItemParams {
    title: string
    plot: string
    releasedAt: Date
}

export interface MovieList {
    findById(params: GetItemParams): Promise<Movie | null>
    getItems(params: GetItemsParams): Promise<Movie[]>
    addItem(params: AddItemParams): Promise<AddItemResult>
}

export interface AddItemResult {
    success: boolean
    created: Movie
}
