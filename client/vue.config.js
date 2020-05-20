module.exports = {
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://localhost:5000',
                secure: false,
                ws: true,
                changeOrigin: true
            },
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
}