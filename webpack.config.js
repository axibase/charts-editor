const CopyPlugin = require('copy-webpack-plugin');
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
          'css-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "raw-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new CopyPlugin([
      { from: 'node_modules/monaco-editor-core/dev/vs/editor/editor.main.css', to: './' }
    ]),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@axibase/charts-language-service': path.resolve(__dirname, 'node_modules/@axibase/charts-language-service/dist/amd/build.js')
    }
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
