import { User } from '@/store/types/User'

export interface Users {
  userList:Array<User>,
  currentUser:number,
  nextUserId:number
}
