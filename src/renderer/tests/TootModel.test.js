import Toot from '@/other/Toot'
import Profile from '@/other/Profile'
import tootData from './toot.data.json'
import notificationData from './notification.data.json'

const user = Profile.fromAccount(tootData[0].account)
const user2 = Profile.fromAccount(tootData[2].reblog.account)
const user3 = Profile.fromAccount(tootData[3].account)

describe('Toot', () => {
  it('should be convert correctly(normal)', () => {
    const toot = tootData[0]
    let converted = Toot.fromMastodon(toot, user)
    expect(converted.profile.userid).toBe('netalkGB@example.com')
    expect(converted.content).toBe('\u003Cp\u003Emastodon\u003C/p\u003E')
    expect(converted.favorited).toBe(false)
    expect(converted.isTootByOwn).toBe(true)
    expect(converted.boosted).toBe(false)
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(0)
    expect(converted.favoritesCount).toBe(0)
    expect(converted.repliesCount).toBe(0)
    expect(converted.id).toBe('100758336134175190')
    expect(converted.originalId).toBe('100758336134175190')
    expect(converted.visibility).toBe('unlisted')
    expect(converted.medium !== undefined).toBe(true)
    converted = Toot.fromMastodon(toot, user2)
    expect(converted.isTootByOwn).toBe(false)
    expect(converted.warning).toBe(false)
  })
  it('should be convert correctly(reblog))', () => {
    const toot = tootData[2]
    let converted = Toot.fromMastodon(toot, user2)
    expect(converted.favorited).toBe(true)
    expect(converted.boosted).toBe(true)
    expect(converted.boostedBy.userid).toBe('netalkGB')
    expect(converted.profile.userid).toBe('netalkGB2@example.com')
    expect(converted.content).toBe('\u003Cp\u003Eboost\u003C/p\u003E')
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(20)
    expect(converted.favoritesCount).toBe(7)
    expect(converted.isTootByOwn).toBe(true)
    expect(converted.repliesCount).toBe(1)
    expect(converted.id).toBe('100746825497024042')
    expect(converted.originalId).toBe('100746825497024042')
    expect(converted.boostId).toBe('100759428363243322')
    expect(converted.visibility).toBe('unlisted')
    expect(converted.medium !== undefined).toBe(true)
    converted = Toot.fromMastodon(toot, user)
    expect(converted.isTootByOwn).toBe(false)
  })
  it('should be convert correctly(mention))', () => {
    const toot = tootData[3]
    const converted = Toot.fromMastodon(toot, user3)
    expect(converted.profile.userid).toBe('netalkGB')
    expect(converted.content).toBe(
      '\u003Cp\u003E\u003Cspan class="h-card"\u003E\u003Ca href="https://example.com/@kaziki" class="u-url mention"\u003E@\u003Cspan\u003Ekaziki\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E test\u003C/p\u003E'
    )
    expect(converted.favorited).toBe(false)
    expect(converted.isTootByOwn).toBe(true)
    expect(converted.boosted).toBe(false)
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(0)
    expect(converted.favoritesCount).toBe(0)
    expect(converted.repliesCount).toBe(0)
    expect(converted.id).toBe('101286092409948289')
    expect(converted.originalId).toBe('101286092409948289')
    expect(converted.visibility).toBe('direct')
    expect(converted.mentions[0].id).toBe('524257')
    expect(converted.mentions[0].username).toBe('kaziki')
    expect(converted.mentions[0].url).toBe('https://example.com/@kaziki')
    expect(converted.mentions[0].acct).toBe('kaziki')
    expect(converted.medium !== undefined).toBe(true)
  })

  it('should be convert correctly(normal && cw )', () => {
    const toot = tootData[4]
    const converted = Toot.fromMastodon(toot, user)
    expect(converted.warning).toBe(true)
    expect(converted.warningComment).toBe('!!!warning!!!')
  })
  it('should be convert correctly(reblog && cw))', () => {
    const toot = tootData[5]
    const converted = Toot.fromMastodon(toot, user)
    expect(converted.warning).toBe(true)
    expect(converted.warningComment).toBe('!!warning!!')
  })

  it('should be convert correctly(notification-reply))', () => {
    const toot = notificationData[0]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.favorited).toBe(false)
    expect(converted.boosted).toBe(false)
    expect(converted.profile.userid).toBe('gb@www1.example.com')
    expect(converted.content).toBe('<p>ok</p>')
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(0)
    expect(converted.isTootByOwn).toBe(false)
    expect(converted.favoritesCount).toBe(0)
    expect(converted.repliesCount).toBe(0)
    expect(converted.id).toBe('43781233')
    expect(converted.originalId).toBe('100962823526170080')
    expect(converted.visibility).toBe('public')
    expect(converted.mentions[0].id).toBe('564253')
    expect(converted.mentions[0].username).toBe('netalkGB')
    expect(converted.mentions[0].url).toBe('https://www2.example.com/@netalkGB')
    expect(converted.mentions[0].acct).toBe('netalkGB')
    expect(converted.medium !== undefined).toBe(true)
    expect(converted.warning).toBe(false)
  })
  it('should be convert correctly(notification-favorite))', () => {
    const toot = notificationData[1]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.favorited).toBe(false)
    expect(converted.boosted).toBe(false)
    expect(converted.profile.userid).toBe('netalkGB')
    expect(converted.content).toBe('ok')
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(0)
    expect(converted.favoritesCount).toBe(1)
    expect(converted.isTootByOwn).toBe(true)
    expect(converted.repliesCount).toBe(0)
    expect(converted.id).toBe('43633462')
    expect(converted.originalId).toBe('100946880147251231')
    expect(converted.visibility).toBe('public')
    expect(converted.medium !== undefined).toBe(true)
    expect(converted.warning).toBe(false)
  })
  it('should be convert correctly(notification-boost))', () => {
    const toot = notificationData[2]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.favorited).toBe(false)
    expect(converted.boosted).toBe(false)
    expect(converted.boostedBy.userid).toBe('kaziki')
    expect(converted.profile.userid).toBe('netalkGB')
    expect(converted.content).toBe('<p>もう朝じゃないか・・・</p>')
    expect(converted.isTootByOwn).toBe(true)
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(1)
    expect(converted.favoritesCount).toBe(1)
    expect(converted.repliesCount).toBe(0)
    expect(converted.id).toBe('43201605')
    expect(converted.originalId).toBe('100901501511089762')
    expect(converted.visibility).toBe('public')
    expect(converted.medium !== undefined).toBe(true)
    expect(converted.warning).toBe(false)
  })
  it('should be convert correctly(notification-follow))', () => {
    const toot = notificationData[3]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.followedBy.userid).toBe('kazikituna')
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.id).toBe('42837140')
  })

  it('should be convert correctly(notification-reply && cw))', () => {
    const toot = notificationData[4]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.warning).toBe(true)
    expect(converted.warningComment).toBe('cw')
  })
  it('should be convert correctly(notification-favorite && cw))', () => {
    const toot = notificationData[5]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.warning).toBe(true)
    expect(converted.warningComment).toBe('cw')
  })
  it('should be convert correctly(notification-boost && cw))', () => {
    const toot = notificationData[6]
    const converted = Toot.fromMastodonNotification(toot)
    expect(converted.warning).toBe(true)
    expect(converted.warningComment).toBe('cw')
  })
})
