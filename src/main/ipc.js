import Mastodon from './mastodon/Mastodon'
import { ipcMain } from 'electron'

export default logger => {
  let clients = []
  function getClient (accessToken, host) {
    let client = clients.find(
      cli => cli.host === host && cli.accessToken === accessToken
    )
    if (!client) {
      logger.debug('new client')
      const mastodon = new Mastodon({ accessToken, host })
      clients = [...clients, { host, accessToken, mastodon }]
      return mastodon
    } else {
      logger.debug('reuse client')
      return client.mastodon
    }
  }
  ipcMain.on('login', async (event, host) => {
    try {
      event.sender.send('login-success', await Mastodon.loginPhase1(host))
    } catch (e) {
      const { message, name } = e
      logger.debug(message)
      event.sender.send('login-error', { message, name })
    }
  })
  ipcMain.on('login2', async (event, args) => {
    try {
      const { clientId, clientSecret, pin, host } = args
      const accessToken = await Mastodon.loginPhase2(
        clientId,
        clientSecret,
        pin,
        host
      )
      event.sender.send('login2-success', {
        clientId,
        clientSecret,
        pin,
        host,
        accessToken
      })
    } catch (e) {
      const { message, name } = e
      event.sender.send('login2-error', { message, name })
    }
  })
  ipcMain.on('fetchHomeTimeline', async (event, args) => {
    try {
      const { host, accessToken } = args
      const result = await getClient(accessToken, host).fetchHomeTimeline()
      event.sender.send('fetchHomeTimeline-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchHomeTimeline-error', { message, name })
    }
  })
  ipcMain.once('streamHomeTimeline', async (event, args) => {
    ipcMain.removeAllListeners(['streamHomeTimeline'])
    try {
      const { host, accessToken } = args
      const stream = await getClient(accessToken, host).streamHomeTimeline()
      stream.on('message', msg => {
        event.sender.send('streamHomeTimeline-onMessage', msg)
      })
      stream.on('error', error => {
        event.sender.send('streamHomeTimeline-onError', error)
        ipcMain.removeListener('streamHomeTimeline', () => {})
      })
    } catch (e) {
      const { message, name } = e
      event.sender.send('streamHomeTimeline-error', { message, name })
      ipcMain.removeListener('streamHomeTimeline', () => {})
    }
  })

  ipcMain.on('fetchLocalTimeline', async (event, args) => {
    try {
      const { host, accessToken } = args
      const result = await getClient(accessToken, host).fetchLocalTimeline()
      event.sender.send('fetchLocalTimeline-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchLocalTimeline-error', { message, name })
    }
  })
  ipcMain.once('streamLocalTimeline', async (event, args) => {
    ipcMain.removeAllListeners(['streamLocalTimeline'])
    try {
      const { host, accessToken } = args
      const stream = await getClient(accessToken, host).streamLocalTimeline()
      stream.on('message', msg => {
        event.sender.send('streamLocalTimeline-onMessage', msg)
      })
      stream.on('error', error => {
        event.sender.send('streamLocalTimeline-onError', error)
        ipcMain.removeListener('streamLocalTimeline', () => {})
      })
    } catch (e) {
      const { message, name } = e
      event.sender.send('streamLocalTimeline-error', { message, name })
      ipcMain.removeListener('streamLocalTimeline', () => {})
    }
  })
}
