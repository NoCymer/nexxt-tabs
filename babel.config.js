module.exports = {
    presets: [
        "@babel/preset-react",
        "@babel/preset-env",
        "@babel/preset-typescript",
        ["minify", {
            "builtIns": false
        }]
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-modules-commonjs",
    ]
}