import Mastodon from 'mastodon-api'
import logger from '../other/Logger'

export default {
  namespaced: true,
  state: {
    userList: []
  },
  mutations: {
    add (state, payload) {
      logger.debug(payload)
      const user = {
        clientId: payload.clientId,
        clientSecret: payload.clientSecret,
        accessToken: payload.accessToken,
        host: payload.host,
        userNumber: state.userList.length + 1
      }
      logger.debug(user)
      state.userList.push(user)
    }
  },
  actions: {
    addUser ({ commit }, payload) {
      logger.debug('vuex addUser')
      const { clientId, clientSecret, pin, host } = payload
      Mastodon.getAccessToken(
        clientId,
        clientSecret,
        pin,
        `https://${host}/api/v1/`
      ).then(accessToken => {
        logger.debug(accessToken)
        commit('users/add', { clientId, clientSecret, accessToken, host })
      })
    }
  }
}
