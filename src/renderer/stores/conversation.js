import { ipcRenderer } from 'electron'
import logger from '@/other/Logger'
import Toot from '@/other/Toot'

function loadToot ({ host, accessToken, id }) {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('fetchToot', { host, accessToken, id })
    ipcRenderer.once('fetchToot-success', (_, data) => {
      resolve(data)
    })
    ipcRenderer.once('fetchToot-error', (_, e) => {
      reject(e)
    })
  })
}

function loadContext ({ host, accessToken, id }) {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('fetchContext', { host, accessToken, id })
    ipcRenderer.once('fetchContext-success', (_, data) => {
      resolve(data)
    })
    ipcRenderer.once('fetchContext-error', (_, e) => {
      reject(e)
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
      console.log(state.conversations)
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
        ...context.result.data.ancestors.map(item =>
          Toot.fromMastodon(item, user)
        ),
        Toot.fromMastodon(toot.result.data, user),
        ...context.result.data.descendants.map(item =>
          Toot.fromMastodon(item, user)
        )
      ]
      logger.debug(data.length, 'item(s)')
      commit('setConversations', { conversations: data })
    }
  }
}
