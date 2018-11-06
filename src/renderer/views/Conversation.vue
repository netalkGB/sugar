<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    userId:{{userId}},id(toot):{{id}}
  </div>
</template>

<script>
import logger from '../other/Logger'
import { mapActions } from 'vuex'
export default {
  props: { userId: Number, id: String },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming'])
  },
  async created () {
    logger.debug('userId', this.userId)
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
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  }
}
</script>

<style scoped>
</style>
