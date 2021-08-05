import Profile from '@/other/Profile'
import data from './toot.data.json'
const profiles1 = [
  {
    avatar: 'https://example.com/avatars/original/missing.png',
    header: 'https://example.com/headers/original/missing.png',
    displayName: '',
    userid: 'netalkGB',
    locked: false,
    note: '<p></p>',
    internalid: '610998',
    followersCount: 4,
    followingCount: 3,
    statusesCount: 1,
    fields: [],
    bot: false,
    isFollower: false,
    isFollowing: false
  }
]
const profiles2 = [
  {
    avatar: 'https://example.com/avatars/original/missing.png',
    header: 'https://example.com/headers/original/missing.png',
    displayName: '',
    userid: 'netalkGB',
    locked: false,
    note: '<p></p>',
    internalid: '810',
    followersCount: 4,
    followingCount: 3,
    statusesCount: 1,
    fields: [],
    bot: false,
    isFollower: false,
    isFollowing: false
  }
]

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
    expect(converted.note).toBe('\u003Cp\u003E\u003C/p\u003E')
    expect(converted.locked).toBe(false)
    expect(converted.internalid).toBe('610998')
    expect(converted.followersCount).toBe(1)
    expect(converted.followingCount).toBe(0)
    expect(converted.statusesCount).toBe(3)
    expect(converted.bot).toBe(false)
    expect(converted.isFollower).toBe(false)
    expect(converted.isFollowing).toBe(false)
    expect(converted.fields[0].name).toBe('GitHub')
    expect(converted.fields[0].value).toBe('netalkGB')
    converted = Profile.fromAccount(data[1].account)
    expect(converted.avatar).toBe(
      'https://media.2.example.com/images/accounts/avatars/000/564/253/original/9052ecef6bbb94e3.jpg'
    )
    expect(converted.displayName).toBe('gb')
    expect(converted.userid).toBe('netalkGB')
    expect(converted.locked).toBe(false)
    expect(converted.isFollower).toBe(false)
    expect(converted.isFollowing).toBe(false)
  })
  it('should be convert correctly(follower,following)', () => {
    let converted = Profile.fromAccount(data[0].account, profiles1, profiles1)
    expect(converted.isFollower).toBe(true)
    expect(converted.isFollowing).toBe(true)
    converted = Profile.fromAccount(data[0].account, profiles2, profiles2)
    expect(converted.isFollower).toBe(false)
    expect(converted.isFollowing).toBe(false)
    expect(converted.locked).toBe(false)
    converted = Profile.fromAccount(data[0].account, profiles1, profiles2)
    expect(converted.isFollower).toBe(true)
    expect(converted.isFollowing).toBe(false)
    converted = Profile.fromAccount(data[0].account, profiles2, profiles1)
    expect(converted.isFollower).toBe(false)
    expect(converted.isFollowing).toBe(true)
  })
})
