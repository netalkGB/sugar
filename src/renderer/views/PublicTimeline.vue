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
      const timeline = this.tl.find(timeline => timeline.type === this.type)
      return timeline ? timeline.data : []
    }
  },
  data () {
    return {
      type: TimelineType.publictl,
      state: 'loading(next)'
    }
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
  },
  mounted () {
    this.setActive({ type: this.type })
  }
}
</script>

<style scoped>
</style>
