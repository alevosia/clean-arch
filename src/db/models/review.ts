import mongoose, { Document, Schema, model } from 'mongoose'

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId
    content: string
    authorName: string
    authorEmail: string
    createdAt: Date
    approved: boolean
    movie: mongoose.Types.ObjectId
}

const reviewSchema = new Schema<IReview>({
    content: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    approved: {
        type: Boolean,
        default: false,
        required: true
    },
    movie: {
        type: mongoose.Types.ObjectId,
        ref: 'Movie',
        required: true
    }
})

export default model<IReview>('Review', reviewSchema)
