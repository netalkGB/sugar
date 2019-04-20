import Toot from '@/other/Toot'
const ipcRenderer = window.ipc

export default {
  namespaced: true,
  state: {
    timeline: []
  },
  mutations: {
    setTimeline (state, timeline) {
      state.timeline = timeline
    },
    appendTimeline (state, payload) {
      const { timeline } = payload
      state.timeline = [...state.timeline, ...timeline]
    },
    removeTootFromTl (state, payload) {
      const { id } = payload
      const roundedId = parseInt(id, 10)
      state.timeline = state.timeline.filter(
        toot => parseInt(toot.id) !== roundedId
      )
    }
  },
  actions: {
    removeToot ({ commit }, payload) {
      const id = payload.id
      commit('removeTootFromTl', { id })
    },
    fetchFavourite ({ commit, state }) {
      const currentUser = this.getters['users/getCurrentUser']
      const { accessToken, host } = currentUser
      const ownUser = currentUser.user
      return new Promise((resolve, reject) => {
        ipcRenderer.once('fetchOwnFavourite-success', (_, data) => {
          const statuses = data.result.data
          commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
          resolve()
        })
        ipcRenderer.once('fetchOwnFavourite-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('fetchOwnFavourite', { host, accessToken })
      })
    },
    async loadOldToot ({ commit }, { internalId, maxID }) {
      const { accessToken, host } = this.getters['users/getCurrentUser']
      return new Promise((resolve, reject) => {
        ipcRenderer.once('fetchOwnFavourite-success', (_, data) => {
          const toots = data.result.data
          commit('appendTimeline', {
            timeline: toots.map(d => Toot.fromMastodon(d))
          })
          resolve()
        })
        ipcRenderer.once('fetchOwnFavourite-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('fetchOwnFavourite', {
          host,
          accessToken,
          maxID
        })
      })
    }
  }
}
