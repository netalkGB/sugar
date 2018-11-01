<template>
  <div>SelectUser</div>
</template>

<script>
import logger from '../other/Logger'
import { mapActions, mapGetters } from 'vuex'

export default {
  async created () {
    localStorage.setItem('currentPath', location.href.split('').filter((c, i) => i < location.href.length - 2).join(''))
    await this.loadUserConfig()
    logger.debug('select user')
    logger.debug('userList:')
    logger.debug(JSON.stringify(this.userList))
    if (this.userList.length <= 0) {
      logger.debug('goto adduser(auth)page')
      this.$router.push('/adduser')
    }
    if (this.userList.length === 1) {
      this.$router.push('/user/1/home_timeline')
    }
  },
  methods: {
    ...mapActions('users', ['loadUserConfig'])
  },
  computed: {
    ...mapGetters('users', { userList: 'getUserList' })
  }
}
</script>

<style>
</style>
