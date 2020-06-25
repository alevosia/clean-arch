import { HTTPResponse } from '../types/http'

interface Params {
    statusCode: number
    errorMessage: string
}

export default function makeHttpError({ statusCode, errorMessage }: Params): HTTPResponse {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode,
        data: JSON.stringify({
            success: false,
            error: errorMessage
        })
    }
}
