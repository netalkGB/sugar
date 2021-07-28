import { app, ipcMain } from 'electron'
import Window from '~/Window'

export default class WindowManager {
  constructor (args) {
    this.windows = []
    this.isDevMode = args && args.devMode
  }
  add (name, file, bwArgs) {
    let window
    window = this.windows.find(w => w.name === name)
    if (window !== undefined) {
      window.show()
      return
    }
    window = new Window(name, this.isDevMode, bwArgs)
    if (name === 'main') {
      ipcMain.on('changeWindowSize', (event, type) => {
        if (type === 'main') {
          window.setSize(320, 600)
        } else {
          window.setSize(550, 400)
        }
      })
    }
    window.onClosed = (ev, name) => {
      this.windows = this.windows.filter(w => w.name !== name)
      if (name === 'main') {
        app.quit()
      }
    }
    if (file.filename) {
      window.loadFile(file.filename)
    } else {
      window.loadURL(file.url)
    }

    this.windows.push(window)
  }
}
