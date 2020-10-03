const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const getFileName = (isProd, extension = '[ext]') =>
  isProd ? `[name].[contenthash].${extension}` : `[name].${extension}`;

const getPlugins = isProd => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    })
  ];

  if (isProd) {
    plugins.push(
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: getFileName(isProd, 'css')
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false
      })
    );
  }

  return plugins;
};

module.exports = (env = {}) => {
  const { production: isProd = false } = env;
  const isDev = !isProd;
  const fileNameForFileLoader = getFileName(isProd);

  return {
    mode: isProd ? 'production' : 'development',
    output: {
      filename: getFileName(isProd, 'js')
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    devServer: {
      hot: isDev,
      open: true
    },
    devtool: isDev && 'inline-source-maps',
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(jpg|png|gif|jpeg|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
                name: fileNameForFileLoader
              }
            }
          ]
        },
        {
          test: /\.(ttf|woff|woff2|eot|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'fonts',
                name: fileNameForFileLoader
              }
            }
          ]
        }
      ]
    },
    plugins: getPlugins(isProd)
  };
};
