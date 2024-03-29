<template>
  <div
    id="main"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <div id="menu">
      <Sidebar :user-id="userId" />
    </div>
    <nuxt v-if="ownFollowerAndFollowingLoaded" id="content" />
    <Modal />
    <Loading v-if="!ownFollowerAndFollowingLoaded"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import logger from '@/other/Logger'
import TimelineType from '@/other/TimelineType'
import Sidebar from '@/components/Sidebar/Sidebar'
import Modal from '@/components/Modal/Modal'
import Loading from '@/components/TimeLine/Loading'
import DialogMessage from '@/utils/DialogMessage'

const ipcRenderer = window.ipc

export default {
  components: {
    Sidebar,
    Modal,
    Loading
  },
  data () {
    return {
      width: 0,
      height: 0,
      ownFollowerAndFollowingLoaded: false
    }
  },
  computed: {
    userId () {
      const userId = this.$route.params.userId
      const base = 10
      return parseInt(userId, base)
    }
  },
  async created () {
    const messages = DialogMessage.getMessages('ja')
    ipcRenderer.send('changeWindowSize', 'main')
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    try {
      await this.firstFetchOwnFollowerAndFollowing()
    } catch (e) {
      logger.error(e)
      this.showMessage({ message: messages.ownFollowingFollowersFetchError })
    }
    this.firstFetch({ type: TimelineType.localtl }).then(() => {
      this.startStreaming({ type: TimelineType.localtl }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.localTimelineStreamError })
      })
    }).catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.localTimelineFetchError })
    })
    this.firstFetch({ type: TimelineType.hometl }).then(() => {
      this.startStreaming({ type: TimelineType.hometl }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.homeTimelineStreamError })
      })
    }).catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.homeTimelineFetchError })
    })
    this.firstFetch({ type: TimelineType.publictl }).then(() => {
      this.startStreaming({ type: TimelineType.publictl }).catch((e) => {
        logger.error(e)
        this.showMessage({ message: messages.publicTimeLineStreamError })
      })
    }).catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.publicTimelineFetchError })
    })
    this.firstFetch({ type: TimelineType.notification }).catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.notificationFetchError })
    })
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (_event) => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'fetchOwnFollowerAndFollowing']),
    ...mapActions('timelines', ['firstFetch', 'startStreaming']),
    ...mapActions('modal', ['showMessage']),
    async firstFetchOwnFollowerAndFollowing () {
      try {
        await this.fetchOwnFollowerAndFollowing()
      } finally {
        this.ownFollowerAndFollowingLoaded = true
      }
    }
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
