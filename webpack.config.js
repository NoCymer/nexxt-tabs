const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/App.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "src/components"),
      "@Hooks": path.resolve(__dirname, "src/hooks"),
      "@Modules": path.resolve(__dirname, "src/modules"),
      "@Styles": path.resolve(__dirname, "src/styles"),
      "@Settings": path.resolve(__dirname, "src/settings"),
      "@Public": path.resolve(__dirname, "public")
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
          // Creates `style` nodes from JS strings
          "style-loader",
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
  plugins: [ 
    new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html"
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
  devtool:"source-map",
};