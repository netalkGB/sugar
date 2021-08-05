import Media from '@/other/Media'
import data from './toot.data.json'

describe('Media', () => {
  it('should be convert correctly', () => {
    const mediaAttachments = data[0].media_attachments
    const converted = Media.fromMediaAttachment(mediaAttachments[0])
    expect(converted.type).toBe('image')
    expect(converted.url).toBe(
      'https://img.example.com/media_attachments/files/008/685/968/original/ee5ee76b265003f1.png'
    )
    expect(converted.previewUrl).toBe(
      'https://media.2.example.com/images/media_attachments/files/009/606/582/small/dfe4335767cd7f1d.png'
    )
  })
  it('should be convert correctly(multiple)', () => {
    const mediaAttachments = data[0].media_attachments
    const converted = Media.fromMediaAttachments(mediaAttachments)
    for (const media of converted) {
      expect(media.type).toBe('image')
      expect(media.url.includes('http') && media.url.includes('png')).toBe(true)
      expect(media.previewUrl.includes('http') && media.url.includes('png')).toBe(true)
    }
  })
})
