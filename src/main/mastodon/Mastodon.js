import M from 'mastodon-api'
export default class Mastodon {
  static async loginPhase1 (host) {
    let clientId
    let clientSecret
    let url
    const res = await M.createOAuthApp(
      `https://${host}/api/v1/apps`,
      'mastoot',
      'read write follow'
    )
    clientId = res.client_id
    clientSecret = res.client_secret
    url = await M.getAuthorizationUrl(
      clientId,
      clientSecret,
      `https://${host}`,
      'read write follow'
    )
    return { clientId, clientSecret, url }
  }
  static async loginPhase2 (clientId, clientSecret, pin, host) {
    const accessToken = await M.getAccessToken(
      clientId,
      clientSecret,
      pin,
      `https://${host}`
    )
    return accessToken
  }
}
