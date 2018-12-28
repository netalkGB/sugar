process.once('loaded', function () {
  window.NODE_ENV = process.env.NODE_ENV
  window.ipc = require('electron').ipcRenderer
  window.remote = require('electron').remote
  window.log4js = require('log4js')
  window.uuidv4 = require('uuid/v4')
})
