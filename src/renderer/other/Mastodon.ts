import ServerSideError from '@/other/ServerSideError'
import { Entity } from 'megalodon'

const { M, fs } = window

export default class Mastodon {
  static async loginPhase1 (host:string) {
    const res = await M.createOAuthApp(
      `https://${host}/api/v1/apps`,
      'sugar',
      'read write follow'
    )
    const clientId = res.client_id
    const clientSecret = res.client_secret
    const url = await M.getAuthorizationUrl(
      clientId,
      clientSecret,
      `https://${host}`,
      'read write follow'
    )
    return { clientId, clientSecret, url }
  }

  static async loginPhase2 (clientId:string, clientSecret:string, pin:string, host:string) {
    const accessToken = await M.getAccessToken(
      clientId,
      clientSecret,
      pin,
      `https://${host}`
    )
    return accessToken
  }

  static mastodons:Array<{ accessToken:string, host:string, mastodon:any }> = []
  static getMastodon ({ accessToken, host }:{accessToken:string;host:string}):Mastodon {
    let client = Mastodon.mastodons.find(val =>
      (val.accessToken === accessToken && val.host === host)
    )
    if (!client) {
      const mastodon = new Mastodon({ accessToken, host })
      client = { accessToken, host, mastodon }
      Mastodon.mastodons = [...Mastodon.mastodons, client]
    }
    return client.mastodon
  }

  private mastodon:any

  private mastodon2:any

  constructor ({ accessToken, host }:{accessToken:string, host:string}) {
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

  async fetchProfile (id:string) {
    const { resp, data } = await this.mastodon.get('accounts/' + id)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async searchMastodon (q:string) {
    const params = { q }
    const { resp, data } = await this.mastodon2.get('search', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchOwnFavouriteTimeline (appendParams:any = undefined) {
    let params = {}
    if (appendParams && appendParams.limit) {
      params = { ...params, limit: appendParams.limit }
    }
    const { resp, data } = await this.mastodon.get('favourites', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchProfileTimeline (id:string, appendParams:any = undefined) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    const { resp, data } = await this.mastodon.get('accounts/' + id + '/statuses', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchProfileFollowers (id:string, appendParams:any = undefined):Promise<Array<Entity.Account>> {
    let params = {}
    if (appendParams && appendParams.limit) {
      params = { ...params, limit: appendParams.limit }
    }
    const { resp, data } = await this.mastodon.get('accounts/' + id + '/followers', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchProfileFollowing (id:string, appendParams:any = undefined):Promise<Array<Entity.Account>> {
    let params = {}
    if (appendParams && appendParams.limit) {
      params = { ...params, limit: appendParams.limit }
    }
    const { resp, data } = await this.mastodon.get('accounts/' + id + '/following', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchHomeTimeline (appendParams:any = undefined) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    const { resp, data } = await this.mastodon.get('timelines/home', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchLocalTimeline (appendParams:any = undefined) {
    let params:any = { local: true }
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    const { resp, data } = await this.mastodon.get('timelines/public', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchPublicTimeline (appendParams:any = undefined) {
    let params:any = { local: false }
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    const { resp, data } = await this.mastodon.get('timelines/public', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchNotification (appendParams:any = undefined) {
    let params = {}
    if (appendParams && appendParams.maxID) {
      params = { ...params, max_id: appendParams.maxID }
    }
    const { resp, data } = await this.mastodon.get('notifications', params)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
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

  async postToot (params:any) {
    const {
      status,
      visibility,
      inReplyToID,
      mediaIDs,
      sensitive,
      isCW,
      spoilerText
    } = params
    let opts:any = {
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
    const { resp, data } = await this.mastodon.post('statuses', opts)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async uploadFile (params:any) {
    const { filePath } = params
    const { resp, data } = await this.mastodon.post('media', {
      file: fs.createReadStream(filePath)
    })
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async deleteOwnToot (id:string) {
    const { resp, data } = await this.mastodon.delete(`statuses/${id}`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async favorite (id:string) {
    const { resp, data } = await this.mastodon.post(`statuses/${id}/favourite`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async unFavorite (id:string) {
    const { resp, data } = await this.mastodon.post(`statuses/${id}/unfavourite`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async boost (id:string) {
    const { resp, data } = await this.mastodon.post(`statuses/${id}/reblog`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async unBoost (id:string) {
    const { resp, data } = await this.mastodon.post(`statuses/${id}/unreblog`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchToot (id:string) {
    const { resp, data } = await this.mastodon.get(`statuses/${id}`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }

  async fetchContext (id:string) {
    const { resp, data } = await this.mastodon.get(`statuses/${id}/context`)
    const { statusCode } = resp
    if (statusCode !== 200) {
      throw new ServerSideError(statusCode)
    }
    return data
  }
}
