const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin")

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.[contenthash].css'
})

var config = {
  entry: './client/index.jsx',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.[hash].js'
  },
  module : {
    rules : [
      {
        test: /\.scss$/,
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
  plugins: [extractSass, new ManifestPlugin({fileName: 'build-manifest.json'})],
};

module.exports = config;
