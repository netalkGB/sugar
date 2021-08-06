import { Entity } from 'megalodon'
import Profile from '@/other/Profile'
import Media from '@/other/Media'
import { User } from '@/store/types/User'
import TootArgs from '@/other/TootArgs'

export default class Toot {
  private _profile?: Profile
  private _content?:string
  private _date:Date
  private _id:string
  private _boostId?:string
  private _boostsCount?:number
  private _favoritesCount?:number
  private _repliesCount?:number
  private _visibility: 'public' | 'unlisted' | 'private' | 'direct' | undefined
  private _medium?: Array<Media>
  private _favorited?: boolean | null
  private _boosted?: boolean | null
  private _boostedBy?: Profile
  private _followedBy?: Profile
  private _originalId?: string
  private _isTootByOwn: boolean | undefined
  private _mentions?: Array<{
    id: string
    acct: string
    username: string
    url: string
  }>

  private _warning?: boolean
  private _warningComment?:string

  private _favoritedBy? : Profile

  get profile () {
    return this._profile
  }

  set profile (profile:Profile | undefined) {
    this._profile = profile
  }

  get content () {
    return this._content
  }

  set content (content:string|undefined) {
    this._content = content
  }

  get date () {
    return this._date
  }

  set date (date:Date) {
    this._date
  }

  get id () {
    return this._id
  }

  set id (id:string) {
    this._id = id
  }

  get boostId () {
    return this._boostId
  }

  set boostId (boostId:string|undefined) {
    this._boostId = boostId
  }

  get boostsCount () {
    return this._boostsCount
  }

  set boostsCount (boostsCount:number|undefined) {
    this._boostsCount = boostsCount
  }

  get favoritesCount () {
    return this._favoritesCount
  }

  set favoritesCount (favoritesCount:number|undefined) {
    this._favoritesCount = favoritesCount
  }

  get repliesCount () {
    return this._repliesCount
  }

  set repliesCount (repliesCount:number|undefined) {
    this._repliesCount = repliesCount
  }

  get visibility () {
    return this._visibility
  }

  set visibility (visibility:'public' | 'unlisted' | 'private' | 'direct'|undefined) {
    this._visibility = visibility
  }

  get medium () {
    return this._medium
  }

  set medium (medium:Array<Media> | undefined) {
    this._medium = medium
  }

  get favorited () {
    return this._favorited
  }

  set favorited (favorited: boolean | null | undefined) {
    this._favorited = favorited
  }

  get boosted () {
    return this._boosted
  }

  set boosted (boosted: boolean | null | undefined) {
    this._boosted = boosted
  }

  get boostedBy () {
    return this._boostedBy
  }

  set boostedBy (boostedBy: Profile | undefined) {
    this._boostedBy = boostedBy
  }

  get followedBy () {
    return this._followedBy
  }

  set followedBy (followedBy: Profile | undefined) {
    this._followedBy = followedBy
  }

  get originalId () {
    return this._originalId
  }

  set originalId (originalId:string | undefined) {
    this._originalId = originalId
  }

  get isTootByOwn () {
    return this._isTootByOwn
  }

  set isTootByOwn (isTootByOwn:boolean|undefined) {
    this._isTootByOwn = isTootByOwn
  }

  get mentions () {
    return this._mentions
  }

  set mentions (mentions:Array<{
    id: string
    acct: string
    username: string
    url: string
  }> | undefined) {
    this._mentions = mentions
  }

  get warning () {
    return this._warning
  }

  set warning (warning:boolean|undefined) {
    this._warning = warning
  }

  get warningComment () {
    return this._warningComment
  }

  set warningComment (warningComment:string|undefined) {
    this._warningComment = warningComment
  }

  get favoritedBy () {
    return this._favoritedBy
  }

  set favoritedBy (favoritedBy:Profile | undefined) {
    this._favoritedBy = favoritedBy
  }

  constructor (args:TootArgs) {
    this._profile = args.profile
    this._content = args.content
    this._date = args.date
    this._id = args.id
    this._boostId = args.boostId
    this._boostsCount = args.boostsCount
    this._favoritesCount = args.favoritesCount
    this._repliesCount = args.repliesCount
    this._visibility = args.visibility
    this._medium = args.medium
    this._favorited = args.favorited
    this._boosted = args.boosted
    this._boostedBy = args.boostedBy
    this._followedBy = args.followedBy
    this._originalId = args.originalId
    this._isTootByOwn = args.isTootByOwn
    this._mentions = args.mentions
    this._warning = args.warning
    this._warningComment = args.warningComment
    this._favoritedBy = args.favoritedBy
  }

  static fromMastodon (data:Entity.Status, ownUser:User) {
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
    const isTootByOwn = ownUser.userid === profile.userid
    const warning = item.sensitive
    const warningComment = item.spoiler_text
    let obj:TootArgs = {
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

  static fromMastodonNotification (data:Entity.Notification) {
    const status = data.status
    if (data.type === 'mention') {
      const profile = Profile.fromAccount(data.account)
      const date = new Date(data.created_at)
      const id = data.id
      const isTootByOwn = false
      let obj:TootArgs = {
        profile,
        date,
        id,
        isTootByOwn
      }
      if (status) {
        const content = status.content
        const boostsCount = status.reblogs_count
        const favoritesCount = status.favourites_count
        const repliesCount = status.replies_count
        const visibility = status.visibility
        const favorited = status.favourited
        const boosted = status.reblogged
        const originalId = status.id
        const warning = status.sensitive
        const warningComment = status.spoiler_text
        obj = {
          ...obj,
          content,
          boostsCount,
          favoritesCount,
          repliesCount,
          visibility,
          favorited,
          boosted,
          originalId,
          warning,
          warningComment
        }
        if (status.media_attachments) {
          obj = {
            ...obj,
            medium: Media.fromMediaAttachments(status.media_attachments)
          }
        }
        if (status.mentions) {
          const mentions = status.mentions.map(m => ({
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
      }
      return new Toot(obj)
    } else if (data.type === 'reblog') {
      const date = new Date(data.created_at)
      const id = data.id
      const boostedBy = Profile.fromAccount(data.account)
      const isTootByOwn = true
      let obj:TootArgs = {
        date,
        id,
        boostedBy,
        isTootByOwn
      }
      if (status) {
        const profile = Profile.fromAccount(status.account)
        const content = status.content
        const boostsCount = status.reblogs_count
        const favoritesCount = status.favourites_count
        const repliesCount = status.replies_count
        const visibility = status.visibility
        const favorited = status.favourited
        const boosted = status.reblogged
        const originalId = status.id
        const warning = status.sensitive
        const warningComment = status.spoiler_text
        obj = {
          ...obj,
          profile,
          content,
          boostsCount,
          favoritesCount,
          repliesCount,
          visibility,
          favorited,
          boosted,
          originalId,
          warning,
          warningComment
        }
        if (status.media_attachments) {
          obj = {
            ...obj,
            medium: Media.fromMediaAttachments(status.media_attachments)
          }
        }
        if (status.mentions) {
          const mentions = status.mentions.map(m => ({
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
      }
      return new Toot(obj)
    } else if (data.type === 'favourite') {
      const date = new Date(data.created_at)
      const id = data.id
      const favoritedBy = Profile.fromAccount(data.account)
      const isTootByOwn = true
      let obj:TootArgs = {
        date,
        id,
        favoritedBy,
        isTootByOwn
      }
      if (status) {
        const profile = Profile.fromAccount(status.account)
        const content = status.content
        const boostsCount = status.reblogs_count
        const favoritesCount = status.favourites_count
        const repliesCount = status.replies_count
        const visibility = status.visibility
        const favorited = status.favourited
        const boosted = status.reblogged
        const originalId = status.id
        const warning = status.sensitive
        const warningComment = status.spoiler_text
        obj = {
          ...obj,
          profile,
          content,
          boostsCount,
          favoritesCount,
          repliesCount,
          visibility,
          favorited,
          boosted,
          originalId,
          warning,
          warningComment
        }
        if (status.media_attachments) {
          obj = {
            ...obj,
            medium: Media.fromMediaAttachments(status.media_attachments)
          }
        }
        if (status.mentions) {
          const mentions = status.mentions.map(m => ({
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
      }
      return new Toot(obj)
    } else {
      const date = new Date(data.created_at)
      const id = data.id
      const followedBy = Profile.fromAccount(data.account)
      return new Toot({ date, id, followedBy })
    }
  }
}
