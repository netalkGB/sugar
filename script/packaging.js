const packager = require('electron-packager')
const fs = require('fs')
const { buildAll } = require('./webpack')

const packagejson = require(`${__dirname}/../package.json`)

const platform = process.argv[2]
async function main () {
  if ((await buildAll()) === false) {
    process.exit(1)
  }
  const { name, version, description, license } = packagejson
  const prodPackagejson = {
    name,
    version,
    main: 'out/main/main.js',
    description,
    license
  }
  fs.writeFileSync('./prodOut/package.json', JSON.stringify(prodPackagejson))
  try {
    await packager({
      arch: 'all',
      platform,
      dir: './out',
      out: './dist',
      appVersion: version
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
