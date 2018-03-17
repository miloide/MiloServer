var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin');


var config = {
  entry: './tests.spec.js',
  output: {
    filename: 'test.bundle.js'
  },
  devtool: 'eval',
  target: 'node',
  externals: [nodeExternals()],
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
       {
         test: /\.js$/,
         exclude: /(node_modules)/,
         use: {
           loader: 'babel-loader',
           options: {
             presets: ['env']
           }
         }
       }
     ]
  },

  plugins: [
    new WebpackShellPlugin({
      onBuildExit: "mocha --colors test.bundle.js"
    })
  ]
};


module.exports = config;
