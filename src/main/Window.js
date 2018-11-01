import { BrowserWindow } from 'electron'

export default class Window {
  constructor (name, isDevMode, args) {
    this.name = name
    this.isDevMode = isDevMode
    this.setBrowserWindow(args)
  }
  setBrowserWindow (args) {
    this.browserWindow = new BrowserWindow(args)
    if (this.isDevMode === true) {
      this.browserWindow.webContents.openDevTools()
    }
    this.browserWindow.on('closed', (...arg) =>
      this.onClosed(...arg, this.name)
    )
  }
  loadFile (fname) {
    this.browserWindow.loadFile(fname)
  }
  loadURL (url) {
    this.browserWindow.loadURL(url)
  }
  show () {
    this.browserWindow.show()
    this.browserWindow.focus()
  }
  setSize (w, h) {
    this.browserWindow.setSize(w, h)
  }
}
