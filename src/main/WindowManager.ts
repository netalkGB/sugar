import { ipcMain, app } from 'electron'
import Window from '~/Window'
import WindowManagerArgs from '~/interfaces/WindowManagerArgs'
import WindowManagerFileArgs from '~/interfaces/WindowManagerFileArgs'
export default class WindowManager {
  private windows: Array<Window>
  private isDevMode: boolean

  constructor (args: WindowManagerArgs) {
    this.windows = []
    this.isDevMode = args && args.devMode
  }

  public add (name: string, file: WindowManagerFileArgs, bwArgs: Electron.BrowserWindowConstructorOptions): void {
    let window: Window | undefined
    window = this.windows.find(w => w.getName() === name)
    if (window !== undefined) {
      window.show()
      return
    }
    window = new Window(name, this.isDevMode, bwArgs)

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
    window.onClosed = (name:string) => {
      this.windows = this.windows.filter(w => w.getName() !== name)
      if (name === 'main') {
        app.quit()
      }
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
