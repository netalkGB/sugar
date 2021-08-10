const ipcRenderer = window.ipc

export default () => {
  ipcRenderer.send('openContextMenu')
}
