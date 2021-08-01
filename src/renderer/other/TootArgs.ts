import Profile from '@/other/Profile'
import Media from './Media'

export default interface TootArgs {
  profile?: Profile
  content?:string
  date:Date
  id:string
  boostId?:string
  boostsCount?:number
  favoritesCount?:number
  repliesCount?:number
  visibility?: 'public' | 'unlisted' | 'private' | 'direct'
  medium?: Array<Media>
  favorited?: boolean | null
  boosted?: boolean | null
  boostedBy?: Profile
  followedBy?: Profile
  originalId?: string
  isTootByOwn?: boolean
  mentions?: Array<{
    id: string
    acct: string
    username: string
    url: string
  }>
  warning?: boolean
  warningComment?:string
  favoritedBy?: Profile |undefined
}
