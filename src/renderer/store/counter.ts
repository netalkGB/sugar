import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Counter } from '@/store/types/Counter'
import { RootState } from '@/store'

export const state = () => ({
  counter: {
    count: 0
  } as Counter
})

export type CounterState = ReturnType<typeof state>

export const getters: GetterTree<CounterState, RootState> = {
  getCount: (state) : number => state.counter.count
}

export const mutations: MutationTree<CounterState> = {
  increment: state => (state.counter.count++)
}

export const actions: ActionTree<CounterState, RootState> = {
  increment: ({ commit }) => commit('increment')
}
