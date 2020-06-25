module.exports = {
    apps: [
        {
            name: 'Clean Architecture',
            script: './build/index.js',
            env: {
                NODE_ENV: 'production'
            },
            instances: 4,
            exec_mode: 'cluster'
        }
    ]
}
