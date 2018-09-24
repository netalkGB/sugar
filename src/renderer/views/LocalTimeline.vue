<template>
  <div>
    <TimeLine :timeline="timeline"/>
  </div>
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
    ...mapActions('timelines', ['firstFetch', 'startStreaming'])
  },
  async created () {
    if (!this.currentUser) {
      await this.loadUserConfig()
    }

    this.firstFetch({ type: 'localtl' }).then(() => {
      this.startStreaming({ type: 'localtl' }).catch(e => {
        logger.debug(e)
      })
    })
  }
}
</script>

<style>
</style>
