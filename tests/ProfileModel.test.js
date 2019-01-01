import Profile from '@/other/Profile'
import data from './toot.data.json'

describe('Profile', () => {
  it('should be convert correctly', () => {
    let converted = Profile.fromAccount(data[0].account)
    expect(converted.avatar).toBe(
      'https://2.example.com/avatars/original/missing.png'
    )
    expect(converted.header).toBe(
      'https://2.example.com/headers/original/missing.png'
    )
    expect(converted.displayName).toBe('')
    expect(converted.userid).toBe('netalkGB@example.com')
    expect(converted.note).toBe('\u003cp\u003e\u003c/p\u003e')
    expect(converted.locked).toBe(false)
    expect(converted.internalid).toBe('610998')
    expect(converted.followersCount).toBe(1)
    expect(converted.followingCount).toBe(0)
    expect(converted.statusesCount).toBe(3)
    expect(converted.bot).toBe(false)
    expect(converted.fields[0].name).toBe('GitHub')
    expect(converted.fields[0].value).toBe('netalkGB')
    converted = Profile.fromAccount(data[1].account)
    expect(converted.avatar).toBe(
      'https://media.2.example.com/images/accounts/avatars/000/564/253/original/9052ecef6bbb94e3.jpg'
    )
    expect(converted.displayName).toBe('gb')
    expect(converted.userid).toBe('netalkGB')
    expect(converted.locked).toBe(false)
  })
})
