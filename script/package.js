const { build } = require('electron-builder')
const spawn = require('cross-spawn-promise')
const config = require('../electron-builder.config.json')
const { buildMainProcess, buildPreloadScript } = require('./promiseWebpack')
const mode = 'production'

const platform = process.argv[2]

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
    const stats = await buildPreloadScript({ mode })
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
    await spawn('npm', ['run', 'nuxt-generate'], { stdio: 'inherit' })

    if (platform === 'all' || platform === 'darwin') {
      const copyConfig = JSON.parse(JSON.stringify(config))
      await build({
        config: copyConfig,
        arm64: true,
        x64: true,
        mac: ['dmg']
      })
    }

    if (platform === 'all' || platform === 'win') {
      const copyConfig = JSON.parse(JSON.stringify(config))
      await build({
        config: copyConfig,
        arm64: true,
        x64: true,
        win: ['zip']
      })
    }

    if (platform === 'all' || platform === 'linux') {
      const copyConfig = JSON.parse(JSON.stringify(config))
      await build({
        config: copyConfig,
        arm64: true,
        armv7l: true,
        x64: true,
        linux: ['tar.gz']
      })
    }

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(255)
  }
}

main()
