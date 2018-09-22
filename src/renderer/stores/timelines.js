import { ipcRenderer } from 'electron'
import Toot from '../other/Toot'

export default {
  namespaced: true,
  state: {
    timelines: []
  },
  getters: {
    getTimelines (state) {
      return state.timelines
    },
    getTimeline (state, getters, rootState, rootGetters) {
      const { host, accessToken } = rootGetters['users/getCurrentUser']
      return state.timelines.filter(
        timeline =>
          timeline.host === host && timeline.accessToken === accessToken
      )
    }
  },
  mutations: {
    setTimeline (state, payload) {
      const { host, accessToken, type, data } = payload
      const timeline = {
        host,
        accessToken,
        type,
        data: data.data.map(item => Toot.fromMastodon(item))
      }
      state.timelines = [...state.timelines, timeline]
    }
  },
  actions: {
    firstFetch ({ commit, state }, payload) {
      const { type, host, accessToken } = payload
      return new Promise((resolve, reject) => {
        ipcRenderer.once('fetchHomeTimeline-success', (_, data) => {
          commit('setTimeline', { host, accessToken, type, data })
          resolve()
        })
        ipcRenderer.once('fetchHomeTimeline-error', (_, e) => {
          reject(e)
        })
        if (
          !state.timelines.find(
            tl =>
              tl.type === type &&
              tl.accessToken === accessToken &&
              tl.type === 'hometl'
          )
        ) {
          ipcRenderer.send('fetchHomeTimeline', { host, accessToken })
        }
      })
    }
  }
}
