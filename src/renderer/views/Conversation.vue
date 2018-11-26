<template>
  <div
    id="main"
    ref="top"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <Conversations
      ref="conversations"
      :id="id"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import logger from '@/other/Logger'
import Conversations from '@/components/Conversations/Conversations'

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
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('conversation', ['removeToot'])
  },
  async created () {
    await this.loadUserConfig()
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    window.addEventListener('storage', event => {
      if (event.key === 'user' + this.userId) {
        const val = JSON.parse(event.newValue)
        if (val.type === 'deleteToot') {
          this.removeToot({ id: val.id })
        }
      }
    })
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
    window.removeEventListener('storage', () => { })
  }
}
</script>

<style scoped>
</style>
