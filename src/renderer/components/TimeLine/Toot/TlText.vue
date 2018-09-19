<template>
  <div id="text" ref="tltext">
    <p>あああああああああああああああ<a href="https://www.google.com/">Google</a>あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ</p>
  </div>
</template>

<script>
import { shell } from 'electron'
export default {
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
#text > p {
  margin: 0;
}
</style>
