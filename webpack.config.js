/* eslint-disable */
var webpack = require('webpack');

var config = {
    // webpack options
    entry: './src/index.js',
    module: {
        loaders: [
            { test: /\.json/, loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    output: {
        filename: 'pubnub-angular2.js'
    },
    plugins: [
        new webpack.BannerPlugin(require('./package.json').version, {
            raw: false, entryOnly: true,
        }),
    ],
}

module.exports = config;
