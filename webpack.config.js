const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  entry: {
    main: "./src/main.js",
    "charts.worker": "./monaco/charts.worker.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "dist",
    libraryTarget: "umd",
    globalObject: 'self'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
              loader: MiniCssExtractPlugin.loader,
              options: {
                  publicPath: '../'
              }
          },
          'css-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: []
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  optimization: {
    noEmitOnErrors: true,
    splitChunks: false
  },
  devServer: {
    contentBase: path.join(__dirname, "./"),
    open: true,
    compress: true
  },
  stats: {
    all: false,
    builtAt: true,
    entrypoints: true,
    errors: true,
    warnings: true,
    assets: true,
    moduleTrace: true,
    errorDetails: true
  }
};
