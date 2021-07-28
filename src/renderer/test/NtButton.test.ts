import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NtButton from '@/components/NtButton.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('NtButton.vue', () => {
  const wrapper = shallowMount(NtButton)
  it('must be emit click event', async () => {
    expect(wrapper.emitted().click).not.toBeTruthy()
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
