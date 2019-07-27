import { ipcMain, dialog, shell } from 'electron'

export default (logger, windows) => {
  ipcMain.on('openURL', (event, arg) => {
    const isURL = arg.match(/^((^http|^https):\/\/)/g) !== null
    if (isURL) {
      shell.openExternal(arg)
    }
  })
  ipcMain.on('openDialog', (event, args) => {
    event.sender.send(
      'openDialog-success',
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
          { name: 'Movies', extensions: ['mp4'] }
        ]
      })
    )
  })
  ipcMain.on('newWindow', (event, url, type) => {
    const newWindow = (args) => {
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
