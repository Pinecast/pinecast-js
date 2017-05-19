const path = require('path');

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


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
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {},
        // }),
        new webpack.LoaderOptionsPlugin({minimize: true}),
        process.env.ANALYZE ? new BundleAnalyzerPlugin() : undefined,
    ].filter(x => x),
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
        function(context, request, callback) {
            switch (request) {
                case 'fs':
                case 'net':
                    return callback(null, 'null');
                case 'tty':
                    return callback(null, '{isatty:function() {}}');
                case 'isarray':
                    return callback(null, 'Array.isArray');
                case 'bluebird':
                    // For react-google-charts
                    return callback(null, 'Promise');
                default:
                    return callback();
            }
        }
    ],
};
