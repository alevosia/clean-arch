import mongoose, { Connection } from 'mongoose'
import { MONGODB_URL } from './config'

export async function connectDb(): Promise<Connection> {
    await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 15000
    })

    return mongoose.connection
}
