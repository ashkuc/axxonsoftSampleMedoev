const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { requestHandler: proxyRequestHandler } = require('./noCorsProxy');
const {
    username,
    password,
    host: axxonsoftHost,
    port: axxonsoftPort
} = require('./axxonsoftConfig');

// const isProduction = process.env.NODE_ENV === 'production';
const devServerPort = 9000;

module.exports = (mode) => ({
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /(\.css|\.scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new webpack.DefinePlugin({
            __API__: JSON.stringify(mode === 'production'
                ? `http://${axxonsoftHost}:${axxonsoftPort}`
                : `http://localhost:${devServerPort}`
            ),
            __USERNAME__: JSON.stringify(username),
            __PASSWORD__: JSON.stringify(password),
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: devServerPort,
        before: function(app, server) {
            app.get('/asip-api/*', proxyRequestHandler);
        }
    }
});