import * as path from 'path'
import { BrowserWindow, app } from 'electron'
import * as serve from 'electron-serve'

export default class Window {
  private name: string
  private devMode: boolean
  private browserWindow!: BrowserWindow
  private electronServe!: serve.loadURL

  constructor (name: string, isDevMode: boolean, args: Electron.BrowserWindowConstructorOptions, electronServe: serve.loadURL | undefined = undefined) {
    this.name = name
    this.devMode = isDevMode
    this.setBrowserWindow(args)
    if (electronServe !== undefined) {
      this.electronServe = electronServe
    }
  }

  public getName (): string {
    return this.name
  }

  public setName (name: string): void {
    this.name = name
  }

  public async setBrowserWindow (args: Electron.BrowserWindowConstructorOptions): Promise<void> {
    const webPreferences = {
      nodeIntegration: false,
      contextIsolation: false,
      webviewTag: false,
      preload: path.join(app.getAppPath(), 'out/renderer/preload.js'),
      enableRemoteModule: true
    }
    this.browserWindow = new BrowserWindow({
      ...args,
      webPreferences
    })
    if (this.electronServe !== undefined) {
      await this.electronServe(this.browserWindow)
    }
    if (process.platform !== 'darwin') {
      this.browserWindow.setMenu(null)
    }
    if (this.devMode === true) {
      this.browserWindow.webContents.openDevTools()
    }

    this.browserWindow.webContents.on('new-window', (e) => {
      e.preventDefault()
    })
    this.browserWindow.webContents.on('will-navigate', (e) => {
      e.preventDefault()
    })
  }

  loadFile (fname: string) {
    this.browserWindow.loadFile(fname)
  }

  loadURL (url: string) {
    this.browserWindow.loadURL(url)
  }

  show () {
    this.browserWindow.show()
    this.browserWindow.focus()
  }

  setSize (w: number, h: number) {
    this.browserWindow.setSize(w, h)
  }
}
