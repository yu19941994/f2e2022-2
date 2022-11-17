
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        index: './js/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: './js/[name].js',
        assetModuleFilename: 'images/[name][ext]'
    },
    devServer: {
        // 讓壓縮變得快速
        compress: true,
        // devServer 的 port
        port: 8080

    },
    stats: {
        assets: true,
        cached: false,
        chunkModules: false,
        chunks: false,
        colors: true,
        hash: false,
        modules: false,
        reasons: false,
        source: false,
        version: false,
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[path][name].[ext]'
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]  
            },
            {
                test: /\.(sass|scss)$/,
                use:[MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                        quality: 65
                    },
                    optipng: {
                        enabled: false
                    },
                    pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg|svg|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                parser: {
                    dataurlCondition: {
                        maxSize: 8192,
                    }
                },
                parser: {
                    dataurlCondition: {
                        maxSize: 8192,
                    },
                    generator: {
                        filename: 'images/[hsah:10][ext]'
                    }
                }
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].css'
        })
    ]
}