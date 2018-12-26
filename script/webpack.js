const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const preloadConfig = require('../webpack.config.preload.js')
const printLog = require('./printLog')

const reset = '\u001b[0m'
const green = '\u001b[32m'
const red = '\u001b[31m'
const yellow = '\u001b[33m'

const buildRendererProcess = ({ mode }) =>
  new Promise(resolve => {
    webpack(rendererConfig({}, { mode }), (err, stats) => {
      const r = printLog('renderer', err, stats)
      resolve(r)
    })
  })

const buildPreload = ({ mode }) =>
  new Promise(resolve => {
    webpack(preloadConfig({}, { mode }), (err, stats) => {
      const r = printLog('preload', err, stats)
      resolve(r)
    })
  })

const buildMainProcess = ({ mode }) =>
  new Promise(resolve => {
    webpack(mainConfig({}, { mode }), (err, stats) => {
      const r = printLog('main', err, stats)
      resolve(r)
    })
  })

const buildAll = async mode => {
  const [renderer, preload, main] = await Promise.all([
    buildRendererProcess({ mode }),
    buildPreload({ mode }),
    buildMainProcess({ mode })
  ])

  const mainResult =
    (main === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
  const preloadResult =
    (preload === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
  const rendererResult =
    (renderer === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
  console.log('main:     ' + mainResult)
  console.log('preload:  ' + preloadResult)
  console.log('renderer: ' + rendererResult)
  return main === true && renderer === true && preload === true
}

const watch = ({ mode }) => {
  const mainCompiler = webpack(mainConfig({}, { mode }))
  const preloadCompiler = webpack(preloadConfig({}, { mode }))
  const rendererCompiler = webpack(rendererConfig({}, { mode }))

  console.log(yellow + 'initial building...' + reset)

  let mainResult = yellow + 'initial building...' + reset
  let preloadResult = yellow + 'initial building...' + reset
  let rendererResult = yellow + 'initial building...' + reset

  mainCompiler.watch(
    {
      aggregateTimeout: 300,
      poll: 150
    },
    (err, stats) => {
      const r = printLog('main', err, stats)
      mainResult =
        (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
      console.log('main:     ' + mainResult)
      console.log('preload:  ' + preloadResult)
      console.log('renderer: ' + rendererResult)
    }
  )

  preloadCompiler.watch(
    {
      aggregateTimeout: 300,
      poll: 150
    },
    (err, stats) => {
      const r = printLog('preload', err, stats)
      preloadResult =
        (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
      console.log('main:     ' + mainResult)
      console.log('preload:  ' + preloadResult)
      console.log('renderer: ' + rendererResult)
    }
  )

  rendererCompiler.watch(
    {
      aggregateTimeout: 300,
      poll: 150
    },
    (err, stats) => {
      const r = printLog('renderer', err, stats)
      rendererResult =
        (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
      console.log('main:     ' + mainResult)
      console.log('preload:  ' + preloadResult)
      console.log('renderer: ' + rendererResult)
    }
  )
}

exports.buildAll = buildAll
exports.buildMainProcess = buildMainProcess
exports.buildRendererProcess = buildRendererProcess
exports.buildPreload = buildPreload
exports.watch = watch
