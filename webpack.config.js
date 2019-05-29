const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  entry: {
    main: "./main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "dist",
    libraryTarget: "umd",
    globalObject: 'self'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  /**
   * Optimization params
   */
  optimization: {
    noEmitOnErrors: true,
    splitChunks: false
  },

  devServer: {
    contentBase: path.join(__dirname, "./"),
    compress: true
  }
};
