<template>
  <TimeLine :infiniteMode="false" ref="timeline" :timeline="conversations" />
</template>

<script>
import TimeLine from '../TimeLine/TimeLine'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: { TimeLine },
  props: ['id'],
  computed: {
    ...mapGetters('conversation', { conversations: 'getConversations' })
  },
  methods: {
    ...mapActions('conversation', ['loadConversations']),
    loadToot () {
      this.loadConversations({ tootId: this.id })
    }
  }
}
</script>

<style scoped>
</style>
