import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc
const limit = 100
export default {
  namespaced: true,
  state: {
    timeline: []
  },
  mutations: {
    setTimeline (state, timeline) {
      state.timeline = timeline
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
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.fetchOwnFavouriteTimeline(
          { limit }
        ).then(result => {
          const statuses = result.data
          commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
          resolve()
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
  }
}
