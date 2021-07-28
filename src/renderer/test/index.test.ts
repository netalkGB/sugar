import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import index from '@/pages/index.vue'
import NtButton from '@/components/NtButton.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('index.vue', () => {
  const counter = {
    namespaced: true,
    actions: {
      increment: jest.fn()
    },
    getters: {
      getCount: () => 255
    }
  }

  const store = new Vuex.Store({
    modules: {
      counter
    }
  })
  const wrapper = mount(index, { store, localVue })
  it('has count and button label', () => {
    expect(wrapper.html()).toContain('<div>255</div>')
    expect(wrapper.html()).toContain('TEST')
  })

  it('button click should increment call', async () => {
    expect(counter.actions.increment).not.toBeCalled()
    const button = wrapper.findComponent(NtButton)
    await button.trigger('click')
    expect(counter.actions.increment).toBeCalled()
  })
})
