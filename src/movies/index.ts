import Movie from '../db/models/movie'
import makeMovieList from './movie-list'
import makeMoviesEndpointHandler from './endpoint'

const movieList = makeMovieList({ movieModel: Movie })
const moviesEndpointHandler = makeMoviesEndpointHandler({ movieList })

export default moviesEndpointHandler
