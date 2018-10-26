<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    <div id="menu">
      <Sidebar :userId="userId" />
    </div>
    <router-view id="content"></router-view>
  </div>
</template>

<script>
import logger from '../other/Logger'
import TimelineType from '../other/TimelineType'
import Sidebar from '../components/Sidebar/Sidebar'
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
export default {
  props: { userId: Number },
  components: {
    Sidebar
  },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming'])
  },
  async created () {
    ipcRenderer.send('changeWindowSize', 'main')
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    this.firstFetch({ type: TimelineType.localtl }).then(() => {
      this.startStreaming({ type: TimelineType.localtl }).catch(e => {
        logger.debug(e)
      })
    })
    this.firstFetch({ type: TimelineType.hometl }).then(() => {
      this.startStreaming({ type: TimelineType.hometl }).catch(e => {
        logger.debug(e)
      })
    })
    this.firstFetch({ type: TimelineType.publictl }).then(() => {
      this.startStreaming({ type: TimelineType.publictl }).catch(e => {
        logger.debug(e)
      })
    })
    this.firstFetch({ type: TimelineType.notification }).then(() => {})
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', e => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  }
}
</script>

<style scoped>
#main {
  display: flex;
  user-select: none;
}
#content {
  width: calc(100% - 40px);
  height: 100%;
}

#menu {
  width: 40px;
  height: 100%;
  overflow-y: hidden;
}
</style>
