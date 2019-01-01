import Field from '@/other/Field.js'
export default class Profile {
  constructor (args) {
    this.avatar = args.avatar
    this.header = args.header
    this.displayName = args.displayName
    this.userid = args.userid
    this.locked = args.locked
    this.note = args.note
    this.internalid = args.internalid
    this.followersCount = args.followersCount
    this.followingCount = args.followingCount
    this.statusesCount = args.statusesCount
    this.fields = args.fields
  }
  static fromAccount (account) {
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
      fields
    })
  }
}
