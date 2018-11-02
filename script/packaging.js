const packager = require('electron-packager')
const { version } = require(`${__dirname}/../package.json`)

const platform = process.argv[2]
async function main () {
  try {
    await packager({
      arch: 'all',
      platform,
      dir: './',
      out: './dist',
      appVersion: version
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
