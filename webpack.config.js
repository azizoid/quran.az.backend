const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  // node: {
  //   fs: "empty",
  // },
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    publicPath: "dist",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
  externals: { knex: "commonjs knex" },
};
