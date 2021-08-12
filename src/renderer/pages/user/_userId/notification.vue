<template>
  <TimeLine
    ref="timeline"
    :type="type"
    :timeline="timelineData"
    :first-load-done="firstLoadDone"
    @wantOldToot="wantOldToot"
    @scrollStateChanged="handleScrollState"
  />
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import TimeLine from '@/components/TimeLine/TimeLine'
import TimelineType from '@/other/TimelineType'
import logger from '@/other/Logger'

export default {
  components: { TimeLine },
  layout: 'main',
  data () {
    return {
      type: TimelineType.notification,
      state: 'loading(next)'
    }
  },
  computed: {
    ...mapGetters('users', { currentUser: 'getCurrentUser' }),
    ...mapState({ tl: state => state.timelines.timelines }),
    currentTimeline () {
      return this.tl.find(timeline => timeline.type === this.type)
    },
    timelineData () {
      if (this.state === 'loading(next)') {
        this.cleaningTl({ type: this.type })
      }
      const timeline = this.currentTimeline
      return timeline ? timeline.data : []
    },
    firstLoadDone () {
      const timeline = this.currentTimeline
      return timeline && timeline.firstLoadDone
    }
  },
  mounted () {
    this.setActive({ type: this.type })
  },
  methods: {
    ...mapActions('users', ['loadUserConfig']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming', 'loadOldToot', 'cleaningTl', 'setActive']),
    wantOldToot (args) {
      const { maxID } = args
      logger.debug('load old toots maxID:', maxID)
      this.loadOldToot({ type: this.type, maxID }).then(() => {
        this.$refs.timeline.$emit('loadOldTootDone', true)
      })
    },
    handleScrollState (state) {
      this.state = state
    }
  }
}
</script>

<style scoped>
</style>
