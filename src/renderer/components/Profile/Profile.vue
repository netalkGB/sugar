<template>
  <div class="profile">
    <Header :profile="profile" />
    <Timeline class="tl" :timeline="timeline" />
  </div>
</template>

<script>
import Header from './Header'
import Timeline from './Timeline'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('profile')

export default {
  components: {
    Header, Timeline
  },
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
.tl {
  height: 100%;
}
</style>
