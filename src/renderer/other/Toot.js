import Profile from '@/other/Profile.js'
import Media from '@/other/Media.js'
export default class Toot {
  constructor (args) {
    this.profile = args.profile
    this.content = args.content
    this.date = args.date
    this.id = args.id
    this.boostId = args.boostId
    this.boostsCount = args.boostsCount
    this.favoritesCount = args.favoritesCount
    this.repliesCount = args.repliesCount
    this.visibility = args.visibility
    this.medium = args.medium
    this.favorited = args.favorited
    this.boosted = args.boosted
    this.boostedBy = args.boostedBy
    this.followedBy = args.followedBy
    this.originalId = args.originalId
    this.isTootByOwn = args.isTootByOwn
    this.mentions = args.mentions
    this.warning = args.warning
    this.warningComment = args.warningComment
  }

  static fromMastodon (data, ownUser) {
    let item
    if (data.reblog !== null) {
      item = data.reblog
    } else {
      item = data
    }
    const profile = Profile.fromAccount(item.account)
    const date = new Date(item.created_at)
    const id = item.id
    const originalId = id
    const content = item.content
    const boostsCount = item.reblogs_count
    const favoritesCount = item.favourites_count
    const repliesCount = item.replies_count
    const visibility = item.visibility
    const favorited = item.favourited
    const boosted = item.reblogged
    const isTootByOwn = ownUser && ownUser.userid === profile.userid
    const warning = item.sensitive
    const warningComment = item.spoiler_text
    let obj = {
      profile,
      date,
      content,
      boostsCount,
      favoritesCount,
      repliesCount,
      visibility,
      id,
      favorited,
      boosted,
      originalId,
      isTootByOwn,
      warning,
      warningComment
    }
    if (item.mentions) {
      const mentions = item.mentions.map(m => ({
        id: m.id,
        acct: m.acct,
        username: m.username,
        url: m.url
      }))
      obj = {
        ...obj,
        mentions
      }
    }
    if (item.media_attachments) {
      obj = {
        ...obj,
        medium: Media.fromMediaAttachments(item.media_attachments)
      }
    }
    if (data.reblog !== null) {
      const boostedBy = Profile.fromAccount(data.account)
      const boostId = data.id
      obj = { ...obj, boostedBy, boostId }
    }
    return new Toot(obj)
  }

  static fromMastodonNotification (data, ownUser) {
    if (data.type === 'mention') {
      const profile = Profile.fromAccount(data.account)
      const date = new Date(data.created_at)
      const id = data.id
      const content = data.status.content
      const boostsCount = data.status.reblogs_count
      const favoritesCount = data.status.favourites_count
      const repliesCount = data.status.replies_count
      const visibility = data.status.visibility
      const favorited = data.status.favourited
      const boosted = data.status.reblogged
      const originalId = data.status.id
      const warning = data.status.sensitive
      const warningComment = data.status.spoiler_text
      const isTootByOwn = false
      let obj = {
        profile,
        date,
        content,
        boostsCount,
        favoritesCount,
        repliesCount,
        visibility,
        id,
        favorited,
        boosted,
        originalId,
        isTootByOwn,
        warning,
        warningComment
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
        }
      }
      if (data.status.mentions) {
        const mentions = data.status.mentions.map(m => ({
          id: m.id,
          acct: m.acct,
          username: m.username,
          url: m.url
        }))
        obj = {
          ...obj,
          mentions
        }
      }
      return obj
    } else if (data.type === 'reblog') {
      const profile = Profile.fromAccount(data.status.account)
      const date = new Date(data.created_at)
      const id = data.id
      const content = data.status.content
      const boostsCount = data.status.reblogs_count
      const favoritesCount = data.status.favourites_count
      const repliesCount = data.status.replies_count
      const visibility = data.status.visibility
      const favorited = data.status.favourited
      const boosted = data.status.reblogged
      const boostedBy = Profile.fromAccount(data.account)
      const originalId = data.status.id
      const isTootByOwn = true
      const warning = data.status.sensitive
      const warningComment = data.status.spoiler_text
      let obj = {
        profile,
        date,
        content,
        boostsCount,
        favoritesCount,
        repliesCount,
        visibility,
        id,
        favorited,
        boosted,
        boostedBy,
        originalId,
        isTootByOwn,
        warning,
        warningComment
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
        }
      }
      if (data.status.mentions) {
        const mentions = data.status.mentions.map(m => ({
          id: m.id,
          acct: m.acct,
          username: m.username,
          url: m.url
        }))
        obj = {
          ...obj,
          mentions
        }
      }
      return obj
    } else if (data.type === 'favourite') {
      const profile = Profile.fromAccount(data.status.account)
      const date = new Date(data.created_at)
      const id = data.id
      const content = data.status.content
      const boostsCount = data.status.reblogs_count
      const favoritesCount = data.status.favourites_count
      const repliesCount = data.status.replies_count
      const visibility = data.status.visibility
      const favorited = data.status.favourited
      const boosted = data.status.reblogged
      const favoritedBy = Profile.fromAccount(data.account)
      const originalId = data.status.id
      const isTootByOwn = true
      const warning = data.status.sensitive
      const warningComment = data.status.spoiler_text
      let obj = {
        profile,
        date,
        content,
        boostsCount,
        favoritesCount,
        repliesCount,
        visibility,
        id,
        favorited,
        boosted,
        favoritedBy,
        originalId,
        isTootByOwn,
        warning,
        warningComment
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
        }
      }
      if (data.status.mentions) {
        const mentions = data.status.mentions.map(m => ({
          id: m.id,
          acct: m.acct,
          username: m.username,
          url: m.url
        }))
        obj = {
          ...obj,
          mentions
        }
      }
      return obj
    } else {
      const date = new Date(data.created_at)
      const id = data.id
      const followedBy = Profile.fromAccount(data.account)
      return { date, id, followedBy }
    }
  }
}
