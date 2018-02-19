var webpack = require("webpack");
var glob = require("glob");
var path = require("path");

var OUT_DIR = path.join(__dirname,"public")

module.exports = {
  entry: glob.sync("./lib/*.js").concat([
    './src/deeplearn.js',
    './src/storage.js',
    './src/datasets.js',
    './src/helpers.js',
    './src/functions.js',
    './src/codegen.js',
    './src/blocks.js',
    './src/code.js',
    "webpack-hot-middleware/client?reload=true"
  ]),
  output: {
    path: OUT_DIR,
    publicPath: __dirname + "/public",
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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
