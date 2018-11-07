<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    <Conversations ref="conversations" :id="id" />
  </div>
</template>

<script>
import logger from '../other/Logger'
import { mapActions } from 'vuex'
import Conversations from '../components/Conversations/Conversations'

export default {
  components: { Conversations },
  props: { userId: Number, id: String },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig'])
  },
  async created () {
    await this.loadUserConfig()
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    this.$refs.conversations.loadToot()
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
