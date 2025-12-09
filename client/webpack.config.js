const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',  // your React entry point
  output: {
    path: path.resolve(__dirname, 'hosted'),  // output folder
    filename: '[name].bundle.js',
    publicPath: '/', // important for React Router and favicon
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][hash][ext][query]', // output images to hosted/img/
        },
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'hosted'), // serve hosted/ as static folder
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: 'eval-cheap-module-source-map',
};
