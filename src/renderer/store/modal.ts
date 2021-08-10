import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { Modal } from '@/store/types/Modal'

export const namespaced = true

export const state = ():Modal => ({
  open: false,
  messages: []
})

export type ModalState = ReturnType<typeof state>

export const mutations: MutationTree<ModalState> = {
  closeModal (state) {
    state.open = false
    state.messages = []
  },
  openModal (state, payload:{message:string|undefined;messages:Array<string> | undefined}) {
    const { message, messages } = payload
    if (message !== undefined) {
      state.messages = [...state.messages, message]
    }
    if (messages !== undefined) {
      state.messages = [...state.messages, ...messages]
    }
    state.open = true
  }
}

export const actions: ActionTree<ModalState, RootState> = {
  showMessage ({ commit }, payload) {
    const message = payload.message
    const messages = payload.messages
    commit('openModal', { message, messages })
  },
  closeModal ({ commit }, _payload) {
    commit('closeModal')
  }
}
