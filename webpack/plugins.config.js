const path = require('path');
const constants = require('./constants');
const miniCss = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const buildType = process.env.BUILD_TYPE ? process.env.BUILD_TYPE : constants.modes.dev;
const CopyWebPackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const result = {}

result.plugins = [
    new MiniCssExtractPlugin({
        filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.html'),
        minify: buildType === constants.modes.dev ? false : true
    }),
    new ParallelUglifyPlugin({
        // Параметры, передаваемые в UglifyJS
        uglifyJS: {
            output: {
                // Самый компактный вывод
                beautify: false,
                // удаляем все комментарии
                comments: false,
            },
            compress: {
                // Предупреждение не выводится, когда UglifyJs удаляет неиспользуемый код

                // Удаляем все операторы `console`, он совместим с браузером IE
                drop_console: true,
                // Переменные определены встроенными, но используются только один раз
                collapse_vars: true,
                // Извлекаем статические значения, которые появляются несколько раз, но не определены как переменные для ссылки
                reduce_vars: true,
            }
        },
    }),

    new CopyWebPackPlugin({
        patterns: [{ from: path.resolve(__dirname, "src", "img"), to: "img" }],
    }),

    new MiniCssExtractPlugin(),


]

result.module = {
    rules: [{
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
            loader: "file-loader",
            options: {
                name: "[name].[hash].[ext]",
            }
        }, /** Babel **/
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
            // npm install babel-loader @babel/core @babel/preset-env -D
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader",
            ],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        /** Шрифты */
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        /** Файлы CSV */
        {
            test: /\.(csv|tsv)$/i,
            use: ['csv-loader'],
            // npm i csv-loader -D
        },
        /** Файлы XML */
        {
            test: /\.xml$/i,
            use: ['xml-loader'],
            // npm i xml-loader -D 
        },
        // {
        //     test: /\.(s*)css$/,
        //     use: [
        //         miniCss.loader,

        //         'css-loader',
        //         'sass-loader'
        //     ]
        // },
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
    ],

}

if (buildType === constants.modes.prod) {
    result.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin(),
            new CssMinimizerPlugin(),
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: "all",
                        type: "scss/mini-extract",
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
        }
    }
}


module.exports = result