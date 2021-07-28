import Vuex from 'vuex'
import * as counter from '@/store/counter'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('counter', () => {
  const store = new Vuex.Store(counter)
  describe('getters', () => {
    test('counter.count equal 0', () => {
      expect(store.getters.getCount).toBe(0)
    })
  })
  describe('actions', () => {
    test('increment counter.count equal 1', () => {
      store.dispatch('increment')
      expect(store.getters.getCount).toBe(1)
    })
  })
})
