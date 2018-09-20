import Profile from '@/renderer/other/Profile'
import data from './toot.data.json'

describe('Profile', () => {
  it('should be convert correctly', () => {
    let converted = Profile.fromAccount(data[0].account)
    expect(converted.avatar).toBe(
      'https://2.example.com/avatars/original/missing.png'
    )
    expect(converted.displayName).toBe('')
    expect(converted.userid).toBe('netalkGB@example.com')
    expect(converted.locked).toBe(false)

    converted = Profile.fromAccount(data[1].account)
    expect(converted.avatar).toBe(
      'https://media.2.example.com/images/accounts/avatars/000/564/253/original/9052ecef6bbb94e3.jpg'
    )
    expect(converted.displayName).toBe('gb')
    expect(converted.userid).toBe('netalkGB')
    expect(converted.locked).toBe(false)
  })
})
