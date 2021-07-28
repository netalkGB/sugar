import * as serve from 'electron-serve'

export default interface WindowManagerArgs {
  devMode:boolean,
  electronServe?:serve.loadURL
}
