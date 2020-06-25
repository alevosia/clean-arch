import { Movie } from '../types/movie'

// Movie entity, returns a pure JS object, not dependent to any framework
export default function makeMovie(movieInfo: Params): Movie {
    const validMovie = validateMovie(movieInfo)

    return Object.freeze(validMovie)

    function validateMovie({ id, title, plot, releasedAt }: Params): Movie {
        console.log(title, plot, releasedAt)

        // title
        if (title === undefined) {
            throw new Error('Movie title is required.')
        }
        if (!(typeof title === 'string')) {
            throw new Error('Movie title must be of type string.')
        }
        if (title.length < 3) {
            throw new Error('Movie title must be at least 3 characters long.')
        }

        // plot
        if (plot === undefined) {
            throw new Error('Movie plot is required.')
        }
        if (!(typeof plot === 'string')) {
            throw new Error('Movie plot must be of type string.')
        }
        if (plot.length < 3) {
            throw new Error('Movie plot must be at least 3 characters long.')
        }

        // releasedAt
        if (!releasedAt) {
            throw new Error('Movie releasedAt is required.')
        }

        return { id, title, plot, releasedAt }
    }
}

export interface Params {
    id: string
    title: string
    plot: string
    releasedAt: Date
    [k: string]: any
}
