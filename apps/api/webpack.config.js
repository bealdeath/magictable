const { join } = require('path');

module.exports = {
  mode: 'development', // or 'production' based on your environment
  entry: join(__dirname, 'src/main.ts'),
  output: {
    path: join(__dirname, '../../dist/apps/api'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  stats: {
    errorDetails: true
  },
  externals: {
    express: 'commonjs express' // Add this line to handle express correctly
  }
};
