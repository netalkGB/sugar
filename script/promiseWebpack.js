const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')

module.exports = {
  buildMainProcess: ({ mode }) =>
    new Promise((resolve, reject) => {
      webpack(mainConfig({}, { mode }), (err, stats) => {
        if (err) {
          reject(err)
        }
        resolve(stats)
      })
    })
}
