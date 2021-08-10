<template>
  <div ref="adduser">
    <div id="main">
      <h1>ユーザを追加</h1>
      <h2>Step 1. ホスト名を入力してください</h2>
      <p class="control">
        <MtTextBox v-model="host" placeholder="mstdn.jp" class="textbox" />
        <MtButton @click.native="login">
          ログイン
        </MtButton>
      </p>
      <p v-if="invalidHostName">
        ホストに接続できません
      </p>
      <h2>Step 2. ブラウザが開くので表示されたPINコードをペーストしてください</h2>
      <p class="control">
        <MtTextBox v-model="pin" placeholder="PINコード" class="textbox" />
        <MtButton
          :disabled="!canPushDone"
          @click.native="done"
        >
          完了
        </MtButton>
      </p>
      <p v-if="invalidPINCode">
        認証できませんでした
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import logger from '@/other/Logger'
import contextMenu from '@/other/contextMenu'
import MtTextBox from '@/components/Form/MtTextBox.vue'
import MtButton from '@/components/Form/MtButton.vue'

const { mapActions, mapGetters } = createNamespacedHelpers('users')
const ipcRenderer = window.ipc
export default Vue.extend({
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
  computed: {
    ...mapGetters({ userList: 'getUserList' })
  },
  watch: {
    userList () {
      logger.debug(this.userList)
    }
  },
  created () {
    ipcRenderer.send('changeWindowSize', 'adduser')
  },
  mounted () {
    const adduser = this.$refs.adduser as HTMLDivElement
    adduser.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      contextMenu()
    })
  },
  beforeDestroy () {
    const adduser = this.$refs.adduser as HTMLDivElement
    adduser.removeEventListener('contextmenu', () => { })
  },
  methods: {
    ...mapActions(['getPIN', 'addUser', 'saveUserConfig']),
    login () {
      this.getPIN(this.host).then((obj) => {
        this.clientId = obj.clientId
        this.clientSecret = obj.clientSecret
        logger.debug('url', obj.url)
        ipcRenderer.send('openURL', obj.url)
        this.canPushDone = true
      }).catch((e) => {
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
        this.saveUserConfig().catch((e) => {
          logger.debug('save err')
          logger.debug(e)
        })
      }).catch((e) => {
        logger.debug('err')
        logger.debug(e)
        this.invalidPINCode = true
      })
    }
  }
})
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
.control {
  display:flex;
}
</style>
