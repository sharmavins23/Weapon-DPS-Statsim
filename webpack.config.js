const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
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
        alias: {
            "@weapons": path.resolve(__dirname, "src/weapons"),
            "@formats": path.resolve(__dirname, "src/formats"),
            "@calc": path.resolve(__dirname, "src/calc"),
        },
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),
    },
};
