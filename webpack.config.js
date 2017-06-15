const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: './client/index.jsx',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js'
  },
  module : {
    rules : [
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: __dirname,
        use: {
          loader : 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.scss', '.js', '.jsx'],
  },
  plugins: [new ExtractTextPlugin('bundle.css')],
};

module.exports = config;
