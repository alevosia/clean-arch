import mongoose, { Connection } from 'mongoose'

export async function connectDb(): Promise<Connection> {
    const dbName = 'clean_arch'
    const url = `mongodb://localhost:27017/${dbName}`
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 15000
    })

    return mongoose.connection
}
