<template>
  <div
    ref="container"
    class="profile"
  >
    <Header
      ref="profile"
      :profile="profile"
    />
    <Timeline
      ref="timeline"
      :timeline="timeline"
      :style="{ height: `calc(100% - ${profileHeight}px)`}"
    />
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
  data () {
    return {
      profileHeight: 50
    }
  },
  props: ['internalId', 'userId'],
  methods: {
    ...mapActions(['fetchProfile', 'fetchProfileTimeline']),
    async fetch () {
      const internalId = this.internalId
      await Promise.all([this.fetchProfile({ internalId }), this.fetchProfileTimeline({ internalId })])
      this.profileHeight = this.$refs.profile.$el.clientHeight
      console.log(this.timelineHeight)
    }
  },
  computed: {
    ...mapState({ profile: state => state.profile, timeline: state => state.timeline })
  }
}
</script>

<style scoped>
</style>
