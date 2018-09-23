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
}
