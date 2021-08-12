<template>
  <div
    ref="container"
    class="profile"
  >
    <template v-if="loadDone">
      <Header
        ref="profile"
        :profile="profile"
        @wantRecalculateHeight="calculateHeight"
      />
    </template>
    <Timeline
      ref="timeline"
      :timeline="timeline"
      :followers="followers"
      :following="following"
      :active="active"
      :style="{ height: `calc(100% - ${profileHeight})`}"
      :first-timeline-load-done="firstTimelineLoadDone"
      :first-followers-load-done="firstFollowersLoadDone"
      :first-following-load-done="firstFollowingLoadDone"
      @wantOldToot="wantOldToot"
    />
  </div>
</template>

<script>
import logger from '@/other/Logger'
import { mapActions, mapState } from 'vuex'
import DialogMessage from '@/utils/DialogMessage'
import Header from './Header'
import Timeline from './Timeline'

export default {
  components: {
    Header, Timeline
  },
  props: {
    internalId: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      profileHeight: '50%',
      loadDone: false,
      firstTimelineLoadDone: false,
      firstFollowersLoadDone: false,
      firstFollowingLoadDone: false
    }
  },
  computed: {
    ...mapState('profile', { profile: state => state.profile, timeline: state => state.timeline, followers: state => state.followers, following: state => state.following, active: state => state.active })
  },
  methods: {
    ...mapActions('profile', ['fetchProfile', 'fetchProfileTimeline', 'loadOldToot', 'fetchProfileFollowers', 'fetchProfileFollowing']),
    ...mapActions('modal', ['showMessage']),
    fetch () {
      const internalId = this.internalId
      const messages = DialogMessage.getMessages('ja')
      this.fetchProfileTimeline({ internalId }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.profileTimelineFetchError })
      }).finally(() => {
        this.firstTimelineLoadDone = true
      })
      this.fetchProfileFollowers({ internalId }).then(() => logger.debug(`follower: ${this.followers.length}`)).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.profileFollowersFetchError })
      }).finally(() => {
        this.firstFollowersLoadDone = true
      })
      this.fetchProfileFollowing({ internalId }).then(() => logger.debug(`following: ${this.following.length}`)).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.profileFollowingFetchError })
      }).finally(() => {
        this.firstFollowingLoadDone = true
      })
      this.fetchProfile({ internalId }).then(() => {
        this.loadDone = true
        this.$nextTick(function () {
          this.calculateHeight()
        })
      }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.profileFetchError })
      })
    },
    wantOldToot (maxID) {
      logger.debug('load old toots maxID:', maxID)
      const internalId = this.internalId
      this.loadOldToot({ internalId, maxID }).then(() => {
        this.$refs.timeline.loadOldTootDone()
      }).catch((e) => {
        const messages = DialogMessage.getMessages('ja')
        logger.error(e)
        this.showMessage({ message: messages.profileTimelineFetchError })
      })
    },
    calculateHeight () {
      this.profileHeight = this.$refs.profile.$el.clientHeight + 'px'
    }
  }
}
</script>

<style scoped>
</style>
