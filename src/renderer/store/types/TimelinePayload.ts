import { Entity } from 'megalodon'
import { User } from '@/store/types/User'

export interface TimelinePayload {
  host:string
  accessToken:string
  type: 'hometl' | 'localtl' | 'publictl'|'notification'
  active:boolean
  statuses?: Array<Entity.Status>
  status?: Entity.Status
  notifications?: Array<Entity.Notification>,
  notification: Entity.Notification
  user: User,
  id: string,
  firstLoadDone: boolean
}
