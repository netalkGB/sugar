<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <h1>fav</h1>
    {{screenName}}
  </div>
</template>

<script>
import logger from '@/other/Logger'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('users')

export default {
  props: ['userId', 'screenName'],
  components: {},
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    ...mapActions(['setCurrentUserId', 'loadUserConfig'])
  },
  created () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', e => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
    window.addEventListener('storage', event => {
      if (event.key === 'user' + this.userId) {
        const val = JSON.parse(event.newValue)
        if (val.type === 'deleteToot') {
          this.removeToot({ id: val.id })
        }
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
    window.removeEventListener('storage', () => { })
  }
}
</script>

<style scoped>
.searchContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
