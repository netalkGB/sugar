<template>
  <NewToot
    ref="nt"
    class="newtoot"
    :style="{ width: width + 'px', height: height + 'px',padding: padding + 'px' }"
    :destinations="destinations"
    :in-reply-to-i-d="inReplyToID"
    :user-id="userId"
    @requireHeightChange="changeHeight"
  />
</template>

<script>
import NewToot from '@/components/NewToot/NewToot'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('users')
const padding = 4
const defaultWindowHeight = 138
const defaultWindowWidth = 330
export default {
  components: { NewToot },
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
  computed: {
    userId () {
      return Number(this.$route.params.userId)
    },
    inReplyToID () {
      return String(this.$route.query.inReplyToID)
    },
    destinations () {
      return String(this.$route.query.destinations)
    }
  },
  methods: {
    ...mapActions(['loadUserConfig', 'setCurrentUserId']),
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
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
    this.marginH = window.outerHeight - window.innerHeight
    this.marginW = window.outerWidth - window.innerWidth
    window.resizeTo(this.defaultWindowWidth + this.marginW, this.defaultWindowHeight + this.marginH)
    this.width = window.innerWidth - this.padding * 2
    this.height = window.innerHeight - this.padding * 2
    window.addEventListener('resize', (e) => {
      this.width = window.innerWidth - this.padding * 2
      this.height = window.innerHeight - this.padding * 2
    })
  },
  mounted () {
    this.$refs.nt.setup()
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  }
}
</script>

<style scoped>
</style>
