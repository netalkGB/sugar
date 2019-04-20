import M from 'mastodon-api'
const fs = require('fs')

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
    this.mastodon2 = new M({
      access_token: accessToken,
      timeout_ms: 60 * 1000,
      api_url: `https://${host}/api/v2/`
    })
  }
  fetchOwnAccount () {
    return this.mastodon.get('accounts/verify_credentials', {})
  }
  fetchProfile (id) {
    return this.mastodon.get('accounts/' + id)
  }
  searchMastodon (q) {
    const params = { q }
    return this.mastodon2.get('search', params)
  }
  fetchOwnFavouriteTimeline (appendParams) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('favourites', params)
  }
  fetchProfileTimeline (id, appendParams) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('accounts/' + id + '/statuses', params)
  }
  fetchProfileFollowers (id, appendParams) {
    let params = {}
    if (appendParams && appendParams.limit) {
      params = { ...params, limit: appendParams.limit }
    }
    return this.mastodon.get('accounts/' + id + '/followers', params)
  }
  fetchProfileFollowing (id, appendParams) {
    let params = {}
    if (appendParams && appendParams.limit) {
      params = { ...params, limit: appendParams.limit }
    }
    return this.mastodon.get('accounts/' + id + '/following', params)
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
  fetchPublicTimeline (appendParams) {
    let params = { local: false }
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('timelines/public', params)
  }
  fetchNotification (appendParams) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    return this.mastodon.get('notifications', params)
  }
  streamHomeTimeline () {
    return this.mastodon.stream('streaming/user')
  }
  streamLocalTimeline () {
    return this.mastodon.stream('streaming/public/local')
  }
  streamPublicTimeline () {
    return this.mastodon.stream('streaming/public')
  }
  postToot (params) {
    const {
      status,
      visibility,
      inReplyToID,
      mediaIDs,
      sensitive,
      isCW,
      spoilerText
    } = params
    let opts = {
      status,
      visibility
    }
    if (inReplyToID !== undefined && inReplyToID !== null) {
      opts = { ...opts, in_reply_to_id: inReplyToID }
    }
    if (mediaIDs !== undefined && inReplyToID !== null && mediaIDs.length > 0) {
      opts = { ...opts, media_ids: mediaIDs }
    }
    if (sensitive !== undefined && sensitive !== null) {
      opts = { ...opts, sensitive }
    }
    if (isCW !== undefined && isCW !== null) {
      opts = { ...opts, cw: isCW }
    }
    if (spoilerText !== undefined && spoilerText !== null) {
      opts = { ...opts, spoiler_text: spoilerText }
    }
    return this.mastodon.post('statuses', opts)
  }
  async uploadFile (params) {
    const { filePath } = params
    const response = await this.mastodon.post('media', {
      file: fs.createReadStream(filePath)
    })
    return response
  }
  deleteOwnToot (id) {
    return this.mastodon.delete(`statuses/${id}`)
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
  fetchToot (id) {
    return this.mastodon.get(`statuses/${id}`)
  }
  fetchContext (id) {
    return this.mastodon.get(`statuses/${id}/context`)
  }
}
