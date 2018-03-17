var webpack = require("webpack");
var path = require("path");

var OUT_DIR = path.join(__dirname,"public");

module.exports = {
  entry:[
    './src/deeplearn.js',
    './src/storage.js',
    './src/datasets.js',
    './src/statistics/pmf.js',
    './src/helpers.js',
    './src/functions.js',
    './src/codegen.js',
    './src/blocks.js',
    './src/milo.js',
    "webpack-hot-middleware/client?reload=true"
  ],
  output: {
    path: OUT_DIR,
    publicPath: __dirname + "/public",
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
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
  devtool: 'source-map'
};
