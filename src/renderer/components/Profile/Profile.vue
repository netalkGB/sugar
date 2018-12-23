<template>
  <div
    ref="container"
    class="profile"
  >
    <Header
      ref="profile"
      :profile="profile"
      @wantRecalculateHeight="calculateHeight"
    />
    <Timeline
      ref="timeline"
      :timeline="timeline"
      :style="{ height: `calc(100% - ${profileHeight})`}"
      @wantOldToot="wantOldToot"
    />
  </div>
</template>

<script>
import Header from './Header'
import Timeline from './Timeline'
import logger from '@/other/Logger'

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
    ...mapActions(['fetchProfile', 'fetchProfileTimeline', 'loadOldToot']),
    fetch () {
      const internalId = this.internalId
      this.fetchProfileTimeline({ internalId }).catch((e) => { logger.error(e) })
      this.fetchProfile({ internalId }).then(() => {
        this.calculateHeight()
      }).catch((e) => { logger.error(e) })
    },
    wantOldToot (maxID) {
      logger.debug('load old toots maxID:', maxID)
      const internalId = this.internalId
      this.loadOldToot({ internalId, maxID }).then(() => {
        this.$refs.timeline.loadOldTootDone()
      }).catch((e) => { logger.error(e) })
    },
    calculateHeight () {
      this.profileHeight = this.$refs.profile.$el.clientHeight + 'px'
    }
  },
  computed: {
    ...mapState({ profile: state => state.profile, timeline: state => state.timeline })
  }
}
</script>

<style scoped>
</style>
