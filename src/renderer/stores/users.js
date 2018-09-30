import logger from '../other/Logger'
import { ipcRenderer } from 'electron'
import Settings from '../other/Settings'

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
        userNumber: state.nextUserId++
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
      return Settings.saveUsers(getters['getUsers'])
    },
    async loadUserConfig ({ commit }, _) {
      const users = await Settings.getUsers()
      if (users !== null) {
        commit('set', users)
      }
    },
    addUser ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.once('login2-success', (_, tokens) => {
          const { clientId, clientSecret, accessToken, host } = tokens
          commit('add', { clientId, clientSecret, accessToken, host })
          resolve()
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
