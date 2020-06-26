export interface Review {
    id: string
    content: string
    authorName: string
    authorEmail: string
    createdAt: Date
    approved: boolean
    movieId: string
}
