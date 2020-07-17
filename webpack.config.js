const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    compress: true,
    port: 9000,
  },
  //plugins: [new BundleAnalyzerPlugin()],
  plugins: [
    new HtmlWebpackPlugin({
      title: "js13k",
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
