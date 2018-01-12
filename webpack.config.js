var webpack = require('webpack');
var config = {};

function generateConfig(name) {
    var uglify = name.indexOf('min') > -1;
    var config = {
        entry: './index.js',
        output: {
            path: 'dist/',
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'api-sdk',
            libraryTarget: 'umd'
        },
        node: {
            process: false
        },
        devtool: 'source-map'
    };

    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ];

    config.module = {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: [/(lib)/],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    };

    if (uglify) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            })
        );
    }

    return config;
}

['api-sdk', 'api-sdk.min'].forEach(function (key) {
    config[key] = generateConfig(key);
});

module.exports = config;
