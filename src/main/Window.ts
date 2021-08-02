import * as path from 'path'
import { BrowserWindow, app } from 'electron'

export default class Window {
  private _name: string
  private _devMode: boolean
  private _browserWindow!: BrowserWindow
  private _onClosed: Function | undefined
  constructor (name: string, isDevMode: boolean, args: Electron.BrowserWindowConstructorOptions) {
    this._name = name
    this._devMode = isDevMode
    this.setBrowserWindow(args)
  }

  get name (): string {
    return this._name
  }

  set name (name: string) {
    this._name = name
  }

  get onClosed () {
    return this._onClosed
  }

  set onClosed (onClosed: Function | undefined) {
    this._onClosed = onClosed
  }

  public setBrowserWindow (args: Electron.BrowserWindowConstructorOptions): void {
    const webPreferences = {
      nodeIntegration: false,
      contextIsolation: false,
      webviewTag: false,
      preload: path.join(app.getAppPath(), 'out/preload/preload.js'),
      enableRemoteModule: true
    }
    this._browserWindow = new BrowserWindow({
      ...args,
      webPreferences
    })
    this._browserWindow.on('closed', () => {
      if (this.onClosed) {
        this.onClosed(this._name)
      }
    })
    if (process.platform !== 'darwin') {
      this._browserWindow.setMenu(null)
    }
    if (this._devMode === true) {
      this._browserWindow.webContents.openDevTools()
    }

    this._browserWindow.webContents.on('new-window', (e) => {
      e.preventDefault()
    })
    this._browserWindow.webContents.on('will-navigate', (e) => {
      e.preventDefault()
    })
  }

  loadFile (fname: string) {
    this._browserWindow.loadFile(fname)
  }

  loadURL (url: string) {
    this._browserWindow.loadURL(url)
  }

  show () {
    this._browserWindow.show()
    this._browserWindow.focus()
  }

  setSize (w: number, h: number) {
    this._browserWindow.setSize(w, h)
  }
}
