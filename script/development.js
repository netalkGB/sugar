const { loadNuxt, build } = require('nuxt')
const spawn = require('cross-spawn-promise')
const express = require('express')()
const { buildMainProcess } = require('./promiseWebpack')

const port = 3000
const mode = 'development'

const reset = '\u001B[0m'
const red = '\u001B[31m'

async function main () {
  /* eslint no-console: 0 */
  try {
    const stats = await buildMainProcess({ mode })
    console.log(stats.toString({ colors: true }))
    if (stats.hasErrors()) {
      process.exit(255)
    }
  } catch (error) {
    console.error(error.stack || error)
    if (err.details) {
      for (const d of err.details) {
        console.error('main process ' + '[err]' + ': ' + red + d + reset)
      }
      process.exit(255)
    }
  }

  try {
    const nuxt = await loadNuxt('dev')
    express.use(nuxt.render)
    await build(nuxt)
    express.listen(port, '0.0.0.0')
    await spawn('npm', ['run', 'dev-electron-start'], { stdio: 'inherit' })
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(255)
  }
}

main()
