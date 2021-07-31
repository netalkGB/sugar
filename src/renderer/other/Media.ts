import { Entity } from 'megalodon'
import MediaArgs from '@/other/MediaArgs'

export default class Media {
  private _type:string
  private _url:string
  private _previewUrl:string

  get type () {
    return this._type
  }

  set type (type:string) {
    this._type = type
  }

  get url () {
    return this._url
  }

  set url (url:string) {
    this._url = url
  }

  get previewUrl () {
    return this._previewUrl
  }

  set previewUrl (previewUrl:string) {
    this._previewUrl = previewUrl
  }

  constructor (args:MediaArgs) {
    this._type = args.type
    this._url = args.url
    this._previewUrl = args.previewUrl
  }

  static fromMediaAttachment (mediaAttachment:Entity.Attachment) {
    const type = mediaAttachment.type
    const url = mediaAttachment.remote_url || mediaAttachment.url
    const previewUrl = mediaAttachment.preview_url
    const media = new Media({ type, url, previewUrl })
    return media
  }

  static fromMediaAttachments (mediaAttachments:Array<Entity.Attachment>) {
    return mediaAttachments.map(mediaAttachment =>
      Media.fromMediaAttachment(mediaAttachment)
    )
  }
}
