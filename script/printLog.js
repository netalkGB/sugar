const yellow = '\u001b[33m'
const reset = '\u001b[0m'
const red = '\u001b[31m'

module.exports = (target, err, stats) => {
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

  if (stats.hasWarnings()) {
    for (let w of info.warnings) {
      console.warn(target + '[warn]' + ': ' + yellow + w + reset)
    }
  }

  if (stats.hasErrors()) {
    success = false
    for (let e of info.errors) {
      console.error(target + '[err]' + ': ' + red + e + reset)
    }
  }

  return success
}
