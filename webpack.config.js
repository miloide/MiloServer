var webpack = require("webpack");
var glob = require("glob");
var path = require("path");
var CompressionPlugin = require('compression-webpack-plugin');

var OUT_DIR = path.join(__dirname,"public");

module.exports = {
  entry: glob.sync("./lib/*.js").concat([
    './src/deeplearn.js',
    './src/storage.js',
    './src/datasets.js',
    './src/helpers.js',
    './src/functions.js',
    './src/codegen.js',
    './src/blocks.js',
    './src/milo.js',
  ]),
  output: {
    path: OUT_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
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
