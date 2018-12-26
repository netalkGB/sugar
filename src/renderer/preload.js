process.once('loaded', function () {
  window.process = process
  window.ipc = require('electron').ipcRenderer
  window.remote = require('electron').remote
  window.shell = require('electron').shell
  window.log4js = require('log4js')
  window.uuidv4 = require('uuid/v4')
})
