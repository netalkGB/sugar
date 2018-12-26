<template>
  <div id="sidebar">
    <div>
      <SortableMenu
        :items="menu"
        @onChanged="handleChange"
      />
      <Icon
        to="#"
        icon="addTab"
      />
    </div>
    <div>
      <div @click="newToot">
        <Icon icon="toot" />
      </div>
      <Icon
        to="#"
        icon="settings"
      />
    </div>
  </div>
</template>

<script>
import SortableMenu from '@/components/Sidebar/SortableMenu'
import Icon from '@/components/Sidebar/Icon'
import logger from '@/other/Logger'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('users')
const ipcRenderer = window.ipc
const keyCodeN = 78
export default {
  components: { SortableMenu, Icon },
  props: { userId: Number },
  computed: {
    ...mapGetters({ currentUser: 'getCurrentUser' })
  },
  data () {
    return {
      menu: null
    }
  },
  methods: {
    ...mapActions(['setMenu']),
    newToot () {
      const url = this.$router.resolve(`/newtoot/${this.userId}`).href
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send('newWindow', `${currentPath}${url}`, 'newToot')
    },
    handleChange (newVal) {
      logger.debug('menu', JSON.stringify(newVal))
      this.setMenu(newVal)
    }
  },
  created () {
    if (this.currentUser.menu) {
      this.menu = this.currentUser.menu
    }
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (((e.ctrlKey || e.metaKey) && e.keyCode === keyCodeN)) {
        this.newToot()
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('input', () => { })
  }
}
</script>

<style scoped>
#sidebar {
  background-color: #efefef;
  height: 100%;
  border-right: thin solid #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
