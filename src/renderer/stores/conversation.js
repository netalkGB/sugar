import logger from '@/other/Logger'
import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc

function loadToot ({ host, accessToken, id }) {
  return new Promise((resolve, reject) => {
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    mastodon.fetchToot(id).then(result => {
      resolve(result)
    }).catch(e => {
      const returnErr = {
        error: e,
        host,
        accessToken
      }
      reject(returnErr)
    })
  })
}

function loadContext ({ host, accessToken, id }) {
  return new Promise((resolve, reject) => {
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    mastodon.fetchContext(id).then(result => {
      resolve(result)
    }).catch(e => {
      const returnErr = {
        error: e,
        host,
        accessToken
      }
      reject(returnErr)
    })
  })
}

export default {
  namespaced: true,
  state: {
    conversations: []
  },
  getters: {
    getConversations (state) {
      return state.conversations
    }
  },
  mutations: {
    setConversations (state, payload) {
      const { conversations } = payload
      state.conversations = conversations
    },
    removeTootFromTl (state, payload) {
      const { id } = payload
      const roundedId = parseInt(id, 10)
      state.conversations = state.conversations.filter(
        toot => parseInt(toot.id) !== roundedId
      )
    }
  },
  actions: {
    removeToot ({ commit }, payload) {
      const id = payload.id
      commit('removeTootFromTl', { id })
    },
    async loadConversations ({ commit }, { tootId }) {
      const { accessToken, host, user } = this.getters['users/getCurrentUser']
      logger.debug(accessToken)
      logger.debug(host)

      const [toot, context] = await Promise.all([
        loadToot({ accessToken, host, id: tootId }),
        loadContext({ accessToken, host, id: tootId })
      ])
      let data = [
        ...context.data.ancestors.map(item =>
          Toot.fromMastodon(item, user)
        ),
        Toot.fromMastodon(toot.data, user),
        ...context.data.descendants.map(item =>
          Toot.fromMastodon(item, user)
        )
      ]
      logger.debug(data.length, 'item(s)')
      commit('setConversations', { conversations: data })
    }
  }
}
