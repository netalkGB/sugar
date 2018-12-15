<template>
  <div ref="adduser">
    <div id="main">
      <h1>ユーザを追加</h1>
      <h2>Step 1. ホスト名を入力してください</h2>
      <input placeholder="mstdn.jp" v-model="host">
      <p class="control">
        <button @click="login">ログイン</button>
      </p>
      <p v-if="invalidHostName">ホストに接続できません</p>
      <h2>Step 2. ブラウザが開くので表示されたPINコードをペーストしてください</h2>
      <input placeholder="PINコード" v-model="pin">
        <p class="control">
          <button :disabled="!canPushDone" @click="done">完了</button>
        </p>
      <p v-if="invalidPINCode">認証できませんでした</p>
    </div>
  </div>
</template>

<script>
import { shell, ipcRenderer, remote } from 'electron'
import { createNamespacedHelpers } from 'vuex'
import logger from '@/other/Logger'
import contextMenu from '@/other/contextMenu'
const { mapActions, mapGetters } = createNamespacedHelpers('users')

export default {
  data () {
    return {
      host: '',
      canPushDone: false,
      clientId: '',
      clientSecret: '',
      pin: '',
      invalidHostName: false,
      invalidPINCode: false
    }
  },
  watch: {
    userList: function () {
      logger.debug(this.userList)
    }
  },
  created () {
    ipcRenderer.send('changeWindowSize', 'adduser')
  },
  mounted () {
    const menu = contextMenu(remote)
    this.$refs.adduser.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      menu.popup(remote.getCurrentWindow())
    })
  },
  beforeDestroy () {
    this.$refs.adduser.removeEventListener('contextmenu', () => {})
  },
  computed: {
    ...mapGetters({ userList: 'getUserList' })
  },
  methods: {
    ...mapActions(['getPIN', 'addUser', 'saveUserConfig']),
    login () {
      this.getPIN(this.host).then(obj => {
        this.clientId = obj.clientId
        this.clientSecret = obj.clientSecret
        logger.debug('url', obj.url)
        shell.openExternal(obj.url)
        this.canPushDone = true
      }).catch(e => {
        logger.debug('err')
        logger.debug(e)
        this.invalidHostName = true
      })
    },
    done () {
      const { clientId, clientSecret, pin, host } = this
      this.addUser({ clientId, clientSecret, pin, host }).then(() => {
        logger.debug('done:', 'success')
        this.$router.push('/')
        this.saveUserConfig().catch(e => {
          logger.debug('save err')
          logger.debug(e)
        })
      }).catch(e => {
        logger.debug('err')
        logger.debug(e)
        this.invalidPINCode = true
      })
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 8px;
  margin-top: 8px;
}
#main {
  margin: 24px;
}
</style>
