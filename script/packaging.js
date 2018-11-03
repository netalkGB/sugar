const packager = require('electron-packager')
const fs = require('fs')
const del = require('del')
const archiver = require('archiver')
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

const archivePromise = (dirPath, outFname, format) =>
  new Promise((resolve, reject) => {
    fs.readdir(dirPath, function (err, list) {
      if (err) {
        console.log(err + '\nskip')
        resolve()
      } else {
        const output = fs.createWriteStream(outFname)
        let archive
        if (format === 'zip') {
          archive = archiver('zip', {
            zlib: { level: 9 }
          })
        } else {
          archive = archiver('tar', {
            gzip: true,
            gzipOptions: {
              level: 1
            }
          })
        }
        output.on('close', function () {
          resolve(archive.pointer())
        })
        archive.on('error', function (err) {
          reject(err)
        })
        archive.pipe(output)
        let unpackDirName = dirPath.split('/')
        unpackDirName = unpackDirName[unpackDirName.length - 1]
        archive.directory(dirPath, unpackDirName)
        archive.finalize()
      }
    })
  })

const main = async () => {
  await del(['./dist', './prodOut'])
  if ((await buildAll({mode: 'production'})) === false) {
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
    process.exit(-1)
  }
  const nameVersion = `${name}-${version}`
  if (platform === 'darwin' || platform === 'all') {
    archivePromise(
      `./dist/${name}-darwin-x64`,
      `./dist/${nameVersion}-darwin-x64.zip`,
      'zip'
    ).catch(e => console.error(e))
  }
  if (platform === 'linux' || platform === 'all') {
    if (arch === 'x64' || arch === 'all') {
      archivePromise(
        `./dist/${name}-linux-x64`,
        `./dist/${nameVersion}-linux-x64.tar.gz`,
        'tar.gz'
      ).catch(e => console.error(e))
    }
    if (arch === 'arm64' || arch === 'all') {
      archivePromise(
        `./dist/${name}-linux-arm64`,
        `./dist/${nameVersion}-linux-arm64.tar.gz`,
        'tar.gz'
      ).catch(e => console.error(e))
    }
    if (arch === 'armv7l' || arch === 'all') {
      archivePromise(
        `./dist/${name}-linux-armv7l`,
        `./dist/${nameVersion}-linux-armv7l.tar.gz`,
        'tar.gz'
      ).catch(e => console.error(e))
    }
    if (arch === 'ia32' || arch === 'all') {
      archivePromise(
        `./dist/${name}-linux-ia32`,
        `./dist/${nameVersion}-linux-ia32.tar.gz`,
        'tar.gz'
      ).catch(e => console.error(e))
    }
  }
  if (platform === 'win32' || platform === 'all') {
    if (arch === 'x64' || arch === 'all') {
      archivePromise(
        `./dist/${name}-win32-x64`,
        `./dist/${nameVersion}-win32-x64.zip`,
        'zip'
      ).catch(e => console.error(e))
    }
    if (arch === 'ia32' || arch === 'all') {
      archivePromise(
        `./dist/${name}-win32-ia32`,
        `./dist/${nameVersion}-win32-ia32.zip`,
        'zip'
      ).catch(e => console.error(e))
    }
  }
}

main()
