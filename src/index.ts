import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import { connectDb } from './db/index'
import handleMoviesRequest from './movies'
import handleReviewsRequest from './reviews'
import adaptRequest from './helpers/adapt-request'
import makeHttpError from './helpers/http-error'

const PORT = process.env.PORT || 5000
const app = express()

app.use(helmet())

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
} else {
    app.use(compression())
}

app.use(express.json())

app.get('/', (_, res) => {
    res.sendStatus(200)
})

app.all('/movies', moviesController)
app.all('/movies/:id', moviesController)
app.all('/reviews', reviewsController)
app.all('/reviews/:id', reviewsController)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, _: Request, res: Response, _2: NextFunction) => {
    if (error.name === 'SyntaxError') {
        const { headers, statusCode, data } = makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. POST body must be valid JSON.'
        })

        res.set(headers).status(statusCode).send(data)
    } else {
        console.error(error.message)
        res.sendStatus(500)
    }
})

function moviesController(req: Request, res: Response) {
    const httpRequest = adaptRequest(req)

    handleMoviesRequest({ httpRequest })
        .then((httResponse) => {
            const { headers, statusCode, data } = httResponse
            res.set(headers).status(statusCode).send(data)
        })
        .catch((error) => {
            console.error(error.message)
            res.sendStatus(500)
        })
}

function reviewsController(req: Request, res: Response) {
    const httpRequest = adaptRequest(req)

    handleReviewsRequest({ httpRequest })
        .then((httResponse) => {
            const { headers, statusCode, data } = httResponse
            res.set(headers).status(statusCode).send(data)
        })
        .catch((error) => {
            console.error(error.message)
            res.sendStatus(500)
        })
}

connectDb()
    .then((connection) => {
        console.log(`Connected to MongoDB: ${connection.host}`)
        console.log(`Database: ${connection.name}`)
        console.log(`Models: ${Object.keys(connection.models).join(' | ')}`)

        app.listen(PORT, () => {
            console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
            console.log(`App is now listening to port: ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })
