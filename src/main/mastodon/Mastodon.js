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
  constructor ({ accessToken, host }) {
    this.mastodon = new M({
      access_token: accessToken,
      timeout_ms: 60 * 1000,
      api_url: `https://${host}/api/v1/`
    })
  }
  fetchHomeTimeline (appendParams) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('timelines/home', params)
  }
  fetchLocalTimeline (appendParams) {
    let params = { local: true }
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('timelines/public', params)
  }
  streamHomeTimeline () {
    return this.mastodon.stream('streaming/user')
  }
  streamLocalTimeline () {
    return this.mastodon.stream('streaming/public/local')
  }
  postToot (appendParams) {
    let params = {}
    if (appendParams && appendParams.toot) {
      params = { ...params, status: appendParams.toot }
    }
    return this.mastodon.post('statuses', params)
  }
  favorite (id) {
    return this.mastodon.post(`statuses/${id}/favourite`)
  }
  unFavorite (id) {
    return this.mastodon.post(`statuses/${id}/unfavourite`)
  }
  boost (id) {
    return this.mastodon.post(`statuses/${id}/reblog`)
  }
  unBoost (id) {
    return this.mastodon.post(`statuses/${id}/unreblog`)
  }
}
