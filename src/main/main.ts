const { app: electronApp, BrowserWindow } = require('electron')
const serve = require('electron-serve')
const isDev = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 3000

let loadURL = null
if (isDev === false) {
  loadURL = serve({ directory: 'out/renderer' })
}

async function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL(`http://localhost:${port}/`)
    win.webContents.openDevTools()
  } else {
    await loadURL(win)
    // win.webContents.openDevTools()
    await win.loadURL('app://-/')
  }
}
function start () {
  electronApp.whenReady().then(() => createWindow())

  electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      electronApp.quit()
    }
  })

  electronApp.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}

start()
