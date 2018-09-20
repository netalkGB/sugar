<template>
  <TimeLine :timeline="timeline"/>
</template>

<script>
import TimeLine from '../components/TimeLine/TimeLine'
import { mapGetters, mapActions } from 'vuex'
import logger from '../other/Logger'
import { ipcRenderer } from 'electron'
import Toot from '../other/Toot'
export default {
  components: { TimeLine },
  computed: {
    ...mapGetters('users', { currentUserId: 'getCurrentUserId', userList: 'getUserList' })
  },
  data () {
    return {
      data: [], host: '', accessToken: '', timeline: []
    }
  },
  methods: {
    ...mapActions('users', ['loadUserConfig']),
    fetch () {
      const host = this.host
      const accessToken = this.accessToken
      return new Promise((resolve, reject) => {
        ipcRenderer.once('fetchHomeTimeline-success', (_, result) => {
          resolve(result)
        })
        ipcRenderer.once('fetchHomeTimeline-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('fetchHomeTimeline', { host, accessToken })
      })
    },
    startStream () {
      const host = this.host
      const accessToken = this.accessToken
      return new Promise((resolve, reject) => {
        ipcRenderer.once('streamHomeTimeline-error', (_, e) => {
          reject(e)
        })
        ipcRenderer.send('streamHomeTimeline', { host, accessToken })
      })
    }
  },
  async destroyed () {
    logger.debug('HomeTimeline destroyed')
    ipcRenderer.removeAllListeners(['streamHomeTimeline-onError', 'streamHomeTimeline-onMessage'])
  },
  async created () {
    ipcRenderer.on('streamHomeTimeline-onMessage', (event, msg) => {
      logger.debug('stream', msg)
    })
    ipcRenderer.on('streamHomeTimeline-onError', (event, error) => {
      logger.debug('stream-onError', error)
    })
    logger.debug('HomeTimeline')
    if (this.userList.length <= 0) {
      await this.loadUserConfig()
    }
    const userid = this.currentUserId
    const { accessToken, host } = this.userList.find(user => user.userNumber === userid)
    logger.debug('accessToken', accessToken)
    logger.debug('host', host)
    this.accessToken = accessToken
    this.host = host
    this.fetch(host, accessToken).then(response => {
      const { data } = response
      this.timeline = data.map(item => Toot.fromMastodon(item))
    })
    // this.startStream().catch(e => logger.debug(e))
    // this.fetch(host, accessToken).then(result => {
    //   logger.debug(result)
    //   this.data = result
    // }).catch(err => {
    //   logger.debug(err)
    // })
  }
}
</script>

<style>
</style>
