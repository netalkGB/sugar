import { ipcMain } from 'electron'
import * as serve from 'electron-serve'
import Window from '~/Window'
import WindowManagerArgs from '~/interfaces/WindowManagerArgs'
import WindowManagerFileArgs from '~/interfaces/WindowManagerFileArgs'
export default class WindowManager {
  private windows: Array<Window>
  private isDevMode: boolean
  private electronServe!: serve.loadURL
  constructor (args: WindowManagerArgs) {
    this.windows = []
    this.isDevMode = args && args.devMode
    if (args.electronServe !== undefined) {
      this.electronServe = args.electronServe
    }
  }

  public add (name: string, file: WindowManagerFileArgs, bwArgs: Electron.BrowserWindowConstructorOptions): void {
    let window: Window | undefined
    window = this.windows.find(w => w.getName() === name)
    if (window !== undefined) {
      window.show()
      return
    }
    if (this.isDevMode) {
      window = new Window(name, this.isDevMode, bwArgs)
    } else {
      window = new Window(name, this.isDevMode, bwArgs, this.electronServe)
    }

    if (name === 'main') {
      ipcMain.on('changeWindowSize', (_, type) => {
        if (window !== undefined) {
          if (type === 'main') {
            window.setSize(320, 600)
          } else {
            window.setSize(550, 400)
          }
        }
      })
    }

    if (file.filename) {
      window.loadFile(file.filename)
    }
    if (file.url) {
      window.loadURL(file.url)
    }

    this.windows.push(window)
  }
}
