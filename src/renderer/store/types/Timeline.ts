import Toot from '@/other/Toot'
import { User } from '@/store/types/User'

export interface Timeline {
  host:string
  accessToken:string
  type: 'hometl' | 'localtl' | 'publictl'|'notification'
  active:boolean
  data: Array<Toot>
  user: User
}
