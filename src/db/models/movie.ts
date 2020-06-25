import mongoose, { Document, Schema, model } from 'mongoose'

export interface IMovie extends Document {
    _id: mongoose.Types.ObjectId
    title: string
    plot: string
    releasedAt: Date
}

const movieSchema = new Schema<IMovie>({
    title: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    releasedAt: {
        type: Date,
        required: true
    }
})

export default model<IMovie>('Movie', movieSchema)
