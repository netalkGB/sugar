<template>
  <div id="main" :style="{ width: width + 'px', height: height + 'px' }">
    <div id="menu">
      <Sidebar />
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
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
    ...mapActions('users', ['setCurrentUserId'])
  },
  created () {
    logger.debug('userId', this.userId)
    this.setCurrentUserId(this.userId)
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
  overflow-y: scroll;
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
