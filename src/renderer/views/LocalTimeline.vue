<template>
  <TimeLine @wantOldToot="wantOldToot" ref="timeline" type="localtl" :timeline="timeline"/>
</template>

<script>
import TimeLine from '../components/TimeLine/TimeLine'
import { mapGetters, mapActions, mapState } from 'vuex'
import logger from '../other/Logger'
export default {
  components: { TimeLine },
  computed: {
    ...mapGetters('users', { currentUser: 'getCurrentUser' }),
    ...mapState({ tl: state => state.timelines.timelines }),
    timeline () {
      return (this.tl.find(timeline => timeline.type === 'localtl')) ? this.tl.find(timeline => timeline.type === 'localtl').data : []
    }
  },
  methods: {
    ...mapActions('users', ['loadUserConfig']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming', 'loadOldToot']),
    wantOldToot (args) {
      const { maxID } = args
      logger.debug('load old toots maxID:', maxID)
      this.loadOldToot({ type: 'localtl', maxID }).then(() => {
        this.$refs.timeline.$emit('loadOldTootDone', true)
      })
    }
  }
}
</script>

<style scoped>
</style>
