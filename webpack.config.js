const path = require('path');

module.exports = {
  entry: {
    background: './src/index.js',
    contentScript: './src/contentScript.js'
  },
  // mode: 'development',
  mode: 'production',
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
  },
};