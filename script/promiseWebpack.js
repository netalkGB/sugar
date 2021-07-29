const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const preloadConfig = require('../webpack.config.preload.js')

module.exports = {
  buildMainProcess: ({ mode }) =>
    new Promise((resolve, reject) => {
      webpack(mainConfig({}, { mode }), (err, stats) => {
        if (err) {
          reject(err)
        }
        resolve(stats)
      })
    }),
  buildPreloadScript: ({ mode }) =>
    new Promise((resolve, reject) => {
      webpack(preloadConfig({}, { mode }), (err, stats) => {
        if (err) {
          reject(err)
        }
        resolve(stats)
      })
    })
}
