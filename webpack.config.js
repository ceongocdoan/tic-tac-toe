const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    preload: './src/preload.ts',
    renderer: './src/renderer.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'electron-main'
};
