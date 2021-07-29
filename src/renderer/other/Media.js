export default class Media {
  constructor (args) {
    this.type = args.type
    this.url = args.url
    this.previewUrl = args.previewUrl
  }
  static fromMediaAttachment (mediaAttachment) {
    const type = mediaAttachment.type
    const url = mediaAttachment.remote_url || mediaAttachment.url
    const previewUrl = mediaAttachment.preview_url
    const media = new Media({ type, url, previewUrl })
    return media
  }
  static fromMediaAttachments (mediaAttachments) {
    return mediaAttachments.map(mediaAttachment =>
      Media.fromMediaAttachment(mediaAttachment)
    )
  }
}
