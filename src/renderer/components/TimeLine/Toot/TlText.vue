<template>
  <div class="text" ref="tltext" v-html="content"></div>
</template>

<script>
import { shell } from 'electron'
export default {
  props: ['content'],
  data () {
    return {
      hrefs: null
    }
  },
  mounted () {
    this.hrefs = this.$refs.tltext.querySelectorAll('p > a')
    for (let a of this.hrefs) {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        shell.openExternal(e.path.find(elem => elem.href).href)
      })
    }
  },
  beforeDestroy () {
    for (let a of this.hrefs) {
      a.removeEventListener('click', (e) => { })
    }
  }
}
</script>

<style scoped>
.text {
  overflow-wrap: break-word;
  width: 100%;
}
</style>
