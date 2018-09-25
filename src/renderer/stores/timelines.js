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
      const { type, data, host, accessToken } = payload
      const timeline = {
        host,
        accessToken,
        type,
        data: data.data.map(item => Toot.fromMastodon(item))
      }
      state.timelines = [...state.timelines, timeline]
    },
    prependTootTimeline (state, payload) {
      const { type, data, host, accessToken } = payload
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
    },
    appendTootsTimeline (state, payload) {
      const { type, data, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.data = [
            ...timeline.data,
            ...data.data.map(d => Toot.fromMastodon(d))
          ]
          break
        }
      }
    },
    removeTootFromTl (state, payload) {
      const { id, type, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          const roundedId = parseInt(id, 10)
          timeline.data = timeline.data.filter(
            timeline => parseInt(timeline.id) !== roundedId
          )
        }
      }
    },
    setFavorite (state, payload) {
      const { id, to, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (timeline.host === host && timeline.accessToken === accessToken) {
          for (let toot of timeline.data) {
            if (toot.id === id) {
              toot.favorited = to
              break
            }
          }
        }
      }
    },
    setBoost (state, payload) {
      const { id, to, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (timeline.host === host && timeline.accessToken === accessToken) {
          for (let toot of timeline.data) {
            if (toot.id === id) {
              toot.boosted = to
              break
            }
          }
        }
      }
    }
  },
  actions: {
    boost ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('boost-success', (_, data) => {
          commit('setBoost', { host, accessToken, id, to: true })
          resolve(data)
        })
        ipcRenderer.once('boost-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('boost', { host, accessToken, id })
      })
    },
    unBoost ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('unBoost-success', (_, data) => {
          commit('setBoost', { host, accessToken, id, to: false })
          resolve(data)
        })
        ipcRenderer.once('unBoost-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('unBoost', { host, accessToken, id })
      })
    },
    favorite ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('favorite-success', (_, data) => {
          commit('setFavorite', { host, accessToken, id, to: true })
          resolve(data)
        })
        ipcRenderer.once('favorite-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('favorite', { host, accessToken, id })
      })
    },
    unFavorite ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('unFavorite-success', (_, data) => {
          commit('setFavorite', { host, accessToken, id, to: false })
          resolve(data)
        })
        ipcRenderer.once('unFavorite-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('unFavorite', { host, accessToken, id })
      })
    },
    loadOldToot ({ commit, state }, payload) {
      const { host, accessToken } = this.getters['users/getCurrentUser']
      const { type, maxID } = payload
      if (type === 'hometl') {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchHomeTimeline-success', (_, data) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              type,
              maxID,
              data
            })
            resolve()
          })
          ipcRenderer.once('fetchHomeTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.send('fetchHomeTimeline', { host, accessToken, maxID })
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchLocalTimeline-success', (_, data) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              type,
              maxID,
              data
            })
            resolve()
          })
          ipcRenderer.once('fetchLocalTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.send('fetchLocalTimeline', { host, accessToken, maxID })
        })
      }
    },
    firstFetch ({ commit, state }, payload) {
      const { host, accessToken } = this.getters['users/getCurrentUser']
      const { type } = payload
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
      const { type } = payload
      const { host, accessToken } = this.getters['users/getCurrentUser']
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
              commit('prependTootTimeline', { host, accessToken, type, data })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromTl', { host, accessToken, type, id })
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
              commit('prependTootTimeline', { host, accessToken, type, data })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromTl', { host, accessToken, type, id })
            }
          })
          ipcRenderer.send('streamLocalTimeline', { host, accessToken })
        })
      }
    }
  }
}
