import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import Toot from '@/other/Toot'
import { Favourite } from '@/store/types/Favourite'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc
const limit = 100

export const namespaced = true

export const state = ():Favourite => ({
  timeline: []
})

export type FavouriteState = ReturnType<typeof state>

export const mutations: MutationTree<FavouriteState> = {
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
}

export const actions: ActionTree<FavouriteState, RootState> = {
  removeToot ({ commit }, payload) {
    const id = payload.id
    commit('removeTootFromTl', { id })
  },
  fetchFavourite ({ commit, state }) {
    const currentUser = this.getters['users/getCurrentUser']
    const { accessToken, host } = currentUser
    const ownUser = currentUser.user
    return new Promise<void>((resolve, reject) => {
      const mastodon = Mastodon.getMastodon({ accessToken, host })
      mastodon.fetchOwnFavouriteTimeline(
        { limit }
      ).then((statuses: Array<Entity.Status>) => {
        commit('setTimeline', statuses.map(status => Toot.fromMastodon(status, ownUser)))
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
