import Profile from './Profile'
import Media from './Media'
export default class Toot {
  constructor (args) {
    this.profile = args.profile
    this.content = args.content
    this.date = args.date

    this.boostsCount = args.boostsCount
    this.favoritesCount = args.favoritesCount
    this.repliesCount = args.repliesCount
    this.visibility = args.visibility
    this.medium = args.medium
  }
  static fromMastodon (data) {
    const profile = Profile.fromAccount(data.account)
    const date = new Date(data.created_at)
    const content = data.content
    const boostsCount = data.reblogs_count
    const favoritesCount = data.favourites_count
    const repliesCount = data.replies_count
    const visibility = data.visibility
    let obj = {
      profile,
      date,
      content,
      boostsCount,
      favoritesCount,
      repliesCount,
      visibility
    }
    if (data.media_attachments) {
      obj = {
        ...obj,
        medium: Media.fromMediaAttachments(data.media_attachments)
      }
    }
    const toot = new Toot(obj)
    return toot
  }
}
