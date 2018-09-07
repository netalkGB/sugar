import Mastodon from './mastodon/Mastodon'
import { ipcMain } from 'electron'
export default logger => {
  ipcMain.on('login', async (event, host) => {
    try {
      event.sender.send('login-success', await Mastodon.loginPhase1(host))
    } catch (e) {
      const { message, name } = e
      event.sender.send('login-error', { message, name })
    }
  })
  ipcMain.on('login2', async (event, arg) => {
    try {
      const { clientId, clientSecret, pin, host } = arg
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
}
