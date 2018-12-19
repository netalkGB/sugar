import Profile from '@/other/Profile'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: {
    profile: {}
  },
  mutations: {
    setProfile (state, payload) {
      const { profile } = payload
      state.profile = profile
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
    }
  }
}
