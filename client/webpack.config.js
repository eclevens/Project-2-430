// client/webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
    publicPath: '/', // important if you use React Router
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

      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // Images & fonts
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][hash][ext][query]',
        },
      },
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
      // convenience: import X from '@/components/X'
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: { overlay: true },
  },

  watchOptions: {
    aggregateTimeout: 200,
  },

  devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
};