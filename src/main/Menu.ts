import { Menu, app } from 'electron'

export default () => {
  const nodeEnv = process.env.NODE_ENV
  const platform = process.platform

  if (platform !== 'darwin') {
    return
  }


  let template:Electron.MenuItemConstructorOptions[]

  if (nodeEnv === 'development') {
    template = [
      {
        label: app.getName(),
        submenu: [
          { role: 'about', label: app.getName() + 'について' },
          { type: 'separator' },
          { role: 'services', label: 'サービス', submenu: [] },
          { type: 'separator' },
          { role: 'hide', label: app.getName() + ' を非表示にする' },
          { role: 'hideOthers', label: 'その他を非表示にする' },
          { role: 'unhide', label: 'すべてを表示' },
          { type: 'separator' },
          { role: 'quit', label: app.getName() + ' を終了' }
        ]
      },
      {
        label: 'ファイル',
        submenu: [
          { role: 'close', label: 'ウインドウを閉じる' }
        ]
      },
      {
        label: '編集',
        submenu: [
          { role: 'undo', label: '元に戻す' },
          { role: 'redo', label: 'やり直し' },
          { type: 'separator' },
          { role: 'cut', label: 'カット' },
          { role: 'copy', label: 'コピー' },
          { role: 'paste', label: 'ペースト' },
          { role: 'pasteAndMatchStyle', label: 'ペーストしてスタイルを合わせる' },
          { role: 'delete', label: '削除' },
          { role: 'selectAll', label: 'すべて選択' }
        ]
      },
      {
        label: '表示',
        submenu: [
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: 'フルスクリーンの切り替え' },
          { role: 'resetZoom', label: '実際のサイズ' },
          { role: 'zoomIn', label: '拡大' },
          { role: 'zoomOut', label: '縮小' }
        ]
      },
      {
        role: 'window',
        label: 'ウィンドウ',
        submenu: [
          { role: 'minimize', label: '最小化' },
          { role: 'zoom', label: '拡大/縮小' },
          { type: 'separator' },
          { role: 'front', label: 'すべてを手前に移動' }
        ]
      },
      {
        role: 'help',
        label: 'ヘルプ',
        submenu: [
          {
            label: 'リポジトリ',
            click () { require('electron').shell.openExternal('https://github.com/netalkGB/mastoot') }
          }
        ]
      }
    ]
  } else {
    template = [
      {
        label: app.getName(),
        submenu: [
          { role: 'about', label: app.getName() + 'について' },
          { type: 'separator' },
          { role: 'services', label: 'サービス', submenu: [] },
          { type: 'separator' },
          { role: 'hide', label: app.getName() + ' を非表示にする' },
          { role: 'hideOthers', label: 'その他を非表示にする' },
          { role: 'unhide', label: 'すべてを表示' },
          { type: 'separator' },
          { role: 'quit', label: app.getName() + ' を終了' }
        ]
      },
      {
        label: 'ファイル',
        submenu: [
          { role: 'close', label: 'ウインドウを閉じる' }
        ]
      },
      {
        label: '編集',
        submenu: [
          { role: 'undo', label: '元に戻す' },
          { role: 'redo', label: 'やり直し' },
          { type: 'separator' },
          { role: 'cut', label: 'カット' },
          { role: 'copy', label: 'コピー' },
          { role: 'paste', label: 'ペースト' },
          { role: 'pasteAndMatchStyle', label: 'ペーストしてスタイルを合わせる' },
          { role: 'delete', label: '削除' },
          { role: 'selectAll', label: 'すべて選択' }
        ]
      },
      {
        label: '表示',
        submenu: [
          { role: 'togglefullscreen', label: 'フルスクリーンの切り替え' },
          { role: 'resetZoom', label: '実際のサイズ' },
          { role: 'zoomIn', label: '拡大' },
          { role: 'zoomOut', label: '縮小' }
        ]
      },
      {
        role: 'window',
        label: 'ウィンドウ',
        submenu: [
          { role: 'minimize', label: '最小化' },
          { role: 'zoom', label: '拡大/縮小' },
          { type: 'separator' },
          { role: 'front', label: 'すべてを手前に移動' }
        ]
      },
      {
        role: 'help',
        label: 'ヘルプ',
        submenu: [
          {
            label: 'リポジトリ',
            click () { require('electron').shell.openExternal('https://github.com/netalkGB/mastoot') }
          }
        ]
      }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
