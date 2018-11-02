const webpack = require('webpack')
const printLog = require('./printLog')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const mode = 'development'

const yellow = '\u001b[33m'
const reset = '\u001b[0m'
const red = '\u001b[31m'
const green = '\u001b[32m'

const mainCompiler = webpack(mainConfig({}, { mode }))
const rendererCompiler = webpack(rendererConfig({}, { mode }))

console.log(yellow + 'initial building...' + reset)

let mainResult = yellow + 'initial building...' + reset
let rendererResult = yellow + 'initial building...' + reset

mainCompiler.watch(
  {
    aggregateTimeout: 300,
    poll: 150
  },
  (err, stats) => {
    const r = printLog('renderer', err, stats)
    mainResult = (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    console.log('main:     ' + mainResult)
    console.log('renderer: ' + rendererResult)
  }
)

rendererCompiler.watch(
  {
    aggregateTimeout: 300,
    poll: 150
  },
  (err, stats) => {
    const r = printLog('main', err, stats)
    rendererResult = (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    console.log('main:     ' + mainResult)
    console.log('renderer: ' + rendererResult)
  }
)
