import { ipcRenderer } from 'electron'
import logger from '@/other/Logger'
import Profile from '@/other/Profile'
export default {
  namespaced: true,
  state: {
    userList: [],
    currentUser: 0,
    nextUserId: 1
  },
  getters: {
    getUserList (state) {
      return state.userList
    },
    getUsers (state) {
      const { userList, nextUserId } = state
      return { userList, nextUserId }
    },
    getCurrentUserId (state) {
      return state.currentUser
    },
    getCurrentUser (state) {
      return state.userList.find(user => user.userNumber === state.currentUser)
    }
  },
  mutations: {
    add (state, payload) {
      logger.debug(payload)
      const user = {
        clientId: payload.clientId,
        clientSecret: payload.clientSecret,
        accessToken: payload.accessToken,
        host: payload.host,
        userNumber: state.nextUserId++,
        user: payload.user
      }
      logger.debug(user)
      state.userList.push(user)
    },
    setId (state, payload) {
      state.currentUser = payload
    },
    set (state, payload) {
      state.userList = payload.userList
      state.nextUserId = payload.nextUserId
    }
  },
  actions: {
    setCurrentUserId ({ commit }, id) {
      commit('setId', id)
    },
    saveUserConfig ({ getters }) {
      localStorage.mastootConfigUsers = JSON.stringify(getters['getUsers'])
    },
    loadUserConfig ({ commit }, _) {
      if (localStorage.mastootConfigUsers) {
        commit('set', JSON.parse(localStorage.mastootConfigUsers))
      }
    },
    addUser ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.once('login2-success', (_, tokens) => {
          const { clientId, clientSecret, accessToken, host } = tokens
          ipcRenderer.once('fetchOwnAccount-success', (ev, user) => {
            if (user.resp.statusCode !== 200) {
              reject(user)
              return
            }
            commit('add', {
              clientId,
              clientSecret,
              accessToken,
              host,
              user: Profile.fromAccount(user.data)
            })
            resolve()
          })
          ipcRenderer.once('fetchOwnAccount-error', (_, e) => {
            reject(e)
          })
          ipcRenderer.send('fetchOwnAccount', { host, accessToken })
        })
        ipcRenderer.once('login2-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('login2', payload)
      })
    },
    getPIN (_, host) {
      return new Promise((resolve, reject) => {
        ipcRenderer.once('login-success', (_, obj) => {
          resolve(obj)
        })
        ipcRenderer.once('login-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('login', host)
      })
    }
  }
}
