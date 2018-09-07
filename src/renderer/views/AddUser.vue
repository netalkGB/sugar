<template>
  <div>
    <div id="main">
      <h1>ユーザを追加</h1>
      <h2>Step 1. ホスト名を入力してください</h2>
      <b-field>
        <b-input placeholder="mstdn.jp"
            type="search"
            v-model="host"
        >
        </b-input>
        <p class="control">
            <button class="button is-primary" @click="login">ログイン</button>
        </p>
      </b-field>
      <p v-if="invalidHostName">ホストに接続できません</p>
      <h2>Step 2. ブラウザが開くので表示されたPINコードをペーストしてください</h2>
      <b-field>
          <b-input placeholder="PINコード"
              type="search"
              v-model="pin"
          >
          </b-input>
          <p class="control">
              <button :disabled="!canPushDone" class="button is-success" @click="done">完了</button>
          </p>
      </b-field>
      <p v-if="invalidPINCode">認証できませんでした</p>
    </div>
  </div>
</template>

<script>
import logger from '../other/Logger'
import { shell } from 'electron'
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters('users', { userList: 'getUserList' })
  },
  methods: {
    ...mapActions('users', ['getPIN', 'addUser', 'saveUserConfig']),
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
  margin:24px;
}
</style>
