import Profile from "@/other/Profile";

export interface User {
  clientId: string,
  clientSecret: string,
  accessToken: string,
  host: string,
  userNumber: number,
  user: Profile,
  followers: Array<Profile>,
  followings: Array<Profile>,
  menu: null
}
