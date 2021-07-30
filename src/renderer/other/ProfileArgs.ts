import Field from '@/other/Field'
export default interface Profile {
  avatar:string | undefined
  header:string | undefined
  displayName:string | undefined
  userid:string | undefined
  locked:boolean | undefined
  note:string | undefined
  internalid:string | undefined
  followersCount:number | undefined
  followingCount:number | undefined
  statusesCount:number | undefined
  fields:Array<Field> | undefined | null
  bot:boolean | undefined | null
  isFollower:boolean | undefined
  isFollowing:boolean | undefined
}
