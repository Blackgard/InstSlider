var path = require('path');


const miniCss = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'inst-slider.js',
        clean: true
    },

    module: {
        rules: [
            {
                test:/\.(s*)ass$/,
                use: [
                    miniCss.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }, 
            {
                test: /(\.jsx|\.js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: { 
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets'
                    }
                },
            },
            {
                test: /\.(tsx|ts)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },

    plugins: [
        new miniCss({
           filename: 'inst-slider.css'
        }),
        new HtmlWebpackPlugin({
            title: 'Example slider',
            template: 'public/index.html'
        })
    ],

    mode: "production"
}