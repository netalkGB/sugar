import Mastodon from '~/mastodon/Mastodon'
import { ipcMain, dialog } from 'electron'

export default (logger, windows) => {
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
  ipcMain.on('fetchOwnAccount', async (event, args) => {
    try {
      const { host, accessToken } = args
      const result = await getClient(accessToken, host).fetchOwnAccount()
      event.sender.send('fetchOwnAccount-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchOwnAccount-error', { message, name })
    }
  })
  ipcMain.on('fetchHomeTimeline', async (event, args) => {
    try {
      const { host, accessToken, maxID } = args
      let opt = {}
      if (maxID) {
        opt = { ...opt, maxID }
      }
      const result = await getClient(accessToken, host).fetchHomeTimeline(opt)
      event.sender.send('fetchHomeTimeline-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchHomeTimeline-error', { message, name })
    }
  })
  ipcMain.once('streamHomeTimeline', async (event, args) => {
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
    }
  })
  ipcMain.on('favorite', async (event, args) => {
    try {
      const { host, accessToken, id } = args
      const result = await getClient(accessToken, host).favorite(id)
      event.sender.send('favorite-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('favorite-error', { message, name })
    }
  })
  ipcMain.on('unFavorite', async (event, args) => {
    try {
      const { host, accessToken, id } = args
      const result = await getClient(accessToken, host).unFavorite(id)
      event.sender.send('unFavorite-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('unFavorite-error', { message, name })
    }
  })
  ipcMain.on('boost', async (event, args) => {
    try {
      const { host, accessToken, id } = args
      const result = await getClient(accessToken, host).boost(id)
      event.sender.send('boost-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('boost-error', { message, name })
    }
  })
  ipcMain.on('unBoost', async (event, args) => {
    try {
      const { host, accessToken, id } = args
      const result = await getClient(accessToken, host).unBoost(id)
      event.sender.send('unBoost-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('unBoost-error', { message, name })
    }
  })
  ipcMain.on('fetchLocalTimeline', async (event, args) => {
    try {
      const { host, accessToken, maxID } = args
      let opt = {}
      if (maxID) {
        opt = { ...opt, maxID }
      }
      const result = await getClient(accessToken, host).fetchLocalTimeline(opt)
      event.sender.send('fetchLocalTimeline-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchLocalTimeline-error', { message, name })
    }
  })
  ipcMain.on('fetchPublicTimeline', async (event, args) => {
    try {
      const { host, accessToken, maxID } = args
      let opt = {}
      if (maxID) {
        opt = { ...opt, maxID }
      }
      const result = await getClient(accessToken, host).fetchPublicTimeline(opt)
      event.sender.send('fetchPublicTimeline-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchPublicTimeline-error', { message, name })
    }
  })
  ipcMain.on('fetchNotification', async (event, args) => {
    try {
      const { host, accessToken, maxID } = args
      let opt = {}
      if (maxID) {
        opt = { ...opt, maxID }
      }
      const result = await getClient(accessToken, host).fetchNotification(opt)
      event.sender.send('fetchNotification-success', result)
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchNotification-error', { message, name })
    }
  })
  ipcMain.once('streamLocalTimeline', async (event, args) => {
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
    }
  })
  ipcMain.once('streamPublicTimeline', async (event, args) => {
    try {
      const { host, accessToken } = args
      const stream = await getClient(accessToken, host).streamPublicTimeline()
      stream.on('message', msg => {
        event.sender.send('streamPublicTimeline-onMessage', msg)
      })
      stream.on('error', error => {
        event.sender.send('streamPublicTimeline-onError', error)
        ipcMain.removeListener('streamPublicTimeline', () => {})
      })
    } catch (e) {
      const { message, name } = e
      event.sender.send('streamPublicTimeline-error', { message, name })
    }
  })
  ipcMain.on('postToot', async (event, args) => {
    const { host, accessToken, toot } = args
    try {
      const result = await getClient(accessToken, host).postToot(toot)
      event.sender.send('postToot-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('postToot-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('deleteOwnToot', async (event, args) => {
    const { host, accessToken, id } = args
    try {
      const result = await getClient(accessToken, host).deleteOwnToot(id)
      event.sender.send('deleteOwnToot-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('deleteOwnToot-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('fetchToot', async (event, args) => {
    const { host, accessToken, id } = args
    try {
      const result = await getClient(accessToken, host).fetchToot(id)
      event.sender.send('fetchToot-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchToot-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('fetchContext', async (event, args) => {
    const { host, accessToken, id } = args
    try {
      const result = await getClient(accessToken, host).fetchContext(id)
      event.sender.send('fetchContext-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchContext-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('fetchProfile', async (event, args) => {
    const { host, accessToken, id } = args
    try {
      const result = await getClient(accessToken, host).fetchProfile(id)
      event.sender.send('fetchProfile-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchProfile-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('fetchProfileTimeline', async (event, args) => {
    const { host, accessToken, id, maxID } = args
    try {
      const result = await getClient(accessToken, host).fetchProfileTimeline(
        id,
        { maxID }
      )
      event.sender.send('fetchProfileTimeline-success', { result, host, accessToken })
    } catch (e) {
      const { message, name } = e
      event.sender.send('fetchProfileTimeline-error', {
        error: { message, name },
        host,
        accessToken
      })
    }
  })
  ipcMain.on('uploadFile', async (event, args) => {
    const { host, accessToken, filePath, uuid } = args
    try {
      const result = await getClient(accessToken, host).uploadFile({ filePath })
      event.sender.send('uploadFile-success', {
        result,
        host,
        accessToken,
        uuid
      })
    } catch (e) {
      const { message, name } = e
      event.sender.send('uploadFile-error', {
        error: { message, name },
        host,
        accessToken,
        uuid
      })
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
    if (type === 'newToot') {
      windows.add(
        url,
        { url },
        {
          width: 320,
          height: 150
        }
      )
    } else if (type === 'conversations') {
      windows.add(
        url,
        { url },
        {
          width: 280,
          height: 400
        }
      )
    } else {
      windows.add(
        url,
        { url },
        {
          width: 300,
          height: 550
        }
      )
    }
  })
}
