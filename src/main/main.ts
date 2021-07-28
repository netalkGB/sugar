// const { app: electronApp, BrowserWindow } = require('electron')
import { app } from 'electron'
import * as serve from 'electron-serve'
import * as log4js from 'log4js'
import WindowManager from '~/WindowManager'
import ipc from '~/ipc'
import setupMenu from '~/Menu'

const isDev = process.env.NODE_ENV === 'development'
const port = 3000

if (isDev === false) {
  serve({ directory: 'out/renderer' })
}

const windows = new WindowManager({ devMode: isDev })

const logger = log4js.getLogger('main')
const level = isDev ? 'all' : 'warn'
logger.level = level
logger.debug('development mode.')
ipc(logger, windows)

function createWindow () {
  const url = isDev ? `http://localhost:${port}/` : 'app://-/'
  windows.add(
    'main',
    { url },
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
