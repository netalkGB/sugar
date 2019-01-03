import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
const ipcRenderer = window.ipc

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
    async fetchProfile ({ commit }, { internalId }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfile', { host, accessToken, id: internalId })
        ipcRenderer.once('fetchProfile-success', (_, data) => {
          const account = data.result.data
          commit('setProfile', { profile: Profile.fromAccount(account) })
          resolve()
        })
        ipcRenderer.once('fetchProfile-error', (_, e) => {
          reject(e)
        })
      })
    },
    async fetchProfileFollowing ({ commit }, { internalId }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfileFollowing', {
          host,
          accessToken,
          id: internalId,
          limit: '1000'
        })
        ipcRenderer.once('fetchProfileFollowing-success', (_, data) => {
          const following = data.result.data
          commit('setFollowing', {
            following: following.map(u => Profile.fromAccount(u))
          })
          resolve()
        })
        ipcRenderer.once('fetchProfileFollowing-error', (_, e) => {
          reject(e)
        })
      })
    },
    async fetchProfileFollowers ({ commit }, { internalId }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfileFollowers', {
          host,
          accessToken,
          id: internalId,
          limit: '1000'
        })
        ipcRenderer.once('fetchProfileFollowers-success', (_, data) => {
          const followers = data.result.data
          commit('setFollowers', {
            followers: followers.map(u => Profile.fromAccount(u))
          })
          resolve()
        })
        ipcRenderer.once('fetchProfileFollowers-error', (_, e) => {
          reject(e)
        })
      })
    },
    async fetchProfileTimeline ({ commit }, { internalId }) {
      const { accessToken, host, user } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfileTimeline', {
          host,
          accessToken,
          id: internalId
        })
        ipcRenderer.once('fetchProfileTimeline-success', (_, data) => {
          const toots = data.result.data
          commit('setTimeline', {
            timeline: toots.map(d => Toot.fromMastodon(d, user))
          })
          resolve()
        })
        ipcRenderer.once('fetchProfileTimeline-error', (_, e) => {
          reject(e)
        })
      })
    },
    async loadOldToot ({ commit }, { internalId, maxID }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfileTimeline', {
          host,
          accessToken,
          id: internalId,
          maxID
        })
        ipcRenderer.once('fetchProfileTimeline-success', (_, data) => {
          const toots = data.result.data
          commit('appendTimeline', {
            timeline: toots.map(d => Toot.fromMastodon(d))
          })
          resolve()
        })
        ipcRenderer.once('fetchProfileTimeline-error', (_, e) => {
          reject(e)
        })
      })
    }
  }
}
