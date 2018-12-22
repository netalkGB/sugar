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
      :style="{ height: `calc(100% - ${profileHeight})`}"
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
      profileHeight: '50%'
    }
  },
  props: ['internalId', 'userId'],
  methods: {
    ...mapActions(['fetchProfile', 'fetchProfileTimeline']),
    fetch () {
      const internalId = this.internalId
      this.fetchProfileTimeline({ internalId }).then(() => { })
      this.fetchProfile({ internalId }).then(() => {
        this.profileHeight = this.$refs.profile.$el.clientHeight + 'px'
      })
    }
  },
  computed: {
    ...mapState({ profile: state => state.profile, timeline: state => state.timeline })
  }
}
</script>

<style scoped>
</style>
