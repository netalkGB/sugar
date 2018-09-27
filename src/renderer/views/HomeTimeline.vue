<template>
  <TimeLine @wantOldToot="wantOldToot" ref="timeline" :type="type" :timeline="timeline"/>
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
      const timeline = this.tl.find(timeline => timeline.type === this.type)
      return timeline ? timeline.data : []
    }
  },
  data () {
    return {
      type: TimelineType.hometl
    }
  },
  methods: {
    ...mapActions('users', ['loadUserConfig']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming', 'loadOldToot']),
    wantOldToot (args) {
      const { maxID } = args
      logger.debug('load old toots maxID:', maxID)
      this.loadOldToot({ type: this.type, maxID }).then(() => {
        this.$refs.timeline.$emit('loadOldTootDone', true)
      })
    }
  }
}
</script>

<style scoped>
</style>
