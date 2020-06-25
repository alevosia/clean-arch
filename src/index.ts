import express, { Request, Response, NextFunction } from 'express'
import { connectDb } from './db/index'
import handleMoviesRequest from './movies'
import adaptRequest from './helpers/adapt-request'
import makeHttpError from './helpers/http-error'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

app.all('/movies', moviesController)
app.all('/movies/:id', moviesController)

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

    console.log(httpRequest.method)

    handleMoviesRequest(httpRequest)
        .then((httResponse) => {
            console.log(httResponse)
            const { headers, statusCode, data } = httResponse
            res.set(headers).status(statusCode).send(data)
        })
        .catch((error) => {
            console.error(error.message)
            res.sendStatus(500)
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
