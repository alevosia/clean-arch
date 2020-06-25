import mongoose from 'mongoose'

export async function connectDb(): Promise<void> {
    const url = 'mongodb://localhost:27017'
    const dbName = 'clean_arch'

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.useDb(dbName)
}
