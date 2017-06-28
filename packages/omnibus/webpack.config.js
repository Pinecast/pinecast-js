const path = require('path');

const webpack = require('webpack');


module.exports = {
    // devtool: 'source-maps',
    entry: {
        app: ['./src/index.js'],
    },
    resolve: {
        mainFields: [
            'jsnext:main',
            'main',
        ],
        modules: [
            path.resolve(__dirname, '../../node_modules'),
            'node_modules',
        ],
    },
    cache: false,
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: 'ui-omnibus.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {},
        }),
        new webpack.LoaderOptionsPlugin({minimize: true}),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    externals: [
        (context, request, callback) => {
            switch (request) {
                // For Node compatibility
                case 'fs':
                case 'net':
                    return callback(null, 'null');
                case 'tty':
                    return callback(null, '{isatty:function() {}}');

                // Removing junk that doesn't need a package.
                case 'bluebird':
                    // For react-google-charts
                    return callback(null, 'Promise');
                case 'function-bind':
                    return callback(null, 'Function.prototype.bind');
                case 'is-array':
                case 'isarray':
                    return callback(null, 'Array.isArray');
                case 'is-function':
                    return callback(null, 'function(x) {return typeof x === "function";}');
                case 'object.assign':
                case 'object-assign':
                    return callback(null, 'Object.assign');
                case 'object-keys':
                    return callback(null, '(function() {var x = Object.keys(); x.shim = x; return x;}())');

                default:
                    return callback();
            }
        }
    ],
};
