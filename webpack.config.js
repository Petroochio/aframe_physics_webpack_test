/* eslint-disable */
var path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },

  // Testing things
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     AFRAME: 'aframe',
  //   }),
  // ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|build)/,
        include: [path.resolve(__dirname, './src'), require.resolve('aframe-physics-system')],
        loader: 'babel-loader',
      },
    ],
  },
};
