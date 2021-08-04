import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { Entity } from 'megalodon'
import { Conversation } from '@/store/types/Conversation'
import logger from '@/other/Logger'
import Toot from '@/other/Toot'
import Mastodon from '../other/Mastodon'
// const ipcRenderer = window.ipc

function loadToot ({ host, accessToken, id }:{host:string;accessToken:string;id:string}) {
  return new Promise<Entity.Status>((resolve, reject) => {
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    mastodon.fetchToot(id).then((result) => {
      resolve(result)
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

function loadContext ({ host, accessToken, id }:{host:string;accessToken:string;id:string}) {
  return new Promise<Entity.Context>((resolve, reject) => {
    const mastodon = Mastodon.getMastodon({ accessToken, host })
    mastodon.fetchContext(id).then((result) => {
      resolve(result)
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

export const namespaced = true

export const state = ():Conversation => ({
  conversations: []
})

export type ConversationState = ReturnType<typeof state>

export const getters: GetterTree<ConversationState, RootState> = {
  getConversations (state) {
    return state.conversations
  }
}

export const mutations: MutationTree<ConversationState> = {
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
}

export const actions: ActionTree<ConversationState, RootState> = {
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
    const data = [
      ...context.ancestors.map(item =>
        Toot.fromMastodon(item, user)
      ),
      Toot.fromMastodon(toot, user),
      ...context.descendants.map(item =>
        Toot.fromMastodon(item, user)
      )
    ]
    logger.debug(data.length, 'item(s)')
    commit('setConversations', { conversations: data })
  }
}
