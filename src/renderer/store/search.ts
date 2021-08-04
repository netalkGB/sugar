import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import Profile from '@/other/Profile'
import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
import { Search } from './types/Search'
// const ipcRenderer = window.ipc

export const namespaced = true

export const state = (): Search => ({
  accounts: [],
  timeline: [],
  active: 'user'
})

export type CounterState = ReturnType<typeof state>

export const mutations: MutationTree<CounterState> = {
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
}

export const actions: ActionTree<CounterState, RootState> = {
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
    return new Promise<void>((resolve, reject) => {
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      mastodon.searchMastodon(q).then((data) => {
        const accounts:Array<Entity.Account> = data.accounts
        const statuses:Array<Entity.Status> = data.statuses
        commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
        commit('setAccounts', accounts.map(account =>
          Profile.fromAccount(account, ownFollowers, ownFollowings)
        ))
        resolve()
      }).catch((e) => {
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
