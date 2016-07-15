var webpack = require('webpack');
var path = require('path');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/index.js",
    "thank-you": "./src/thank-you.js",
    "error-handler": "./src/error-handler.js"
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: "[name].bundle.js"
  },
  externals: {
    'jquery': 'Checkout.$'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
      {
        test: /\.html$/,
        loader: "html"
      }, {
        'loader': 'babel-loader',
        'test': /\.js$/,
        'exclude': /node_modules/,
        'query': {
          'plugins': ['lodash'],
          'presets': ['es2015']
        }
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new BellOnBundlerErrorPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "init",
      chunks: ['index', 'thank-you']
    }),
    new webpack.DefinePlugin({

    })
  ],
  devtool: 'source-map'
};
