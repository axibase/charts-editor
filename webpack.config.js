const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  entry: {
    "editor": "./src/monaco.contribution.ts",
    "charts.worker": "./src/charts.worker.ts",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js?v=[contenthash]",
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
    ])
  ],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {      
      'monaco-editor-core': path.resolve(__dirname, 'monaco-editor-core')
    }
  },
  optimization: {
    noEmitOnErrors: true,
    splitChunks: false
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
