import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc

const userCountlimit = '1000'

export default {
  namespaced: true,
  state: {
    profile: {},
    timeline: [],
    followers: [],
    following: [],
    active: 'status'
  },
  mutations: {
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
  },
  actions: {
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
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchProfile(internalId).then(account => {
          commit('setProfile', {
            profile: Profile.fromAccount(account, ownFollowers, ownFollowings)
          })
          resolve()
        }).catch(e => {
          const returnErr = {
            error: e,
            host,
            accessToken
          }
          reject(returnErr)
        })
      })
    },
    async fetchProfileFollowing ({ commit }, { internalId }) {
      const currentUser = this.getters['users/getCurrentUser']
      const { accessToken, host } = currentUser
      const ownFollowers = currentUser.followers
      const ownFollowings = currentUser.followings
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      return new Promise((resolve, reject) => {
        mastodon.fetchProfileFollowing(
          internalId,
          { limit: userCountlimit }
        ).then(result => {
          const following = result.data
          commit('setFollowing', {
            following: following.map(account =>
              Profile.fromAccount(account, ownFollowers, ownFollowings)
            )
          })
          resolve()
        }).catch(e => {
          const returnErr = {
            error: e,
            host,
            accessToken
          }
          reject(returnErr)
        })
      })
    },
    async fetchProfileFollowers ({ commit }, { internalId }) {
      const currentUser = this.getters['users/getCurrentUser']
      const { accessToken, host } = currentUser
      const ownFollowers = currentUser.followers
      const ownFollowings = currentUser.followings
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      return new Promise((resolve, reject) => {
        mastodon.fetchProfileFollowers(
          internalId,
          { limit: userCountlimit }
        ).then(result => {
          const followers = result.data
          commit('setFollowers', {
            followers: followers.map(account =>
              Profile.fromAccount(account, ownFollowers, ownFollowings)
            )
          })
          resolve()
        }).catch(e => {
          const returnErr = {
            error: e,
            host,
            accessToken
          }
          reject(returnErr)
        })
      })
    },
    async fetchProfileTimeline ({ commit }, { internalId }) {
      const { accessToken, host, user } = this.getters['users/getCurrentUser']
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      return new Promise((resolve, reject) => {
        mastodon.fetchProfileTimeline(internalId).then(toots => {
          commit('setTimeline', {
            timeline: toots.map(d => Toot.fromMastodon(d, user))
          })
          resolve()
        }).catch(e => {
          const returnErr = {
            error: e,
            host,
            accessToken
          }
          reject(returnErr)
        })
      })
    },
    async loadOldToot ({ commit }, { internalId, maxID }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      return new Promise((resolve, reject) => {
        mastodon.fetchProfileTimeline(internalId, { maxID }).then(result => {
          const toots = result.data
          commit('appendTimeline', {
            timeline: toots.map(d => Toot.fromMastodon(d))
          })
          resolve()
        }).catch(e => {
          const returnErr = {
            error: e,
            host,
            accessToken
          }
          reject(returnErr)
        })
      })
    }
  }
}
