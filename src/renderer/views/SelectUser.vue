<template>
  <div>SelectUser</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import logger from '@/other/Logger'
const { mapActions, mapGetters } = createNamespacedHelpers('users')

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
      if (!this.userList[0].menu) {
        this.$router.push('/user/1/home_timeline')
      } else {
        this.$router.push(this.userList[0].menu[0].to)
      }
    }
  },
  methods: {
    ...mapActions(['loadUserConfig'])
  },
  computed: {
    ...mapGetters({ userList: 'getUserList' })
  }
}
</script>

<style>
</style>
