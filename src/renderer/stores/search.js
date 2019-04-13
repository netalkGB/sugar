import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
const ipcRenderer = window.ipc

export default {
  namespaced: true,
  state: {
    accounts: [],
    timeline: [],
    active: 'user'
  },
  mutations: {
    setAccounts (state, accounts) {
      state.accounts = accounts
    },
    setTimeline (state, timeline) {
      state.timeline = timeline
    },
    removeTootFromTl (state, payload) {
      const { id } = payload
      const roundedId = parseInt(id, 10)
      state.timeline = state.timeline.filter(
        toot => parseInt(toot.id) !== roundedId
      )
    },
    setListType (state, type) {
      state.active = type
    }
  },
  actions: {
    removeToot ({ commit }, payload) {
      const id = payload.id
      commit('removeTootFromTl', { id })
    },
    toggleListType ({ commit }, payload) {
      const type = payload.type
      commit('setListType', type)
    },
    searchMastodon ({ commit, state }, payload) {
      const currentUser = this.getters['users/getCurrentUser']
      const { accessToken, host } = currentUser
      const ownFollowers = currentUser.followers
      const ownFollowings = currentUser.followings
      const ownUser = currentUser.user
      const { q } = payload
      return new Promise((resolve, reject) => {
        ipcRenderer.once('searchMastodon-success', (_, data) => {
          const { accounts, statuses } = data.result.data
          commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
          commit('setAccounts', accounts.map(account =>
            Profile.fromAccount(account, ownFollowers, ownFollowings)
          ))
          resolve()
        })
        ipcRenderer.once('searchMastodon-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('searchMastodon', { host, accessToken, q })
      })
    }
  }
}
