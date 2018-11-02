const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const mode = process.env.mode === 'development' ? 'development' : 'production'

const yellow = '\u001b[33m'
const reset = '\u001b[0m'
const green = '\u001b[32m'
const red = '\u001b[31m'

const rendererProcess = () =>
  new Promise(resolve => {
    webpack(rendererConfig({}, { mode }), (err, stats) => {
      const r = printLog('renderer', err, stats)
      resolve(r)
    })
  })

const mainProcess = () =>
  new Promise(resolve => {
    webpack(mainConfig({}, { mode }), (err, stats) => {
      const r = printLog('main', err, stats)
      resolve(r)
    })
  })

function printLog (target, err, stats) {
  let success = true
  if (err) {
    success = false
    console.error(err.stack || err)
    if (err.details) {
      for (let d of err.details) {
        console.error(target + '[err]' + ': ' + red + d + reset)
      }
    }
    return success
  }

  const info = stats.toJson()
  if (stats.hasErrors()) {
    success = false
    for (let e of info.errors) {
      console.error(target + '[err]' + ': ' + red + e + reset)
    }
  }

  if (stats.hasWarnings()) {
    for (let w of info.warnings) {
      console.warn(target + '[warn]' + ': ' + yellow + w + reset)
    }
  }
  return success
}

async function main () {
  if (process.argv[2] === 'renderer') {
    process.exit((await rendererProcess()) === true ? 0 : 1)
  } else if (process.argv[2] === 'main') {
    process.exit((await mainProcess()) === true ? 0 : 1)
  } else {
    const [renderer, main] = await Promise.all([rendererProcess(), mainProcess()])
    console.log(
      renderer === true
        ? green + 'renderer: success' + reset
        : red + 'renderer: failed' + reset
    )
    console.log(
      main === true
        ? green + 'main: success' + reset
        : red + 'main: failed' + reset
    )
    process.exit(renderer === true && main === true ? 0 : 1)
  }
}

main()
