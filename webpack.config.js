var webpack = require("webpack");
var path = require("path");
var CompressionPlugin = require('compression-webpack-plugin');

var OUT_DIR = path.join(__dirname,"public");

module.exports = {
  entry: [
    './src/milo.js',
  ],
  output: {
    path: OUT_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
       {
         test: /\.js$/,
         exclude: /(node_modules)/,
         use: {
          loader: 'babel-loader',
        }
       }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'Blockly':'milo-blocks'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })
  ],
};
