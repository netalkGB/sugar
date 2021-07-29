import ServerSideError from '@/other/ServerSideError'

const { M, fs } = window

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

  static mastodons = []
  static getMastodon ({ accessToken, host }) {
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

  async fetchProfile (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.get('accounts/' + id)
      const { statusCode } = resp
      returnData = data
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async searchMastodon (q) {
    let returnData
    try {
      const params = { q }
      const { resp, data } = await this.mastodon2.get('search', params)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchOwnFavouriteTimeline (appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.limit) {
        params = { ...params, limit: appendParams.limit }
      }
      const { resp, data } = await this.mastodon.get('favourites', params)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchProfileTimeline (id, appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.maxID) {
        params = { ...params, max_id: appendParams.maxID }
      }
      const { resp, data } = await this.mastodon.get('accounts/' + id + '/statuses', params)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchProfileFollowers (id, appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.limit) {
        params = { ...params, limit: appendParams.limit }
      }
      const { resp, data } = await this.mastodon.get('accounts/' + id + '/followers', params)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchProfileFollowing (id, appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.limit) {
        params = { ...params, limit: appendParams.limit }
      }
      const { resp, data } = await this.mastodon.get('accounts/' + id + '/following', params)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchHomeTimeline (appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.maxID) {
        params = { ...params, max_id: appendParams.maxID }
      }
      const { resp, data } = await this.mastodon.get('timelines/home', params)
      const { statusCode } = resp
      returnData = data
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchLocalTimeline (appendParams) {
    let returnData
    try {
      let params = { local: true }
      if (appendParams && appendParams.maxID) {
        params = { ...params, max_id: appendParams.maxID }
      }
      const { resp, data } = await this.mastodon.get('timelines/public', params)
      const { statusCode } = resp
      returnData = data
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchPublicTimeline (appendParams) {
    let returnData
    try {
      let params = { local: false }
      if (appendParams && appendParams.maxID) {
        params = { ...params, max_id: appendParams.maxID }
      }
      const { resp, data } = await this.mastodon.get('timelines/public', params)
      const { statusCode } = resp
      returnData = data
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchNotification (appendParams) {
    let returnData
    try {
      let params = {}
      if (appendParams && appendParams.maxID) {
        params = { ...params, max_id: appendParams.maxID }
      }
      const { resp, data } = await this.mastodon.get('notifications', params)
      const { statusCode } = resp
      returnData = data
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
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

  async postToot (params) {
    let returnData
    try {
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
      const { resp, data } = await this.mastodon.post('statuses', opts)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async uploadFile (params) {
    let returnData
    try {
      const { filePath } = params
      const { resp, data } = await this.mastodon.post('media', {
        file: fs.createReadStream(filePath)
      })
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async deleteOwnToot (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.delete(`statuses/${id}`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async favorite (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.post(`statuses/${id}/favourite`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async unFavorite (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.post(`statuses/${id}/unfavourite`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async boost (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.post(`statuses/${id}/reblog`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async unBoost (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.post(`statuses/${id}/unreblog`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchToot (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.get(`statuses/${id}`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }

  async fetchContext (id) {
    let returnData
    try {
      const { resp, data } = await this.mastodon.get(`statuses/${id}/context`)
      returnData = data
      const { statusCode } = resp
      if (statusCode !== 200) {
        throw new ServerSideError(statusCode)
      }
    } catch (err) {
      throw err
    }
    return returnData
  }
}
