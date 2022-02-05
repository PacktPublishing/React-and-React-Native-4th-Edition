module.exports = {
  entry: [
    './main.js',
  ],
  output: {
    path: '/',
    filename: 'main-bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
};
