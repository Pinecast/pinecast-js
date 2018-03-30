const path = require('path');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
  const plugins = [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  if (env === 'prod') {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
    );
    plugins.push(new webpack.LoaderOptionsPlugin({minimize: true}));
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    plugins.push(
      new MinifyPlugin(
        {
          mangle: {
            blacklist: ['Buffer'],
          },
        },
        {sourceMap: 'cheap-source-maps'},
      ),
    );
  }
  return {
    devtool: 'cheap-source-maps',
    entry: {
      app: [
        // 'babel-polyfill',
        './src/index.js',
      ],
    },
    resolve: {
      mainFields: ['jsnext:main', 'main'],
      modules: [
        path.resolve(__dirname, 'vendor'),
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
    plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
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
          case 'is-finite':
            return callback(
              null,
              'function(x) {return typeof x !== "number" && !isNaN(x) && x !== Infinity && x !== -Infinity;}',
            );
          case 'is-function':
            return callback(null, 'function(x) {return typeof x === "function";}');
          case 'object.assign':
          case 'object-assign':
            return callback(null, 'Object.assign');
          case 'object-keys':
            return callback(
              null,
              '(function() {var x = Object.keys.bind(Object); x.shim = x; return x;}())',
            );

          default:
            return callback();
        }
      },
    ],
  };
};
