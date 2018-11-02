const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const printLog = require('./printLog')

const rendererProcess = ({ mode }) =>
  new Promise(resolve => {
    webpack(rendererConfig({}, { mode }), (err, stats) => {
      const r = printLog('renderer', err, stats)
      resolve(r)
    })
  })

const mainProcess = ({ mode }) =>
  new Promise(resolve => {
    webpack(mainConfig({}, { mode }), (err, stats) => {
      const r = printLog('main', err, stats)
      resolve(r)
    })
  })

exports.mainProcess = mainProcess
exports.rendererProcess = rendererProcess

async function main () {
  const mode = process.argv[2]
  const target = process.argv[3]
  if (target === 'renderer') {
    process.exit((await rendererProcess({ mode })) === true ? 0 : 1)
  } else if (target === 'main') {
    process.exit((await mainProcess({ mode })) === true ? 0 : 1)
  } else {
    const [renderer, main] = await Promise.all([
      rendererProcess({ mode }),
      mainProcess({ mode })
    ])
    
    const reset = '\u001b[0m'
    const green = '\u001b[32m'
    const red = '\u001b[31m'

    const mainResult = (main === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    const rendererResult = (renderer === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    console.log('main:     ' + mainResult)
    console.log('renderer: ' + rendererResult)
    process.exit(renderer === true && main === true ? 0 : 1)
  }
}

main()
