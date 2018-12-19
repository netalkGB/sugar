<template>
  <div style="word-wrap: break-word;">
    [WIP]<br>{{profile}}<br>{{timeline}}
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('profile')

export default {
  props: ['internalId', 'userId'],
  methods: {
    ...mapActions(['fetchProfile', 'fetchProfileTimeline']),
    async fetch () {
      const internalId = this.internalId
      await Promise.all([this.fetchProfile({ internalId }), this.fetchProfileTimeline({ internalId })])
    }
  },
  computed: {
    ...mapState({ profile: state => state.profile, timeline: state => state.timeline })
  }
}
</script>

<style scoped>
</style>
