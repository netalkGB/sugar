<template>
  <TimeLine :timeline="timeline"/>
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
      return (this.tl.find(timeline => timeline.type === 'hometl')) ? this.tl.find(timeline => timeline.type === 'hometl').data : []
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
    const { host, accessToken } = this.currentUser
    logger.debug('accessToken', accessToken)
    logger.debug('host', host)
    this.accessToken = accessToken
    this.host = host
    this.firstFetch({ host, accessToken, type: 'hometl' }).then(() => {
      this.startStreaming({ host, accessToken, type: 'hometl' }).catch(e => {
        logger.debug(e)
      })
    })
  }
}
</script>

<style>
</style>
