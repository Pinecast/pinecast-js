var path = require('path');

var webpack = require('webpack');


module.exports = {
    // devtool: 'source-maps',
    entry: {
        app: ['./src/index.js'],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, '../../lerna_modules'),
            'node_modules',
        ],
    },
    cache: false,
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '/ui-omnibus.js',
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': '"production"',
        //     },
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {},
        // }),
        // new webpack.LoaderOptionsPlugin({minimize: true}),
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
        function(context, request, callback) {
            if (request === 'fs') {
                return callback(null, 'null');
            }
            return callback();
        }
    ],
};
