var webpack = require("webpack");
var glob = require("glob");
var path = require("path");

var OUT_DIR = path.join(__dirname,"public")

module.exports = {
  entry: [
    // './src/jquery-2.2.4.js',
    './src/bootstrap-modal.js',
    './src/storage.js',
    './src/blockly.js',
    './src/blocks.js',
    './src/javascript.js',
    './src/dlearn.js',
    './src/datasets.js',
    './src/custom/helpers.js',
    './src/custom/functions.js',
    './src/deeplearn.js',
    './src/plotly.js',
    './src/custom/codegen.js',
    './src/custom/blocks.js',
    './src/code.js',
  ],
  output: {
    path: OUT_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
    alias: {
        'Datasets': path.resolve(__dirname, './src/datasets')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
      }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Datasets': 'Datasets'
    })
  ]
}