export default class Profile {
  constructor (args) {
    this.avatar = args.avatar
    this.displayName = args.displayName
    this.userid = args.userid
    this.locked = args.locked
  }
  static fromAccount (account) {
    const avatar = account.avatar
    const displayName = account.display_name
    const userid = account.acct
    const locked = account.locked
    return new Profile({ avatar, displayName, userid, locked })
  }
}
