export default class Notification {
  constructor (args) {
    this.type = args.type
    this.id = args.id
    this.date = args.date
    this.body = args.body
  }
  static fromMastodon (data) {
    let type = ''
    let body = null
    const id = data.id
    const date = data.date
    if (data.type === 'follow') {
      type = 'follow'
    } else if (data.type === 'favourite') {
      type = 'favorite'
    } else if (data.type === 'reblog') {
      type = 'boost'
    } else {
      type = 'reply'
    }
    return new Notification({ type, id, date, body })
  }
}
