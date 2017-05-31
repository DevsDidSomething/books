const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//
// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// });

var config = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js'
  },
  module : {
    rules : [
      // {
      //   test: /\.scss$/,
      //   use: extractSass.extract({
      //     use: [{
      //       loader: "css-loader"
      //     }, {
      //       loader: "sass-loader"
      //     }],
      //     fallback: "style-loader"
      //   })
      // },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'css'),
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        use: {
          loader : 'babel-loader'
        }
      }
    ]
  },
  plugins: [new ExtractTextPlugin('bundle.css')],
};

module.exports = config;
