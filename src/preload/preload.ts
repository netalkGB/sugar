import { Log4js } from 'log4js'
import 'electron'
interface Window {
  NODE_ENV:string | undefined,
  ipc:Electron.IpcRenderer
  log4js:Log4js,
  uuidv4:any,
  M:any,
  fs:any,
  setImmediate:any,
  clearImmediate:any
}

declare const window:Window

const _setImmediate = window.setImmediate
const _clearImmediate = window.clearImmediate

process.once('loaded', function () {
  window.NODE_ENV = process.env.NODE_ENV
  window.ipc = require('electron').ipcRenderer
  window.log4js = require('log4js')
  window.uuidv4 = require('uuid/v4')
  window.M = require('mastodon-api')
  window.fs = require('fs')
  global.setImmediate = _setImmediate
  global.clearImmediate = _clearImmediate
})
