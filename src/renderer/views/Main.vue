<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    <div id="menu">
      <Sidebar />
    </div>
    <router-view id="content" ></router-view>
  </div>
</template>

<script>
import logger from '../other/Logger'
import Sidebar from '../components/Sidebar/Sidebar'
import { mapActions } from 'vuex'

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
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
    this.firstFetch({ type: 'localtl' }).then(() => {
      this.startStreaming({ type: 'localtl' }).catch(e => {
        logger.debug(e)
      })
    })
    this.firstFetch({ type: 'hometl' }).then(() => {
      this.startStreaming({ type: 'hometl' }).catch(e => {
        logger.debug(e)
      })
    })
    this.firstFetch({ type: 'publictl' }).then(() => {
      this.startStreaming({ type: 'publictl' }).catch(e => {
        logger.debug(e)
      })
    })
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
    window.removeEventListener('resize')
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
#content::-webkit-scrollbar {
  width: 8px;
}
#content::-webkit-scrollbar-track {
  background: #efefef;
}
#content::-webkit-scrollbar-thumb {
  background: #cccccc;
}
#menu {
  width: 40px;
  height: 100%;
  overflow-y: hidden;
}
</style>
