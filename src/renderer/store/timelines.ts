import { GetterTree, ActionTree, MutationTree } from 'vuex'
import Toot from '@/other/Toot'
import TimelineType from '@/other/TimelineType'
import { RootState } from '@/store'
import Mastodon from '../other/Mastodon'
import { Timelines } from './types/Timelines'
import { Timeline } from './types/Timeline'
import { TimelinePayload } from './types/TimelinePayload'

const ipcRenderer = window.ipc

const upperLimitToot = 50

export const namespaced = true

export const state = ():Timelines => ({
  timelines: []
})

export type TimelinesState = ReturnType<typeof state>

export const getters: GetterTree<TimelinesState, RootState> = {
  getTimelines (state) {
    return state.timelines
  },
  getTimeline (state, _getters, _rootState, rootGetters) {
    const { host, accessToken } = rootGetters['users/getCurrentUser']
    return state.timelines.filter(
      timeline =>
        timeline.host === host && timeline.accessToken === accessToken
    )
  }
}

export const mutations: MutationTree<TimelinesState> = {
  cleaningTl (state:Timelines, payload:TimelinePayload) {
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
  setActive (state:Timelines, payload:TimelinePayload) {
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
  setTimeline (state:Timelines, payload:TimelinePayload) {
    const { type, statuses, notifications, host, accessToken, user, firstLoadDone } = payload
    let data:Array<Toot> = []
    if (type !== TimelineType.notification) {
      if (statuses) {
        data = statuses.map(item => Toot.fromMastodon(item, user))
      }
    } else if (notifications) {
      data = notifications.map(item => Toot.fromMastodonNotification(item))
    }

    const existsTimeline = state.timelines.find(timeline => timeline.host === host && timeline.accessToken === accessToken && timeline.type === type) !== undefined
    if (existsTimeline) {
      for (const timeline of state.timelines) {
        if (
          timeline.host === host &&
          timeline.accessToken === accessToken &&
          timeline.type === type
        ) {
          timeline.firstLoadDone = firstLoadDone
          timeline.data = data
          break
        }
      }
    } else {
      const timeline:Timeline = {
        host,
        accessToken,
        type,
        active: false,
        data,
        user,
        firstLoadDone
      }
      state.timelines = [...state.timelines, timeline]
    }
  },
  prependNotification (state:Timelines, payload:TimelinePayload) {
    const { host, accessToken, notification } = payload
    for (const timeline of state.timelines) {
      if (
        timeline.host === host &&
        timeline.accessToken === accessToken &&
        timeline.type === TimelineType.notification
      ) {
        timeline.data = [
          Toot.fromMastodonNotification(notification),
          ...timeline.data
        ]
        break
      }
    }
  },
  prependTootTimeline (state:Timelines, payload:TimelinePayload) {
    const { type, status, host, accessToken, user } = payload
    for (const timeline of state.timelines) {
      if (
        timeline.host === host &&
        timeline.accessToken === accessToken &&
        timeline.type === type &&
        status !== undefined
      ) {
        timeline.data = [Toot.fromMastodon(status, user), ...timeline.data]
        break
      }
    }
  },
  appendNotificationTimeline (state:Timelines, payload:TimelinePayload) {
    const { notifications, host, accessToken } = payload
    for (const timeline of state.timelines) {
      if (
        timeline.host === host &&
        timeline.accessToken === accessToken &&
        timeline.type === TimelineType.notification &&
        notifications !== undefined
      ) {
        timeline.data = [
          ...timeline.data,
          ...notifications.map(d => Toot.fromMastodonNotification(d))
        ]
        break
      }
    }
  },
  appendTootsTimeline (state:Timelines, payload:TimelinePayload) {
    const { type, statuses, host, accessToken, user } = payload
    for (const timeline of state.timelines) {
      if (
        timeline.host === host &&
        timeline.accessToken === accessToken &&
        timeline.type === type &&
        statuses !== undefined
      ) {
        timeline.data = [
          ...timeline.data,
          ...statuses.map(d => Toot.fromMastodon(d, user))
        ]
        break
      }
    }
  },
  removeTootFromNotification (state:Timelines, payload:TimelinePayload) {
    const { id, host, accessToken } = payload
    for (const timeline of state.timelines) {
      if (
        timeline.host === host &&
        timeline.accessToken === accessToken &&
        timeline.type === TimelineType.notification
      ) {
        const roundedId = parseInt(id, 10)
        timeline.data = timeline.data.filter(
          timeline => timeline.originalId === undefined || (timeline.originalId !== undefined && parseInt(timeline.originalId) !== roundedId))
      }
    }
  },
  removeTootFromTl (state:Timelines, payload:TimelinePayload) {
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
  // // 未使用？
  // setFavorite (state, payload) {
  //   const { id, to, host, accessToken } = payload
  //   for (const timeline of state.timelines) {
  //     if (timeline.host === host && timeline.accessToken === accessToken) {
  //       for (const toot of timeline.data) {
  //         if (toot.originalId === id) {
  //           toot.favorited = to
  //           break
  //         }
  //       }
  //     }
  //   }
  // },
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
}

export const actions: ActionTree<TimelinesState, RootState> = {
  reply (_, payload) {
    const { inReplyToID, destinations } = payload
    const id = this.getters['users/getCurrentUserId']
    const currentPath = localStorage.getItem('currentPath')
    ipcRenderer.send(
      'newWindow',
      `${currentPath}#/newtoot/${id}?inReplyToID=${inReplyToID}&destinations=${destinations}`,
      'newToot'
    )
  },
  conversation (_, payload) {
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
  boost ({ commit }, payload) {
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
  unBoost ({ commit }, payload) {
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
  deleteOwnToot (_, payload) {
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
  favorite (_, payload) {
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
  unFavorite (_, payload) {
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
  loadOldToot ({ commit }, payload) {
    const { host, accessToken, user } = this.getters['users/getCurrentUser']
    const { type, maxID } = payload
    if (type === TimelineType.hometl) {
      return new Promise<void>((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchHomeTimeline({ maxID }).then((result) => {
          commit('appendTootsTimeline', {
            host,
            accessToken,
            user,
            type,
            maxID,
            statuses: result
          })
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    } else if (type === TimelineType.localtl) {
      return new Promise<void>((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchLocalTimeline({ maxID }).then((result) => {
          commit('appendTootsTimeline', {
            host,
            accessToken,
            user,
            type,
            maxID,
            statuses: result
          })
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    } else if (type === TimelineType.publictl) {
      return new Promise<void>((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchPublicTimeline({ maxID }).then((result) => {
          commit('appendTootsTimeline', {
            host,
            accessToken,
            user,
            type,
            maxID,
            statuses: result
          })
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    } else {
      return new Promise<void>((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchNotification({ maxID }).then((result) => {
          commit('appendNotificationTimeline', {
            host,
            accessToken,
            user,
            type,
            maxID,
            notifications: result
          })
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    }
  },
  async firstFetch ({ commit }, payload) {
    const { host, accessToken, user } = this.getters['users/getCurrentUser']
    const { type } = payload
    const emptyStatus:Array<Toot> = []
    commit('setTimeline', { host, accessToken, type, statuses: emptyStatus, user, firstLoadDone: false })
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    try {
      if (type !== TimelineType.notification) {
        let result
        if (type === TimelineType.hometl) {
          result = await mastodon.fetchHomeTimeline()
        } else if (type === TimelineType.localtl) {
          result = await mastodon.fetchLocalTimeline()
        } else if (type === TimelineType.publictl) {
          result = await mastodon.fetchPublicTimeline()
        }
        commit('setTimeline', { host, accessToken, type, statuses: result, user, firstLoadDone: true })
      } else {
        const result = await mastodon.fetchNotification()
        commit('setTimeline', { host, accessToken, type, notifications: result, user, firstLoadDone: true })
      }
    } catch (e) {
      if (type !== TimelineType.notification) {
        commit('setTimeline', { host, accessToken, type, statuses: emptyStatus, user, firstLoadDone: true })
      } else {
        commit('setTimeline', { host, accessToken, type, notifications: emptyStatus, user, firstLoadDone: true })
      }
      throw e
    }
  },
  startStreaming ({ commit, dispatch }, payload) {
    const { type } = payload
    const { host, accessToken, user } = this.getters['users/getCurrentUser']
    const userNum = this.getters['users/getCurrentUserId']
    if (type === TimelineType.hometl) {
      return new Promise<void>((resolve, reject) => {
        try {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          const stream = mastodon.streamHomeTimeline()
          stream.on('message', (msg:any) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                status: data,
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
                notification: data
              })
            }
          })
          stream.on('error', (error:any) => {
            reject(error)
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    } else if (type === TimelineType.localtl) {
      return new Promise<void>((resolve, reject) => {
        try {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          const stream = mastodon.streamLocalTimeline()
          stream.on('message', (msg:any) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                status: data,
                user
              })
              commit('cleaningTl', { host, accessToken })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromTl', { host, accessToken, type, id })
            }
          })
          stream.on('error', (error:any) => {
            reject(error)
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    } else {
      return new Promise<void>((resolve, reject) => {
        try {
          const mastodon = Mastodon.getMastodon({ accessToken, host })
          const stream = mastodon.streamPublicTimeline()
          stream.on('message', (msg:any) => {
            if (msg.event === 'update') {
              const data = msg.data
              commit('prependTootTimeline', {
                host,
                accessToken,
                type,
                status: data,
                user
              })
              commit('cleaningTl', { host, accessToken })
            } else if (msg.event === 'delete') {
              const id = msg.data
              commit('removeTootFromNotification', { host, accessToken, id })
              commit('removeTootFromTl', { host, accessToken, type, id })
            }
          })
          stream.on('error', (error:any) => {
            reject(error)
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    }
  },
  cleaningTl ({ commit }, payload) {
    const { type } = payload
    const { host, accessToken } = this.getters['users/getCurrentUser']
    commit('cleaningTl', { type, host, accessToken })
  },
  setActive ({ commit }, payload) {
    const { type } = payload
    const { host, accessToken } = this.getters['users/getCurrentUser']
    commit('setActive', { type, host, accessToken })
  }
}
