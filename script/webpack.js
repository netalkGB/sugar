const webpack = require('webpack')
const mainConfig = require('../webpack.config.main.js')
const rendererConfig = require('../webpack.config.renderer.js')
const printLog = require('./printLog')

const reset = '\u001b[0m'
const green = '\u001b[32m'
const red = '\u001b[31m'
const yellow = '\u001b[33m'


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

const buildAll = async mode => {
    const [renderer, main] = await Promise.all([
        rendererProcess({ mode }),
        mainProcess({ mode })
    ])


    const mainResult =
        (main === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    const rendererResult =
        (renderer === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
    console.log('main:     ' + mainResult)
    console.log('renderer: ' + rendererResult)
    return main === true && renderer === true
}

const watch = ({ mode }) => {
    const mainCompiler = webpack(mainConfig({}, { mode }))
    const rendererCompiler = webpack(rendererConfig({}, { mode }))

    console.log(yellow + 'initial building...' + reset)

    let mainResult = yellow + 'initial building...' + reset
    let rendererResult = yellow + 'initial building...' + reset

    mainCompiler.watch(
        {
            aggregateTimeout: 300,
            poll: 150
        },
        (err, stats) => {
            const r = printLog('renderer', err, stats)
            mainResult = (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
            console.log('main:     ' + mainResult)
            console.log('renderer: ' + rendererResult)
        }
    )

    rendererCompiler.watch(
        {
            aggregateTimeout: 300,
            poll: 150
        },
        (err, stats) => {
            const r = printLog('main', err, stats)
            rendererResult = (r === true ? green + 'success 🙆' : red + 'failed 🙅') + reset
            console.log('main:     ' + mainResult)
            console.log('renderer: ' + rendererResult)
        }
    )

}

exports.buildAll = buildAll
exports.mainProcess = mainProcess
exports.rendererProcess = rendererProcess
exports.watch = watch
