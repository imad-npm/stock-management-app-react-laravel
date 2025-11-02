const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',

  },
  

  target: 'web',
  devServer: {
    historyApiFallback: true,
    port: '3000',
    static: ['./public'],
    open: true,
    hot: true,
    liveReload: true,
   
  historyApiFallback: true,


  },
    resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // 👇 This is the only important line for absolute imports
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
