export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'

export interface HTTPRequest {
    path: string
    method: string
    pathParams: any
    queryParams: any
    body: any
}

export interface HTTPResponse {
    headers?: any
    statusCode: number
    data?: string
}

export type HTTPRequestHandler = (request: HTTPRequest) => Promise<HTTPResponse>
