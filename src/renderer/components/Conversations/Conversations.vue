<template>
  <TimeLine
    ref="timeline"
    :infinite-mode="false"
    :timeline="conversations"
    :first-load-done="firstTimelineLoadDone"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TimeLine from '@/components/TimeLine/TimeLine'
import logger from '@/other/Logger'
import DialogMessage from '@/utils/DialogMessage'
export default {
  components: { TimeLine },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      firstTimelineLoadDone: false
    }
  },
  computed: {
    ...mapGetters('conversation', { conversations: 'getConversations' })
  },
  methods: {
    ...mapActions('conversation', ['loadConversations']),
    ...mapActions('modal', ['showMessage']),
    loadToot () {
      const messages = DialogMessage.getMessages('ja')
      this.loadConversations({ tootId: this.id }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.conversationFetchError })
      }).finally(() => {
        this.firstTimelineLoadDone = true
      })
    }
  }
}
</script>

<style scoped>
</style>
