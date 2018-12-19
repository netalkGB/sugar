export default class Profile {
  constructor (args) {
    this.avatar = args.avatar
    this.displayName = args.displayName
    this.userid = args.userid
    this.locked = args.locked
    this.note = args.note
    this.internalid = args.internalid
    this.followersCount = args.followersCount
    this.followingCount = args.followingCount
    this.statusesCount = args.statusesCount
  }
  static fromAccount (account) {
    const avatar = account.avatar
    const displayName = account.display_name
    const userid = account.acct
    const locked = account.locked
    const note = account.note
    const internalid = account.id
    const followersCount = account.followers_count
    const followingCount = account.following_count
    const statusesCount = account.statuses_count
    return new Profile({
      avatar,
      displayName,
      userid,
      locked,
      note,
      internalid,
      followersCount,
      followingCount,
      statusesCount
    })
  }
}
