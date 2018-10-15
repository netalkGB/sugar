<template>
  <NewToot class="newtoot" @requireHeightChange="changeHeight" :style="{ width: width + 'px', height: height + 'px',padding: padding + 'px' }" :userId="userId"></NewToot>
</template>

<script>
import NewToot from '../components/NewToot/NewToot'
const padding = 4
const defaultWindowHeight = 150
const defaultWindowWidth = 320
export default {
  components: { NewToot },
  props: { userId: Number },
  data () {
    return {
      width: 0,
      height: 0,
      padding,
      defaultWindowHeight,
      defaultWindowWidth
    }
  },
  methods: {
    changeHeight (ev) {
      const { cw, fileList } = ev
      let deltaHeight = 0
      if (cw === true) {
        deltaHeight += 30
      }
      if (fileList === true) {
        deltaHeight += 118
      }
      window.resizeTo(this.width + this.padding * 2, this.defaultWindowHeight + deltaHeight)
    }
  },
  created () {
    this.width = window.innerWidth - this.padding * 2
    this.height = window.innerHeight - this.padding * 2
    window.addEventListener('resize', e => {
      this.width = window.innerWidth - this.padding * 2
      this.height = window.innerHeight - this.padding * 2
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  }
}
</script>

<style scoped>
</style>
