import { ipcRenderer } from 'electron'
import Toot from '@/other/Toot'
import TimelineType from '@/other/TimelineType'
const upperLimitToot = 50
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
    cleaningTl (state, payload) {
      const { type, host, accessToken } = payload
      if (type !== undefined) {
        for (let timeline of state.timelines) {
          if (
            timeline.host === host &&
            timeline.accessToken === accessToken &&
            timeline.type === type
          ) {
            if (timeline.data.length >= upperLimitToot) {
              timeline.data = timeline.data.slice(0, upperLimitToot)
            }
            break
          }
        }
      } else {
        for (let timeline of state.timelines) {
          if (
            timeline.active === false &&
            timeline.host === host &&
            timeline.accessToken === accessToken
          ) {
            if (timeline.data.length >= upperLimitToot) {
              timeline.data = timeline.data.slice(0, upperLimitToot)
            }
          }
        }
      }
    },
    setActive (state, payload) {
      const { type, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.active = true
        } else {
          timeline.active = false
        }
      }
    },
    setTimeline (state, payload) {
      const { type, data, host, accessToken, user } = payload
      const timeline = {
        host,
        accessToken,
        type,
        active: false,
        data:
          type !== TimelineType.notification
            ? data.data.map(item => Toot.fromMastodon(item, user))
            : data.data.map(item => Toot.fromMastodonNotification(item, user))
      }
      state.timelines = [...state.timelines, timeline]
    },
    prependNotification (state, payload) {
      const { data, host, accessToken, user } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === TimelineType.notification
        ) {
          timeline.data = [
            Toot.fromMastodonNotification(data, user),
            ...timeline.data
          ]
          break
        }
      }
    },
    prependTootTimeline (state, payload) {
      const { type, data, host, accessToken, user } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.data = [Toot.fromMastodon(data, user), ...timeline.data]
          break
        }
      }
    },
    appendNotificationTimeline (state, payload) {
      const { data, host, accessToken, user } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === TimelineType.notification
        ) {
          timeline.data = [
            ...timeline.data,
            ...data.data.map(d => Toot.fromMastodonNotification(d, user))
          ]
          break
        }
      }
    },
    appendTootsTimeline (state, payload) {
      const { type, data, host, accessToken, user } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.data = [
            ...timeline.data,
            ...data.data.map(d => Toot.fromMastodon(d, user))
          ]
          break
        }
      }
    },
    removeTootFromNotification (state, payload) {
      const { id, host, accessToken } = payload
      for (let timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === TimelineType.notification
        ) {
          const roundedId = parseInt(id, 10)
          timeline.data = timeline.data.filter(
            timeline => parseInt(timeline.originalId) !== roundedId
          )
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
            if (toot.originalId === id) {
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
            if (toot.originalId === id) {
              toot.boosted = to
              break
            }
          }
        }
      }
    }
  },
  actions: {
    reply ({ commit, state }, payload) {
      const { inReplyToID, destination } = payload
      const id = this.getters['users/getCurrentUserId']
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send(
        'newWindow',
        `${currentPath}#/newtoot/${id}?inReplyToID=${inReplyToID}&destination=${destination}`,
        'newToot'
      )
    },
    conversation ({ commit, state }, payload) {
      const { id } = payload
      const userid = this.getters['users/getCurrentUserId']
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send(
        'newWindow',
        `${currentPath}#/conversation/${userid}?id=${id}`,
        'conversations'
      )
    },
    profile (_, payload) {
      const { acct } = payload
      const userid = this.getters['users/getCurrentUserId']
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send(
        'newWindow',
        `${currentPath}#/profile/${userid}/${acct}`,
        'profile'
      )
    },
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
    deleteOwnToot ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('deleteOwnToot-success', (_, data) => {
          resolve()
        })
        ipcRenderer.once('deleteOwnToot-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('deleteOwnToot', { host, accessToken, id })
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
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const { type, maxID } = payload
      if (type === TimelineType.hometl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchHomeTimeline-success', (_, data) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
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
      } else if (type === TimelineType.localtl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchLocalTimeline-success', (_, data) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
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
      } else if (type === TimelineType.publictl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchPublicTimeline-success', (_, data) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
              type,
              maxID,
              data
            })
            resolve()
          })
          ipcRenderer.once('fetchPublicTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.send('fetchPublicTimeline', { host, accessToken, maxID })
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchNotification-success', (_, data) => {
            commit('appendNotificationTimeline', {
              host,
              accessToken,
              user,
              maxID,
              data
            })
            resolve()
          })
          ipcRenderer.once('fetchNotification-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.send('fetchNotification', { host, accessToken, maxID })
        })
      }
    },
    firstFetch ({ commit, state }, payload) {
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const { type } = payload
      if (type === TimelineType.hometl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchHomeTimeline-success', (_, data) => {
            commit('setTimeline', { host, accessToken, type, data, user })
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
      } else if (type === TimelineType.localtl) {
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
      } else if (type === TimelineType.publictl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchPublicTimeline-success', (_, data) => {
            commit('setTimeline', { host, accessToken, type, data })
            resolve()
          })
          ipcRenderer.once('fetchPublicTimeline-error', (_, e) => {
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
            ipcRenderer.send('fetchPublicTimeline', { host, accessToken })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('fetchNotification-success', (_, data) => {
            commit('setTimeline', { host, accessToken, type, data })
            resolve()
          })
          ipcRenderer.once('fetchNotification-error', (_, e) => {
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
            ipcRenderer.send('fetchNotification', { host, accessToken })
          }
        })
      }
    },
    startStreaming ({ commit, state, dispatch }, payload) {
      const { type } = payload
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const userNum = this.getters['users/getCurrentUserId']
      if (type === TimelineType.hometl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('streamHomeTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamHomeTimeline-onError', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamHomeTimeline-onMessage', (e, msg) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                data,
                user
              })
              commit('cleaningTl', { host, accessToken })
            } else if (msg.event === 'delete') {
              const id = msg.data

              // Notify delete toot to other windows(modals)
              localStorage['user' + userNum] = JSON.stringify({
                type: 'deleteToot',
                id
              })

              dispatch('conversation/removeToot', id, { root: true })
              commit('removeTootFromTl', { host, accessToken, type, id })
              commit('removeTootFromNotification', { host, accessToken, id })
            } else if (msg.event === 'notification') {
              const data = msg.data
              commit('prependNotification', {
                host,
                accessToken,
                user,
                data
              })
            }
          })
          ipcRenderer.send('streamHomeTimeline', { host, accessToken })
        })
      } else if (type === TimelineType.localtl) {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('streamLocalTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamLocalTimeline-onError', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamLocalTimeline-onMessage', (e, msg) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                data,
                user
              })
              commit('cleaningTl', { host, accessToken })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromTl', { host, accessToken, type, id })
            }
          })
          ipcRenderer.send('streamLocalTimeline', { host, accessToken })
        })
      } else {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('streamPublicTimeline-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamPublicTimeline-onError', (_, e) => {
            reject(e)
          })
          ipcRenderer.on('streamPublicTimeline-onMessage', (e, msg) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                data,
                user
              })
              commit('cleaningTl', { host, accessToken })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromNotification', { host, accessToken, id })
              commit('removeTootFromTl', { host, accessToken, type, id })
            }
          })
          ipcRenderer.send('streamPublicTimeline', { host, accessToken })
        })
      }
    },
    cleaningTl ({ commit, state }, payload) {
      const { type } = payload
      const { host, accessToken } = this.getters['users/getCurrentUser']
      commit('cleaningTl', { type, host, accessToken })
    },
    setActive ({ commit, state }, payload) {
      const { type } = payload
      const { host, accessToken } = this.getters['users/getCurrentUser']
      commit('setActive', { type, host, accessToken })
    }
  }
}
