import { ipcMain, dialog, shell } from 'electron'
import { Logger } from 'log4js'
import WindowManager from '~/WindowManager'

export default function (_logger:Logger, windows:WindowManager) {
  ipcMain.on('openURL', (_event, arg) => {
    const isURL = arg.match(/^((^http|^https):\/\/)/g) !== null
    if (isURL) {
      shell.openExternal(arg)
    }
  })
  ipcMain.handle('openDialog', () => {
    const appendFile = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
        { name: 'Movies', extensions: ['mp4'] }
      ]
    })
    return appendFile
  })
  ipcMain.on('newWindow', (_, url:string, type) => {
    const newWindow = (args: { width: number; height: number }) => {
      const { width, height } = args
      windows.add(
        url,
        { url },
        {
          width,
          height
        })
    }
    switch (type) {
      case 'newToot':
        newWindow({ width: 320, height: 150 })
        break
      case 'conversations':
        newWindow({ width: 280, height: 400 })
        break
      case 'imagePreview':
        newWindow({ width: 640, height: 480 })
        break
      case 'searchWindow':
        newWindow({ width: 256, height: 500 })
        break
      case 'favouriteWindow':
        newWindow({ width: 256, height: 480 })
        break
      default:
        newWindow({ width: 256, height: 500 })
        break
    }
  })
}
