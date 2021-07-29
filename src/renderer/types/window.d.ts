import { Log4js } from 'log4js'

declare global {
  interface Window {
    NODE_ENV: string | undefined,
    ipc: Electron.IpcRenderer
    remote: Electron.Remote,
    log4js: Log4js,
    uuidv4: any,
    M: any,
    fs: any,
    setImmediate: any,
    clearImmediate: any
  }
}
