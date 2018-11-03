const { buildAll, rendererProcess, mainProcess } = require('./webpack')

async function main () {
  const mode = process.argv[2]
  const target = process.argv[3]
  if (target === 'renderer') {
    process.exit((await rendererProcess({ mode })) === true ? 0 : 1)
  } else if (target === 'main') {
    process.exit((await mainProcess({ mode })) === true ? 0 : 1)
  } else {
    process.exit((await buildAll(mode)) ? 0 : 1)
  }
}

main()
