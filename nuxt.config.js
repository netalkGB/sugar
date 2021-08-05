export default {
  ssr: false,
  head: {
    title: 'mastoot',
    meta: [
      { charset: 'utf-8' }
    ]
  },
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
