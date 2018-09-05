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
import Mastodon from 'mastodon-api'
import logger from '../other/Logger'
import { shell } from 'electron'
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions([{ getAccessToken: 'users/addUser' }]),
    async login () {
      const res = await Mastodon.createOAuthApp(
        `https://${this.host}/api/v1/apps`,
        'mastoot',
        'read write follow'
      )
      this.clientId = res.client_id
      this.clientSecret = res.client_secret
      logger.debug('clientId:', this.clientId)
      logger.debug('clientSecret:', this.clientSecret)
      const url = await Mastodon.getAuthorizationUrl(
        this.clientId,
        this.clientSecret,
        `https://${this.host}`,
        'read write follow'
      )
      logger.debug(url)
      shell.openExternal(url)
      this.canPushDone = true
    },
    done () {
      Mastodon.getAccessToken(
        this.clientId,
        this.clientSecret,
        this.pin,
        `https://${this.host}`
      ).then(accessToken => {
        logger.debug('token', accessToken)
      })
      // this.$store.dispatch('users/addUser', { clientId, clientSecret, pin, host })
    }
  }
}
</script>

<style>
</style>
