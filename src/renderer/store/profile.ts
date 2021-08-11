import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
import { ProfileState } from '@/store/types/ProfileState'
import Mastodon from '../other/Mastodon'

// const ipcRenderer = window.ipc

const userCountlimit = '1000'

export const namespaced = true

export const state = ():ProfileState => ({
  profile: {},
  timeline: [],
  followers: [],
  following: [],
  active: 'status'
})

export type OwnProfileState = ReturnType<typeof state>

export const mutations: MutationTree<OwnProfileState> = {
  setProfile (state, payload) {
    const { profile } = payload
    state.profile = profile
  },
  setTimeline (state, payload) {
    const { timeline } = payload
    state.timeline = timeline
  },
  setFollowers (state, payload) {
    const { followers } = payload
    state.followers = followers
  },
  setFollowing (state, payload) {
    const { following } = payload
    state.following = following
  },
  appendTimeline (state, payload) {
    const { timeline } = payload
    state.timeline = [...state.timeline, ...timeline]
  },
  removeTootFromTl (state, payload) {
    const { id } = payload
    const roundedId = parseInt(id, 10)
    state.timeline = state.timeline.filter(
      toot => parseInt(toot.id) !== roundedId
    )
  },
  setListType (state, type) {
    state.active = type
  }
}

export const actions: ActionTree<OwnProfileState, RootState> = {
  removeToot ({ commit }, payload) {
    const id = payload.id
    commit('removeTootFromTl', { id })
  },
  toggleListType ({ commit }, payload) {
    const type = payload.type
    commit('setListType', type)
  },
  fetchProfile ({ commit }, { internalId }) {
    const currentUser = this.getters['users/getCurrentUser']
    const { accessToken, host } = currentUser
    const ownFollowers = currentUser.followers
    const ownFollowings = currentUser.followings
    return new Promise<void>((resolve, reject) => {
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      mastodon.fetchProfile(internalId).then((account) => {
        commit('setProfile', {
          profile: Profile.fromAccount(account, ownFollowers, ownFollowings)
        })
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  fetchProfileFollowing ({ commit }, { internalId }) {
    const currentUser = this.getters['users/getCurrentUser']
    const { accessToken, host } = currentUser
    const ownFollowers = currentUser.followers
    const ownFollowings = currentUser.followings
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    return new Promise<void>((resolve, reject) => {
      mastodon.fetchProfileFollowing(
        internalId,
        { limit: userCountlimit }
      ).then((following) => {
        commit('setFollowing', {
          following: following.map(account =>
            Profile.fromAccount(account, ownFollowers, ownFollowings)
          )
        })
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  fetchProfileFollowers ({ commit }, { internalId }) {
    const currentUser = this.getters['users/getCurrentUser']
    const { accessToken, host } = currentUser
    const ownFollowers = currentUser.followers
    const ownFollowings = currentUser.followings
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    return new Promise<void>((resolve, reject) => {
      mastodon.fetchProfileFollowers(
        internalId,
        { limit: userCountlimit }
      ).then((followers) => {
        commit('setFollowers', {
          followers: followers.map(account =>
            Profile.fromAccount(account, ownFollowers, ownFollowings)
          )
        })
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  fetchProfileTimeline ({ commit }, { internalId }) {
    const { accessToken, host, user } = this.getters['users/getCurrentUser']
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    return new Promise<void>((resolve, reject) => {
      mastodon.fetchProfileTimeline(internalId).then((toots: Array<Entity.Status>) => {
        commit('setTimeline', {
          timeline: toots.map(toot => Toot.fromMastodon(toot, user))
        })
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  loadOldToot ({ commit }, { internalId, maxID }) {
    const { accessToken, host, user } = this.getters['users/getCurrentUser']
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    return new Promise<void>((resolve, reject) => {
      mastodon.fetchProfileTimeline(internalId, { maxID }).then((toots) => {
        commit('appendTimeline', {
          timeline: toots.map((toot: Entity.Status) => Toot.fromMastodon(toot, user))
        })
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }
}
