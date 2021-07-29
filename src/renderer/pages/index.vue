<template>
  <div>SelectUser</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import logger from '@/other/Logger'
const { mapActions, mapGetters } = createNamespacedHelpers('users')

export default Vue.extend({
  computed: {
    ...mapGetters({ userList: 'getUserList' })
  },
  created () {
    localStorage.setItem('currentPath', location.href.split('').filter((_c, i) => i < location.href.length - 2).join(''))
    this.loadUserConfig()
    logger.debug('select user')
    logger.debug('userList:')
    logger.debug(JSON.stringify(this.userList))
    if (this.userList.length <= 0) {
      logger.debug('goto adduser(auth)page')
      this.$router.push('/adduser')
    }
    if (this.userList.length === 1) {
      if (!this.userList[0].menu) {
        this.$router.push('/user/1/home_timeline')
      } else {
        this.$router.push(this.userList[0].menu[0].to)
      }
    }
  },
  methods: {
    ...mapActions(['loadUserConfig'])
  }
})
</script>

<style>
</style>
