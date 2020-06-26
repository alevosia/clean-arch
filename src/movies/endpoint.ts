import { MovieList } from './movie-list'
import {
    HTTPRequest,
    HTTPResponse,
    HTTPRequestHandler,
    HTTPRequestHandlerParams
} from '../types/http'
import makeMovie from './movie'
import makeHttpError from '../helpers/http-error'
import { DEFAULT_RESPONSE_HEADERS } from './config'

export default function makeMoviesEndpointHandler({ movieList }: Params): HTTPRequestHandler {
    return async function handle({ httpRequest }: HTTPRequestHandlerParams): Promise<HTTPResponse> {
        switch (httpRequest.method) {
            case 'GET':
                return getMovies(httpRequest)
            case 'POST':
                return addMovie(httpRequest)
            case 'DELETE':
                return deleteMovie(httpRequest)
            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: 'Method Not Allowed'
                })
        }
    }

    async function getMovies(request: HTTPRequest): Promise<HTTPResponse> {
        const { id } = request.pathParams
        const { limit } = request.queryParams

        try {
            const result = id
                ? await movieList.findById({ movieId: id })
                : await movieList.getItems({ limit })

            if (!result) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: 'Movie not found.'
                })
            }

            return {
                headers: DEFAULT_RESPONSE_HEADERS,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        } catch (err) {
            return makeHttpError({
                statusCode: 404,
                errorMessage: 'Movie not found.'
            })
        }
    }

    async function addMovie(request: HTTPRequest): Promise<HTTPResponse> {
        let movieInfo = request.body

        if (!movieInfo) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad request. No POST body.'
            })
        }

        // if POST body is a string, try to parse to JSON
        if (typeof movieInfo === 'string') {
            try {
                movieInfo = JSON.parse(movieInfo)
            } catch {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })
            }
        }

        try {
            const movie = makeMovie({ movieInfo })
            const result = await movieList.addItem(movie)

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
                statusCode: 400,
                errorMessage: error.message
            })
        }
    }

    async function deleteMovie(request: HTTPRequest): Promise<HTTPResponse> {
        const { id } = request.pathParams

        // The request must have an id parameter
        if (!id) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad request. DELETE request must have an Id parameter.'
            })
        }

        try {
            const result = await movieList.removeItem({ movieId: id })

            if (!result.success) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: 'Movie not found.'
                })
            }

            return {
                headers: DEFAULT_RESPONSE_HEADERS,
                statusCode: 200,
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

export interface Params {
    movieList: MovieList
}
