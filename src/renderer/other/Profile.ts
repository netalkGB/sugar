import Field from '@/other/Field'
import ProfileArgs from '@/other/ProfileArgs'
import { Entity } from 'megalodon'

export default class Profile {
  private _avatar:string
  private _header:string
  private _displayName:string
  private _userid:string
  private _locked:boolean
  private _note:string
  private _internalid:string
  private _followersCount:number
  private _followingCount:number
  private _statusesCount:number
  private _fields:Array<Field> | null
  private _bot:boolean | null
  private _isFollower:boolean
  private _isFollowing:boolean

  set avatar (avatar:string) {
    this._avatar = avatar
  }

  set header (header:string) {
    this._header = header
  }

  set displayName (displayName:string) {
    this._displayName = displayName
  }

  set userid (userid:string) {
    this._userid = userid
  }

  set locked (locked:boolean) {
    this._locked = locked
  }

  set note (note:string) {
    this._note = note
  }

  set internalid (internalid:string) {
    this._internalid = internalid
  }

  set followersCount (followersCount:number) {
    this._followersCount = followersCount
  }

  set followingCount (followingCount:number) {
    this._followingCount = followingCount
  }

  set statusesCount (statusesCount:number) {
    this._statusesCount = statusesCount
  }

  set fields (fields:Array<Field> | null) {
    this._fields = fields
  }

  set bot (bot:boolean | null) {
    this._bot = bot
  }

  set isFollower (isFollower:boolean) {
    this._isFollower = isFollower
  }

  set isFollowing (isFollowing:boolean) {
    this._isFollowing = isFollowing
  }

  get avatar () {
    return this._avatar
  }

  get header () {
    return this._header
  }

  get displayName () {
    return this._displayName
  }

  get userid () {
    return this._userid
  }

  get locked () {
    return this._locked
  }

  get note () {
    return this._note
  }

  get internalid () {
    return this._internalid
  }

  get followersCount () {
    return this._followersCount
  }

  get followingCount () {
    return this._followingCount
  }

  get statusesCount () {
    return this._statusesCount
  }

  get fields () {
    return this._fields
  }

  get bot () {
    return this._bot
  }

  get isFollower () {
    return this._isFollower
  }

  get isFollowing () {
    return this._isFollowing
  }

  constructor (args:ProfileArgs) {
    this._avatar = args.avatar
    this._header = args.header
    this._displayName = args.displayName
    this._userid = args.userid
    this._locked = args.locked
    this._note = args.note
    this._internalid = args.internalid
    this._followersCount = args.followersCount
    this._followingCount = args.followingCount
    this._statusesCount = args.statusesCount
    this._fields = args.fields
    this._bot = args.bot
    this._isFollower = args.isFollower
    this._isFollowing = args.isFollowing
  }

  // accountについてはmastodon-apiのJSONの返却値を使用するため一旦anyとする
  static fromAccount (account:Entity.Account, followers:Array<Profile> | undefined = undefined, followings:Array<Profile> | undefined = undefined) {
    const avatar = account.avatar
    const header = account.header
    const displayName = account.display_name
    const userid = account.acct
    const locked = account.locked
    const note = account.note
    const internalid = account.id
    const followersCount = account.followers_count
    const followingCount = account.following_count
    const statusesCount = account.statuses_count
    const fields = Field.fromMastodonFields(account.fields)
    const bot = account.bot
    const isFollower =
      followers !== undefined &&
      followers.find(f => f.internalid === internalid) !== undefined
    const isFollowing =
      followings !== undefined &&
      followings.find(f => f.internalid === internalid) !== undefined
    return new Profile({
      avatar,
      header,
      displayName,
      userid,
      locked,
      note,
      internalid,
      followersCount,
      followingCount,
      statusesCount,
      fields,
      bot,
      isFollower,
      isFollowing
    })
  }
}
