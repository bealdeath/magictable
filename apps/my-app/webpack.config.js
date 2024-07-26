const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Set the mode to development

  entry: './apps/my-app/src/main.tsx', // Update this path

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './apps/my-app/src/index.html', // Update this path
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'apps/my-app/dist'),
    },
    compress: true,
    port: 4200,
  },
};
