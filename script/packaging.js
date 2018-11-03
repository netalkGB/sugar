const packager = require('electron-packager')
const fs = require('fs')
const del = require('del')
const { buildAll } = require('./webpack')

const packagejson = require(`${__dirname}/../package.json`)

const platform = process.argv[2]
const arch = process.argv[3]

const writeFilePromise = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })

const main = async () => {
  await del(['./dist', './prodOut'])
  if ((await buildAll()) === false) {
    process.exit(1)
  }
  const { name, version, description, license } = packagejson
  try {
    const prodPackagejson = {
      name,
      version,
      main: 'out/main/main.js',
      description,
      license
    }
    await writeFilePromise(
      './prodOut/package.json',
      JSON.stringify(prodPackagejson)
    )
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  try {
    await packager({
      arch,
      platform,
      dir: './prodOut',
      out: './dist',
      appVersion: version,
      asar: true
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
