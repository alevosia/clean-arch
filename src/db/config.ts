let MONGODB_URL = ''

if (process.env.NODE_ENV === 'production') {
    MONGODB_URL = ''
} else {
    MONGODB_URL = 'mongodb://localhost:27017/clean_arch'
}

export { MONGODB_URL }
