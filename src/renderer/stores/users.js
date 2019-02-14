import logger from '@/other/Logger'
import Profile from '@/other/Profile'
const ipcRenderer = window.ipc

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
        user: payload.user,
        menu: null
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
    },
    setMenu (state, payload) {
      const menu = payload
      const user = state.userList.find(
        item => item.userNumber === state.currentUser
      )
      if (user) {
        user.menu = menu
      }
    }
  },
  actions: {
    setCurrentUserId ({ commit }, id) {
      commit('setId', id)
    },
    saveUserConfig ({ getters }) {
      localStorage.mastootConfigUsers = JSON.stringify(getters['getUsers'])
    },
    setMenu ({ commit, dispatch }, menu) {
      commit('setMenu', menu)
      dispatch('saveUserConfig')
    },
    loadUserConfig ({ commit }, _) {
      if (localStorage.mastootConfigUsers) {
        commit('set', JSON.parse(localStorage.mastootConfigUsers))
      }
    },
    fetchOwnFollower ({ dispatch, getters }) {
      const { accessToken, host, user } = getters['getCurrentUser']
      const { internalid } = user
      ipcRenderer.send('fetchProfileFollowers', {
        host,
        accessToken,
        id: internalid,
        limit: 65536
      })
      ipcRenderer.once('fetchProfileFollowers-success', (_, data) => {
        const followers = data.result.data
        logger.debug(followers)
      })
      ipcRenderer.once('fetchProfileFollowers-error', (_, e) => {
        logger.error(e)
      })
    },
    fetchOwnFollowing ({ dispatch, getters }) {
      const { accessToken, host, user } = getters['getCurrentUser']
      const { internalid } = user
      ipcRenderer.send('fetchProfileFollowing', {
        host,
        accessToken,
        id: internalid,
        limit: 65536
      })
      ipcRenderer.once('fetchProfileFollowing-success', (_, data) => {
        const followings = data.result.data
        logger.debug(followings)
      })
      ipcRenderer.once('fetchProfileFollowing-error', (_, e) => {
        logger.error(e)
      })
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
