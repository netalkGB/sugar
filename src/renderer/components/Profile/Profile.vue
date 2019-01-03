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
      :followers="followers"
      :following="following"
      :active="active"
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
    ...mapActions(['fetchProfile', 'fetchProfileTimeline', 'loadOldToot', 'fetchProfileFollowers', 'fetchProfileFollowing']),
    fetch () {
      const internalId = this.internalId
      this.fetchProfileTimeline({ internalId }).catch((e) => { logger.error(e) })
      this.fetchProfileFollowers({ internalId }).then(() => logger.debug(`follower: ${this.followers.length}`)).catch(e => logger.error(e))
      this.fetchProfileFollowing({ internalId }).then(() => logger.debug(`following: ${this.following.length}`)).catch(e => logger.error(e))
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
    ...mapState({ profile: state => state.profile, timeline: state => state.timeline, followers: state => state.followers, following: state => state.following, active: state => state.active })
  }
}
</script>

<style scoped>
</style>
