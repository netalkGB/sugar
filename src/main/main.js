import { app, BrowserWindow } from 'electron'
import log4js from 'log4js'
import ipc from './ipc'
let mainWindow

const logger = log4js.getLogger('main')
const level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'
logger.level = level
logger.debug('development mode.')
ipc(logger)
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadFile('out/renderer/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
