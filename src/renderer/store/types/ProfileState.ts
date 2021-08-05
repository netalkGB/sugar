import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
export interface ProfileState {
  profile: Profile | {}
  timeline: Array<Toot>
  followers: Array<Profile>
  following: Array<Profile>
  active: string
}
