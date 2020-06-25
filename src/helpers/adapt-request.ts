import { Request } from 'express'
import { HTTPRequest } from '../types/http'

export default function adaptRequest(request: Request): HTTPRequest {
    return {
        method: request.method,
        path: request.path,
        pathParams: request.params,
        queryParams: request.query,
        body: request.body
    }
}
