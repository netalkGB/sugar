import Mastodon from '@/main/mastodon/Mastodon'
import testconfig from './testconfig'
const { accessToken, host } = testconfig

const mastodon = new Mastodon({ accessToken, host })

describe('fetch toot', async () => {
  it('should be fetch toot from home', async () => {
    const result = await mastodon.fetchHomeTimeline()
    for (let toot of result.data) {
      expect(toot.content.length >= 0).toBe(true)
    }
  })
  it('should be fetch and retrieve toot from ltl', async () => {
    const result = await mastodon.fetchHomeTimeline()
    let toots = []
    for (let toot of result.data) {
      toots = [...toots, toot.content]
    }
    const lastTootIdx = result.data.length - 1
    const result2 = await mastodon.fetchHomeTimeline({
      maxID: result.data[lastTootIdx].id
    })
    for (let toot of result2.data) {
      toots = [...toots, toot.content]
    }
    expect(toots.length).toBe(40)
    for (let toot of toots) {
      expect(toot.length >= 0).toBe(true)
    }
  })

  it('should be fetch toot from ltl', async () => {
    const result = await mastodon.fetchLocalTimeline()
    for (let toot of result.data) {
      expect(toot.content.length >= 0).toBe(true)
    }
  })
  it('should be fetch and retrieve toot from local', async () => {
    const result = await mastodon.fetchLocalTimeline()
    let toots = []
    for (let toot of result.data) {
      toots = [...toots, toot.content]
    }
    const lastTootIdx = result.data.length - 1
    const result2 = await mastodon.fetchHomeTimeline({
      maxID: result.data[lastTootIdx].id
    })
    for (let toot of result2.data) {
      toots = [...toots, toot.content]
    }
    expect(toots.length).toBe(40)
    for (let toot of toots) {
      expect(toot.length >= 0).toBe(true)
    }
  })
})
