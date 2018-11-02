const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const mode = process.env.mode
webpack(mainConfig({}, { mode }), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.err(err)
  }
})

webpack(rendererConfig({}, { mode }), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.err(err)
  }
})
