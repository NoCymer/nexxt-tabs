const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MiniCssExtractCleanupPlugin = require("./plugins/miniCssExtractCleanupPlugin");
const glob = require("glob");


// Regex used to extract the filename before the .scss extension
const SCSS_FILENAME_REGEX = /(([^\/]+)\.scss)$/

// Fetches all the modules's specific stylesheet and adds "./" to the path
// for webpack to use relative and not absolute pathin when resolving entrypoints
modules_stylesheets = glob.sync("./src/modules/**/*.scss");

// Changes all \\ to / for html webpack to work
modules_stylesheets = modules_stylesheets.map(e => e.replace(/\\/g, "/"));

modules_stylesheets = modules_stylesheets.map(e => `./${e}`);

// Reduces the array to a map having for key the filename without the extension
// and the path as the value
modules_stylesheets = modules_stylesheets.reduce((a, v) => ({ ...a, [v.match(SCSS_FILENAME_REGEX)[2]]: v}), {}) 

// Compile target entrypoints
entrypoints = {
    style: "./src/styles/main.scss",
    ...modules_stylesheets
}

module.exports = {
  entry: {
    app: "./src/App.tsx",
    ...entrypoints
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    clean: true,
  },
  
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "../src/components"),
      "@Hooks": path.resolve(__dirname, "../src/hooks"),
      "@Modules": path.resolve(__dirname, "../src/modules"),
      "@Styles": path.resolve(__dirname, "../src/styles"),
      "@Settings": path.resolve(__dirname, "../src/settings"),
      "@Public": path.resolve(__dirname, "../public")
    }
  },
  module: {
    rules: [
      { 
        test : /\.(ts|tsx)$/,
        resolve: {
            extensions: [".ts", ".tsx"]
        },
        exclude: /node_@Modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          // Compiles Sass to CSS
          "sass-loader",
        ]
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
    ]
  },
  optimization: {
      minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin({
              test: /\.js(\?.*)?$/i,
          })
      ]
  },
  plugins: [ 
    new MiniCssExtractPlugin({
        filename: "css/[name].css",
    }),
    new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        chunks: [
          "app",
          ...Object.keys(entrypoints)
        ]
    }),
    new CopyPlugin({
        patterns: [
            { from: "public"}
        ],
    }),
    new CopyPlugin({
        patterns: [
            {context: "src/", from: "./modules/**/assets/*"}
        ],
    })
  ],
};