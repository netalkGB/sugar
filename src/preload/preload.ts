import { Logger } from 'log4js'
import 'electron'
interface Window {
  NODE_ENV:string | undefined,
  ipc:Electron.IpcRenderer
  remote:Electron.Remote,
  log4js:Logger,
  uuidv4:any,
  M:any,
  fs:any,
  setImmediate:any,
  clearImmediate:any
}

declare var window:Window



const _setImmediate = window.setImmediate
const _clearImmediate = window.clearImmediate

process.once('loaded', function () {
  window.NODE_ENV = process.env.NODE_ENV
  window.ipc = require('electron').ipcRenderer
  window.remote = require('electron').remote
  window.log4js = require('log4js')
  window.uuidv4 = require('uuid/v4')
  window.M = require('mastodon-api')
  window.fs = require('fs')
  global.setImmediate = _setImmediate
  global.clearImmediate = _clearImmediate
})
