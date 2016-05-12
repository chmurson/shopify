var path = require('path');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, 'build'),
    filename: "bundle.js"
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
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
      {
        test: /\.html$/,
        loader: "html"
      }
    ]
  },
  plugins: [
    new BellOnBundlerErrorPlugin()
  ],
  devtool: 'source-map'
};
