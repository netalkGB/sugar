export default {
  ssr: false,
  srcDir: 'src/renderer',
  target: 'static',
  buildModules: ['@nuxt/typescript-build'],
  router: {
    mode: 'hash'
  },
  generate: {
    dir: 'out/renderer'
  }
}
