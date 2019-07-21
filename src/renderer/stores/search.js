import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc

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
    },
    clear (state) {
      state.timeline = []
      state.accounts = []
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
    clearSearchList ({ commit }) {
      commit('clear')
    },
    searchMastodon ({ commit, state }, payload) {
      const currentUser = this.getters['users/getCurrentUser']
      const { accessToken, host } = currentUser
      const ownFollowers = currentUser.followers
      const ownFollowings = currentUser.followings
      const ownUser = currentUser.user
      const { q } = payload
      return new Promise((resolve, reject) => {
        const mastodon = Mastodon.getMastodon({ accessToken, host })
        mastodon.searchMastodon(q).then(result => {
          console.log(result)
          const { accounts, statuses } = result.data
          commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
          commit('setAccounts', accounts.map(account =>
            Profile.fromAccount(account, ownFollowers, ownFollowings)
          ))
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
