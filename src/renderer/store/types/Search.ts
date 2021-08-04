import Profile from '@/other/Profile'
import Toot from '@/other/Toot'

export interface Search {
  accounts: Array<Profile>
  timeline: Array<Toot>
  active: string
}
