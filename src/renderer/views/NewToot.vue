<template>
  <NewToot class="newtoot" @requireHeightChange="changeHeight" :style="{ width: width + 'px', height: height + 'px',padding: padding + 'px' }" :destination="destination" :inReplyToID="inReplyToID" :userId="userId"></NewToot>
</template>

<script>
import NewToot from '../components/NewToot/NewToot'
const padding = 4
const defaultWindowHeight = 138
const defaultWindowWidth = 330
export default {
  components: { NewToot },
  props: { userId: Number, inReplyToID: String, destination: String },
  data () {
    return {
      width: 0,
      height: 0,
      padding,
      defaultWindowHeight,
      defaultWindowWidth,
      marginH: 0,
      marginW: 0
    }
  },
  methods: {
    changeHeight (ev) {
      const { cw, fileList } = ev
      let deltaHeight = 0
      if (cw === true) {
        deltaHeight += 34
      }
      if (fileList === true) {
        deltaHeight += 110
      }
      window.resizeTo(window.outerWidth, this.defaultWindowHeight + this.marginH + deltaHeight)
    }
  },
  created () {
    this.marginH = window.outerHeight - window.innerHeight
    this.marginW = window.outerWidth - window.innerWidth
    window.resizeTo(this.defaultWindowWidth + this.marginW, this.defaultWindowHeight + this.marginH)
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
