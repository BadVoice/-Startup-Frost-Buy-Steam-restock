const path = require('path')
const HTMLWebapckPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        main: './src/script.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HTMLWebapckPlugin({
            template: './src/index.html'
        })
    ]
}