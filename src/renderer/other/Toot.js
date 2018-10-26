import Profile from './Profile'
import Media from './Media'
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
  }
  static fromMastodon (data) {
    let item
    if (data.reblog !== null) {
      item = data.reblog
    } else {
      item = data
    }
    const profile = Profile.fromAccount(item.account)
    const date = new Date(item.created_at)
    const id = item.id
    const content = item.content
    const boostsCount = item.reblogs_count
    const favoritesCount = item.favourites_count
    const repliesCount = item.replies_count
    const visibility = item.visibility
    const favorited = item.favourited
    const boosted = item.reblogged
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
      boosted
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
  static fromMastodonNotification (data) {
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
        boosted
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
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
        boostedBy
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
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
        favoritedBy
      }
      if (data.status.media_attachments) {
        obj = {
          ...obj,
          medium: Media.fromMediaAttachments(data.status.media_attachments)
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
