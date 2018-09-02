import pow from '@/renderer/other/pow'

describe('pow', () => {
  it('should be pow', () => {
    const result = pow(2, 10)
    expect(result).toBe(1024)
  })
})
