import { mount } from '@vue/test-utils'
import Hello from '@/renderer/components/Hello'

describe('Hello', () => {
  const wrapper = mount(Hello)
  it('render correct pow and url', () => {
    expect(wrapper.html()).toContain('1024')
    expect(wrapper.html()).toContain('http')
  })
})
