<template>
  <TimeLine @wantOldToot="wantOldToot" ref="timeline" :type="type" :timeline="timeline" @scrollStateChanged="handleScrollState" />
</template>

<script>
import TimeLine from '../components/TimeLine/TimeLine'
import TimelineType from '../other/TimelineType'
import { mapGetters, mapActions, mapState } from 'vuex'
import logger from '../other/Logger'
export default {
  components: { TimeLine },
  computed: {
    ...mapGetters('users', { currentUser: 'getCurrentUser' }),
    ...mapState({ tl: state => state.timelines.timelines }),
    timeline () {
      if (this.state === 'loading(next)') {
        this.cleaningTl({ type: this.type })
      }
      let timeline = this.tl.find(timeline => timeline.type === this.type)
      timeline.data = timeline.data.filter(tl => tl !== null)
      logger.debug('Notification.vue', JSON.stringify(timeline))
      return timeline ? timeline.data : []
    }
  },
  data () {
    return {
      type: TimelineType.notification,
      state: 'loading(next)'
    }
  },
  methods: {
    ...mapActions('users', ['loadUserConfig']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming', 'loadOldToot', 'cleaningTl', 'setActive']),
    wantOldToot (args) { },
    handleScrollState (state) {
      this.state = state
    }
  },
  mounted () {
    this.setActive({ type: this.type })
  }
}
</script>

<style scoped>
</style>
