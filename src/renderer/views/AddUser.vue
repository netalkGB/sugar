<template>
  <div>
    <h1>ユーザを追加</h1>
    <h2>Step 1. ホスト名を入力してください</h2>
    <input type="text" placeholder="mstdn.jp" v-model="host">
    <button @click="login">ログイン</button>
    <h2>Step 2. ブラウザが開くので表示されたPINコードをペーストしてください</h2>
    <input v-model="pin" type="text">
    <button :disabled="!canPushDone" @click="done">完了</button>
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
      pin: ''
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
      })
    },
    done () {
      const { clientId, clientSecret, pin, host } = this
      this.addUser({ clientId, clientSecret, pin, host }).then(() => {
        logger.debug('done:', 'success')
        this.saveUserConfig().catch(e => {
          logger.debug('save err')
          logger.debug(e)
        })
      }).catch(e => {
        logger.debug('err')
        logger.debug(e)
      })
    }
  }
}
</script>

<style>
</style>
