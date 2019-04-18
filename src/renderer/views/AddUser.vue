<template>
  <div ref="adduser">
    <div id="main">
      <h1>ユーザを追加</h1>
      <h2>Step 1. ホスト名を入力してください</h2>
      <p class="control" style="display:flex;">
        <MtTextBox placeholder="mstdn.jp" v-model="host" class="textbox"></MtTextBox>
        <MtButton @click.native="login">ログイン</MtButton>
      </p>
      <p v-if="invalidHostName">ホストに接続できません</p>
      <h2>Step 2. ブラウザが開くので表示されたPINコードをペーストしてください</h2>
      <p class="control" style="display:flex;">
        <MtTextBox placeholder="PINコード" v-model="pin" class="textbox"></MtTextBox>
        <MtButton
          :disabled="!canPushDone"
          @click.native="done"
        >完了</MtButton>
      </p>
      <p v-if="invalidPINCode">認証できませんでした</p>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import logger from '@/other/Logger'
import contextMenu from '@/other/contextMenu'
import MtTextBox from '@/components/Form/MtTextBox'
import MtButton from '@/components/Form/MtButton'

const { mapActions, mapGetters } = createNamespacedHelpers('users')
const ipcRenderer = window.ipc
const remote = window.remote
export default {
  components: {
    MtTextBox,
    MtButton
  },
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
    this.$refs.adduser.removeEventListener('contextmenu', () => { })
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
        ipcRenderer.send('openURL', obj.url)
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
  margin-bottom: 4px;
  margin-top: 4px;
}
#main {
  margin: 7px;
}
.textbox {
  height: 26px;
  margin-right: 4px;
}
.button {
  height:28px;
  font-size: 12px;
}
</style>
