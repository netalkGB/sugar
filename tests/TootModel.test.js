import Toot from '@/renderer/other/Toot'
import data from './toot.data.json'

describe('Toot', () => {
  it('should be convert correctly', () => {
    const toot = data[0]
    const converted = Toot.fromMastodon(toot)
    expect(converted.profile !== undefined).toBe(true)
    expect(converted.content).toBe('\u003cp\u003emastodon\u003c/p\u003e')
    expect(converted.date.toString()).toBe(new Date(converted.date).toString())
    expect(converted.boostsCount).toBe(0)
    expect(converted.favoritesCount).toBe(0)
    expect(converted.repliesCount).toBe(0)
    expect(converted.visibility).toBe('unlisted')
    expect(converted.medium !== undefined).toBe(true)
  })
})
