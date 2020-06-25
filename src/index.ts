import express, { Request, Response, NextFunction } from 'express'
import { connectDb } from './db/index'
import handleMoviesRequest from './movies'
import adaptRequest from './helpers/adapt-request'
import makeHttpError from './helpers/http-error'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

app.all('/movies', moviesController)
app.get('/movies/:id', moviesController)

app.use((error: any, _: Request, res: Response, next: NextFunction) => {
    console.error(error.message)

    if (error.name === 'SyntaxError') {
        const { headers, statusCode, data } = makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. POST body must be valid JSON.'
        })

        res.set(headers).status(statusCode).send(data)
    } else {
        next(error)
    }
})

function moviesController(req: Request, res: Response) {
    const httpRequest = adaptRequest(req)

    console.log(httpRequest)

    handleMoviesRequest(httpRequest)
        .then((httResponse) => {
            console.log(httResponse)
            const { headers, statusCode, data } = httResponse
            res.set(headers).status(statusCode).send(data)
        })
        .catch((error) => {
            console.error(error.message)
            res.status(500).end()
        })
}

connectDb()
    .then(() => {
        console.log('Connected to mongodb')
        app.listen(PORT, () => {
            console.log(`App is now listening to port: ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })
