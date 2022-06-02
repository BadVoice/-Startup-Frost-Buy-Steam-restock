const path = require('path');
const constants = require('./constants');
const miniCss = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const buildType = process.env.BUILD_TYPE ? process.env.BUILD_TYPE : constants.modes.dev;

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const result = {}

result.plugins = [
    new MiniCssExtractPlugin({
        filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.html'),
        minify: buildType === constants.modes.dev ? false : true
    }),
    // }), new ParallelUglifyPlugin({
    //     // Параметры, передаваемые в UglifyJS
    //     uglifyJS: {
    //         output: {
    //             // Самый компактный вывод
    //             beautify: false,
    //             // удаляем все комментарии
    //             comments: false,
    //         },
    //         compress: {
    //             // Предупреждение не выводится, когда UglifyJs удаляет неиспользуемый код
    //             warnings: false,
    //             // Удаляем все операторы `console`, он совместим с браузером IE
    //             drop_console: true,
    //             // Переменные определены встроенными, но используются только один раз
    //             collapse_vars: true,
    //             // Извлекаем статические значения, которые появляются несколько раз, но не определены как переменные для ссылки
    //             reduce_vars: true,
    //         }
    //     },
    // }),


]

result.module = {
    rules: [{
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
            loader: "file-loader",
            options: {
                name: "[name].[hash].[ext]",
            }
        },
        {
            test: /\.(s*)css$/,
            use: [
                miniCss.loader,

                'css-loader',
                'sass-loader'
            ]
        },
        {
            // JavaScript
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
            },
        },
        {
            test: /\.mp4$/,
            use: 'file-loader?name=videos/[name].[ext]',
        },
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
            },
        }
    ]
}

if (buildType === constants.modes.prod) {
    result.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}



module.exports = result