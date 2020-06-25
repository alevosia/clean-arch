import { MovieList } from './movie-list'
import { HTTPRequest, HTTPResponse, HTTPRequestHandler } from '../types/http'
import makeMovie from './movie'
import makeHttpError from '../helpers/http-error'

interface Params {
    movieList: MovieList
}

export default function makeMoviesEndpointHandler({ movieList }: Params): HTTPRequestHandler {
    return async function handle(request: HTTPRequest): Promise<HTTPResponse> {
        switch (request.method) {
            case 'GET':
                return getMovies(request)
            case 'POST':
                return addMovie(request)
            default:
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: 'Not found.'
                })
        }
    }

    async function getMovies(request: HTTPRequest): Promise<HTTPResponse> {
        const { id } = request.pathParams
        const { limit } = request.queryParams

        const result = id
            ? await movieList.findById({ movieId: id })
            : await movieList.getItems({ limit })

        const response = {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            data: JSON.stringify(result)
        }

        return response
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
        if (typeof movieInfo.body === 'string') {
            try {
                movieInfo = JSON.parse(movieInfo)
            } catch {
                const response = makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })

                return response
            }
        }

        try {
            const movie = makeMovie(movieInfo)
            const result = await movieList.addItem(movie)
            const response = {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
            }

            return response
        } catch (error) {
            const response = makeHttpError({
                statusCode: 400,
                errorMessage: error.message
            })

            return response
        }
    }
}
