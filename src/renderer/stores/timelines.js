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
    },
    prependTimeline (state, payload) {
      const { host, accessToken, type, data } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.data = [Toot.fromMastodon(data), ...timeline.data]
          break
        }
      }
    }
  },
  actions: {
    firstFetch ({ commit, state }, payload) {
      const { type, host, accessToken } = payload
      if (type === 'hometl') {
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
                tl.type === type
            )
          ) {
            ipcRenderer.send('fetchHomeTimeline', { host, accessToken })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchLocalTimeline-success', (_, data) => {
            commit('setTimeline', { host, accessToken, type, data })
            resolve()
          })
          ipcRenderer.once('fetchLoclaTimeline-error', (_, e) => {
            reject(e)
          })
          if (
            !state.timelines.find(
              tl =>
                tl.type === type &&
                tl.accessToken === accessToken &&
                tl.type === type
            )
          ) {
            ipcRenderer.send('fetchLocalTimeline', { host, accessToken })
          }
        })
      }
    },
    startStreaming ({ commit, state }, payload) {
      const { type, host, accessToken } = payload
      if (type === 'hometl') {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchHomeTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamHomeTimeline-onError', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamHomeTimeline-onMessage', (e, msg) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTimeline', { host, accessToken, type, data })
            }
          })
          ipcRenderer.send('streamHomeTimeline', { host, accessToken })
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchLocalTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamLocalTimeline-onError', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamLocalTimeline-onMessage', (e, msg) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTimeline', { host, accessToken, type, data })
            }
          })
          ipcRenderer.send('streamLocalTimeline', { host, accessToken })
        })
      }
    }
  }
}
