import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: {
    profile: {},
    timeline: []
  },
  mutations: {
    setProfile (state, payload) {
      const { profile } = payload
      state.profile = profile
    },
    setTimeline (state, payload) {
      const { timeline } = payload
      state.timeline = timeline
    }
  },
  actions: {
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
    async fetchProfileTimeline ({ commit }, { internalId, maxId }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.send('fetchProfileTimeline', {
          host,
          accessToken,
          id: internalId,
          maxId
        })
        ipcRenderer.once('fetchProfileTimeline-success', (_, data) => {
          const toots = data.result.data
          commit('setTimeline', {
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
