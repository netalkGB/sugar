import { app } from 'electron'
import log4js from 'log4js'
import WindowManager from '~/WindowManager'
import ipc from '~/ipc'
import setupMenu from '~/Menu'

let windows = new WindowManager({
  devMode: process.env.NODE_ENV === 'development'
})
const logger = log4js.getLogger('main')
const level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'
logger.level = level
logger.debug('development mode.')
ipc(logger, windows)

function createWindow () {
  windows.add(
    'main',
    { filename: 'out/renderer/index.html' },
    {
      width: 320,
      height: 600
    }
  )
  setupMenu()
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  app.quit()
})
