<template>
  <div id="sidebar">
    <div>
      <SortableMenu
        :items="menu"
        @onChanged="handleChange"
      />
    </div>
    <div>
      <div @click="newToot">
        <Icon icon="toot" />
      </div>
      <div
        class="showSettingsMenu"
        @click="openSettingsMenu"
      >
        <Icon

          icon="settings"
        />
      </div>
    </div>
    <div
      v-show="isShowSettingMenu"
      ref="settingsMenu"
      class="settingsMenu"
    >
      <div class="menuitem">
        <div
          class="menuitemchildren"
          @mouseup="openSearchWindow"
        >
          ユーザ検索
        </div>
      </div>
      <div class="menuitem">
        <div
          class="menuitemchildren"
          @mouseup="openFavouriteWindow"
        >
          お気に入り
        </div>
      </div>
      <div class="menuitem">
        <div
          class="menuitemchildren"
          @mouseup="openOwnProfileWindow"
        >
          @{{ currentUser.user.userid }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SortableMenu from '@/components/Sidebar/SortableMenu'
import Icon from '@/components/Sidebar/Icon'
import logger from '@/other/Logger'
import { createNamespacedHelpers, mapActions } from 'vuex'
const { mapGetters } = createNamespacedHelpers('users')
const ipcRenderer = window.ipc
const keyCodeN = 78
export default {
  components: { SortableMenu, Icon },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      menu: null,
      isShowSettingMenu: false
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'getCurrentUser' })
  },
  created () {
    this.setupMenu()
  },
  mounted () {
    window.addEventListener('click', (e) => {
      const { path } = e
      const firstElem = path[0]
      const firstElemTagName = firstElem.tagName
      if (!(firstElemTagName === 'path' || firstElemTagName === 'svg')) {
        this.isShowSettingMenu = false
      }
    })
    window.addEventListener('keydown', (e) => {
      if (((e.ctrlKey || e.metaKey) && e.keyCode === keyCodeN)) {
        this.newToot()
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('keydown', () => { })
    window.removeEventListener('click', () => { })
  },
  methods: {
    ...mapActions('users', ['setMenu']),
    ...mapActions('timelines', ['profile']),
    openSettingsMenu () {
      if (this.isShowSettingMenu) {
        this.isShowSettingMenu = false
        return
      }
      this.$nextTick(() => { this.isShowSettingMenu = !this.isShowSettingMenu })
    },
    openSearchWindow () {
      const url = this.$router.resolve(`/search/${this.userId}`).href
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send('newWindow', `${currentPath}${url}`, 'searchWindow')
      this.isShowSettingMenu = false
    },
    openFavouriteWindow () {
      const currentPath = localStorage.getItem('currentPath')
      const currentUser = this.currentUser
      const { user } = currentUser
      const { userid } = user
      const url = this.$router.resolve(`/favourite/${this.userId}?screenName=${userid}`).href
      ipcRenderer.send('newWindow', `${currentPath}${url}`, 'favouriteWindow')
      this.isShowSettingMenu = false
    },
    openOwnProfileWindow () {
      const { internalid } = this.currentUser.user
      this.profile({ internalid })
    },
    newToot () {
      const url = this.$router.resolve(`/newtoot/${this.userId}`).href
      const currentPath = localStorage.getItem('currentPath')
      ipcRenderer.send('newWindow', `${currentPath}${url}`, 'newToot')
    },
    handleChange (newVal) {
      logger.debug('menu', JSON.stringify(newVal))
      this.setMenu(newVal)
    },
    setupMenu () {
      const defaultMenu = [
        { icon: 'home_timeline', to: { name: 'user-userId-hometimeline' } },
        { icon: 'local_timeline', to: { name: 'user-userId-localtimeline' } },
        { icon: 'public_timeline', to: { name: 'user-userId-publictimeline' } },
        { icon: 'notifications', to: { name: 'user-userId-notification' } }
      ]
      let menu = this.currentUser.menu
      if (!menu) {
        logger.debug('load default value(sidebar config)')
        menu = defaultMenu
      }
      const userId = this.userId
      const params = { userId }
      this.menu = menu.map(val => ({ ...val, to: { ...val.to, params } }))
    }
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
.settingsMenu {
  position: absolute;
  background-color: #fefefe;
  bottom: 30px;
  left: 30px;
  box-shadow: 2px 2px 4px gray;
  z-index: 2;
}
.menuitemchildren {
  padding-right: 10px;
  padding-left: 20px;
}
.menuitem {
  font-size: 12px;
}
.menuitem:hover {
  background-color: #aabbee;
}
</style>
