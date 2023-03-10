const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    optimization: {
        minimize: true
    },
    entry: {
        main: "./src/main.ts",
        adapter: "./src/adapter.ts",
        runtime: "./src/runtime.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        environment: {
            arrowFunction: false
        }
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    mode: 'production',
    module: {
        rules: [{test: /\.ts$/, use: {loader: "ts-loader"}, exclude: /node_modules/}]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {from: "manifest.json", to: "manifest.json"},
                {from: "icons", to: "icons"},
            ],
        })]
}