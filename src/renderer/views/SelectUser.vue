<template>
  <div>SelectUser</div>
</template>

<script>
import logger from '../other/Logger'
import Settings from '../other/Settings'
export default {
  async mounted () {
    logger.debug('select user')
    const users = await Settings.getUsers()
    logger.debug('users:', users)
    if (users === null) {
      logger.debug('goto adduser(auth)page')
      this.$router.push('/adduser')
    }
  }
}
</script>

<style>
</style>
