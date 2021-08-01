<template>
  <TimeLine
    ref="timeline"
    :infinite-mode="false"
    :timeline="conversations"
  />
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import TimeLine from '@/components/TimeLine/TimeLine'
const { mapActions, mapGetters } = createNamespacedHelpers('conversation')
export default {
  components: { TimeLine },
  props: ['id'],
  computed: {
    ...mapGetters({ conversations: 'getConversations' })
  },
  methods: {
    ...mapActions(['loadConversations']),
    loadToot () {
      this.loadConversations({ tootId: this.id })
    }
  }
}
</script>

<style scoped>
</style>
