import { app, BrowserWindow, ipcMain } from 'electron'
import log4js from 'log4js'
import ipc from './ipc'
let mainWindow

const logger = log4js.getLogger('main')
const level = process.env.NODE_ENV === 'development' ? 'all' : 'warn'
logger.level = level
logger.debug('development mode.')
ipc(logger, mainWindow)
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 600
  })
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadFile('out/renderer/index.html')
  ipcMain.on('changeWindowSize', (event, type) => {
    if (type === 'main') {
      mainWindow.setSize(320, 600)
    } else {
      mainWindow.setSize(550, 400)
    }
  })
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
