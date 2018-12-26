const path = require('path')

module.exports = (env, argv) => {
  const mode = argv.mode === 'development' ? 'development' : 'production'
  return {
    mode,
    target: 'electron-main',
    entry: ['./src/renderer/preload.js'],
    output: {
      filename: 'preload.js',
      path: path.join(
        __dirname,
        mode === 'development' ? 'out/renderer/' : 'prodOut/out/renderer/'
      )
    },
    resolve: {
      extensions: ['.js', '.json', '.node']
    },
    optimization: {
      nodeEnv: mode
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|dist|out)/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        },
        {
          enforce: 'pre',
          test: /(\.js$)/,
          exclude: /(node_modules|dist|out)/,
          loader: 'eslint-loader'
        }
      ]
    }
  }
}
