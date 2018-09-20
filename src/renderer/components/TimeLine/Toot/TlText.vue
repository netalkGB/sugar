<template>
  <div id="text" ref="tltext" v-html="content"></div>
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
    this.link = this.$refs.tltext.getElementsByTagName('a')
    for (let a of this.link) {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        shell.openExternal(e.target.href)
      })
    }
  },
  destroyed () {
    for (let a of this.link) {
      a.removeEventListener('click', (e) => { })
    }
  }
}
</script>

<style scoped>
#text {
  overflow-wrap: break-word;
  width: 100%;
}
</style>
