import Mastodon from 'mastodon-api'
import { ipcMain } from 'electron'
export default logger => {
  ipcMain.on('login', async (event, host) => {
    try {
      const res = await Mastodon.createOAuthApp(
        `https://${host}/api/v1/apps`,
        'mastoot',
        'read write follow'
      )
      const clientId = res.client_id
      const clientSecret = res.client_secret
      const url = await Mastodon.getAuthorizationUrl(
        clientId,
        clientSecret,
        `https://${host}`,
        'read write follow'
      )
      event.sender.send('login-success', {
        clientId,
        clientSecret,
        url
      })
    } catch (e) {
      event.sender.send('login-error', e)
    }
  })
  ipcMain.on('login2', (event, arg) => {
    Mastodon.getAccessToken(
      arg.clientId,
      arg.clientSecret,
      arg.pin,
      `https://${arg.host}`
    )
      .then(accessToken => {
        logger.debug('token', accessToken)
        event.sender.send('login2-success', { ...arg, accessToken })
      })
      .catch(e => {
        event.sender.send('login2-error', e)
      })
  })
}
