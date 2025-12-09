const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve(__dirname, 'client', 'src', 'index.js'),

  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: isProd ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
    publicPath: '/', // important for react-router
    clean: true,
  },

  mode: isProd ? 'production' : 'development',

  module: {
    rules: [
      // JS / JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      // CSS imports
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // Images & assets
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][hash][ext][query]',
        },
      },

      // Fonts
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][hash][ext][query]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'public', 'index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'client', 'public'),
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },

  watchOptions: {
    aggregateTimeout: 200,
  },

  devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
};
