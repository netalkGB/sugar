import Field from '@/other/Field'
export default interface Profile {
  avatar:string
  header:string
  displayName:string
  userid:string
  locked:boolean
  note:string
  internalid:string
  followersCount:number
  followingCount:number
  statusesCount:number
  fields:Array<Field>| null
  bot:boolean | null
  isFollower:boolean
  isFollowing:boolean
}
