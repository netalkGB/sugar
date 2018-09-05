<template>
  <div>SelectUser</div>
</template>

<script>
import logger from '../other/Logger'
import { mapActions, mapGetters } from 'vuex'

export default {
  async mounted () {
    await this.loadUserConfig()
    logger.debug('select user')
    logger.debug('userList:')
    logger.debug(JSON.stringify(this.userList))
    if (this.userList.length <= 0) {
      logger.debug('goto adduser(auth)page')
      this.$router.push('/adduser')
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
