<template>
  <div
    id="main"
    ref="top"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <Conversations
      :id="id"
      ref="conversations"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import logger from '@/other/Logger'
import Conversations from '@/components/Conversations/Conversations'

export default {
  components: { Conversations },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    userId () {
      return Number(this.$route.params.userId)
    },
    id () {
      return String(this.$route.query.id)
    }
  },
  created () {
    this.loadUserConfig()
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' + this.userId) {
        const val = JSON.parse(event.newValue)
        if (val.type === 'deleteToot') {
          this.removeToot({ id: val.id })
        }
      }
    })
  },
  mounted () {
    this.$refs.conversations.loadToot()
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (_event) => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
    window.removeEventListener('storage', () => { })
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('conversation', ['removeToot'])
  }
}
</script>

<style scoped>
</style>
