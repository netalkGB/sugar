import Toot from '@/other/Toot'
import TimelineType from '@/other/TimelineType'
import Mastodon from '../other/Mastodon'

const ipcRenderer = window.ipc

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
        for (const timeline of state.timelines) {
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
        for (const timeline of state.timelines) {
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
      for (const timeline of state.timelines) {
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
            ? data.map(item => Toot.fromMastodon(item, user))
            : data.map(item => Toot.fromMastodonNotification(item, user))
      }
      state.timelines = [...state.timelines, timeline]
    },
    prependNotification (state, payload) {
      const { data, host, accessToken, user } = payload
      for (const timeline of state.timelines) {
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
      for (const timeline of state.timelines) {
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
      for (const timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === TimelineType.notification
        ) {
          timeline.data = [
            ...timeline.data,
            ...data.map(d => Toot.fromMastodonNotification(d, user))
          ]
          break
        }
      }
    },
    appendTootsTimeline (state, payload) {
      const { type, data, host, accessToken, user } = payload
      for (const timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.data = [
            ...timeline.data,
            ...data.map(d => Toot.fromMastodon(d, user))
          ]
          break
        }
      }
    },
    removeTootFromNotification (state, payload) {
      const { id, host, accessToken } = payload
      for (const timeline of state.timelines) {
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
      for (const timeline of state.timelines) {
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
      for (const timeline of state.timelines) {
        if (timeline.host === host && timeline.accessToken === accessToken) {
          for (const toot of timeline.data) {
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
      for (const timeline of state.timelines) {
        if (timeline.host === host && timeline.accessToken === accessToken) {
          for (const toot of timeline.data) {
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
      const { inReplyToID, destinations } = payload
      const id = this.getters['users/getCurrentUserId']
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send(
        'newWindow',
        `${currentPath}#/newtoot/${id}?inReplyToID=${inReplyToID}&destinations=${destinations}`,
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
      const { internalid } = payload
      const userid = this.getters['users/getCurrentUserId']
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send(
        'newWindow',
        `${currentPath}#/profile/${userid}/${internalid}`,
        'profile'
      )
    },
    boost ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.boost(id).then((result) => {
          commit('setBoost', { host, accessToken, id, to: true })
          resolve(result)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    unBoost ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.unBoost(id).then((result) => {
          commit('setBoost', { host, accessToken, id, to: false })
          resolve(result)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    deleteOwnToot ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.deleteOwnToot(id).then((result) => {
          resolve(result)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    favorite ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.favorite(id).then((result) => {
          resolve(result)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    unFavorite ({ commit, state }, payload) {
      const { id } = payload
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.unFavorite(id).then((result) => {
          resolve(result)
        }).catch((e) => {
          reject(e)
        })
      })
    },
    loadOldToot ({ commit, state }, payload) {
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const { type, maxID } = payload
      if (type === TimelineType.hometl) {
        return new Promise((resolve, reject) => {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          mastodon.fetchHomeTimeline({ maxID }).then((result) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
              type,
              maxID,
              data: result
            })
            resolve()
          }).catch((e) => {
            reject(e)
          })
        })
      } else if (type === TimelineType.localtl) {
        return new Promise((resolve, reject) => {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          mastodon.fetchLocalTimeline({ maxID }).then((result) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
              type,
              maxID,
              data: result
            })
            resolve()
          }).catch((e) => {
            reject(e)
          })
        })
      } else if (type === TimelineType.publictl) {
        return new Promise((resolve, reject) => {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          mastodon.fetchPublicTimeline({ maxID }).then((result) => {
            commit('appendTootsTimeline', {
              host,
              accessToken,
              user,
              type,
              maxID,
              data: result
            })
            resolve()
          }).catch((e) => {
            reject(e)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          mastodon.fetchNotification({ maxID }).then((result) => {
            commit('appendNotificationTimeline', {
              host,
              accessToken,
              user,
              type,
              maxID,
              data: result
            })
            resolve()
          }).catch((e) => {
            reject(e)
          })
        })
      }
    },
    firstFetch ({ commit, state }, payload) {
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const { type } = payload
      if (type === TimelineType.hometl) {
        return new Promise((resolve, reject) => {
          if (
            !state.timelines.find(
              tl =>
                tl.type === type &&
                tl.accessToken === accessToken)
          ) {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            mastodon.fetchHomeTimeline().then((result) => {
              commit('setTimeline', { host, accessToken, type, data: result, user })
              resolve()
            }).catch((e) => {
              reject(e)
            })
          }
        })
      } else if (type === TimelineType.localtl) {
        return new Promise((resolve, reject) => {
          if (
            !state.timelines.find(
              tl =>
                tl.type === type &&
                tl.accessToken === accessToken)
          ) {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            mastodon.fetchLocalTimeline().then((result) => {
              commit('setTimeline', { host, accessToken, type, data: result, user })
              resolve()
            }).catch((e) => {
              reject(e)
            })
          }
        })
      } else if (type === TimelineType.publictl) {
        return new Promise((resolve, reject) => {
          if (
            !state.timelines.find(
              tl =>
                tl.type === type &&
                tl.accessToken === accessToken)
          ) {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            mastodon.fetchPublicTimeline().then((result) => {
              commit('setTimeline', { host, accessToken, type, data: result, user })
              resolve()
            }).catch((e) => {
              reject(e)
            })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          return new Promise((resolve, reject) => {
            if (
              !state.timelines.find(
                tl =>
                  tl.type === type &&
                  tl.accessToken === accessToken)
            ) {
              const mastodon = Mastodon.getMastodon({ accessToken, host })
              mastodon.fetchNotification().then((result) => {
                commit('setTimeline', { host, accessToken, type, data: result, user })
                resolve()
              }).catch((e) => {
                reject(e)
              })
            }
          })
        })
      }
    },
    startStreaming ({ commit, state, dispatch }, payload) {
      const { type } = payload
      const { host, accessToken, user } = this.getters['users/getCurrentUser']
      const userNum = this.getters['users/getCurrentUserId']
      if (type === TimelineType.hometl) {
        return new Promise(async (resolve, reject) => {
          try {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            const stream = await mastodon.streamHomeTimeline()
            stream.on('message', (msg) => {
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
            stream.on('error', (error) => {
              resolve(error)
            })
          } catch (e) {
            resolve(e)
          }
        })
      } else if (type === TimelineType.localtl) {
        return new Promise(async (resolve, reject) => {
          try {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            const stream = await mastodon.streamLocalTimeline()
            stream.on('message', (msg) => {
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
            stream.on('error', (error) => {
              reject(error)
            })
          } catch (e) {
            reject(e)
          }
        })
      } else {
        return new Promise(async (resolve, reject) => {
          try {
            const mastodon = Mastodon.getMastodon({ accessToken, host })
            const stream = await mastodon.streamPublicTimeline()
            stream.on('message', (msg) => {
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
            stream.on('error', (error) => {
              reject(error)
            })
          } catch (e) {
            reject(e)
          }
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
