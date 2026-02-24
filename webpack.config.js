const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const outputDir = path.resolve(
  __dirname,
  "src/quantecon_sphinx_theme/theme/quantecon_sphinx_theme/static"
);

module.exports = {
  entry: path.resolve(
    __dirname,
    "src/quantecon_sphinx_theme/assets/scripts/index.js"
  ),
  output: {
    filename: "scripts/quantecon-sphinx-theme.js",
    path: outputDir,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/quantecon-sphinx-theme.css",
    }),
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
  },
};
